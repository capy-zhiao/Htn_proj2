from typing import List, Dict, Any, Optional
import os
import json
import uuid
import re
from datetime import datetime
from mcp.server.fastmcp import FastMCP
import google.generativeai as genai
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastMCP server
mcp = FastMCP("chat_logger")

# Pydantic models for data validation
class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())

class ConversationSummary(BaseModel):
    conversation_id: str
    project_name: str = "MCP_Chat_Logger"
    tag: str = "function modify"  # bug fixed/function added/function modify
    description: str = ""
    before_code: Optional[str] = None
    after_code: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    message_count: int
    participants: List[str]
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    messages: List[ChatMessage]

def ensure_logs_directory():
    """Ensure the logs directory exists"""
    if not os.path.exists("chat_logs"):
        os.makedirs("chat_logs")

def format_message(message: Dict[str, Any]) -> str:
    """Format message into Markdown format"""
    role = message.get("role", "unknown")
    content = message.get("content", "")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return f"""
### {role.capitalize()} - {timestamp}

{content}

---
"""

def analyze_conversation_with_gemini(messages: List[Dict[str, Any]]) -> Dict[str, str]:
    """Use Gemini to analyze the entire conversation and extract code changes"""
    # Set API key from environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        return {
            "tag": "other",
            "description": "Gemini API key not configured",
            "title": "Chat Conversation",
            "summary": "Gemini analysis not available - API key missing",
            "before_code": None,
            "after_code": None
        }
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    
    try:
        # Format conversation for analysis
        conversation_text = ""
        for msg in messages:
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            conversation_text += f"{role.upper()}: {content}\n\n"
        
        # Extract all code blocks from conversation
        all_code_blocks = []
        for msg in messages:
            content = msg.get("content", "")
            code_blocks = re.findall(r'```(?:python|py|javascript|js|typescript|ts|java|cpp|c|html|css|sql|bash|sh)?\n(.*?)```', content, re.DOTALL)
            for code_block in code_blocks:
                if len(code_block.strip()) > 50:
                    all_code_blocks.append(code_block.strip())
        
        # Create prompt for OpenAI
        prompt = f"""
Analyze this programming conversation and extract code changes:

Conversation:
{conversation_text}

Code blocks found in conversation:
{chr(10).join(f"```{i+1}: {code[:200]}...```" for i, code in enumerate(all_code_blocks))}

Please provide a JSON response with the following fields:
{{
    "tag": "bug fixed" | "function added" | "function modify" | "question" | "discussion" | "other",
    "description": "Brief description of what was discussed/changed",
    "title": "Short title for this conversation",
    "summary": "Detailed summary of the conversation and changes made",
    "before_code": "Code before the change (if any)",
    "after_code": "Code after the change (if any)"
}}

Focus on:
- What type of change was made (bug fix, new feature, modification, question, discussion, etc.)
- Extract the actual before and after code from the conversation
- Provide meaningful descriptions and summaries
"""
        
        # Initialize Gemini model
        model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-1.5-flash"))
        
        # Create the full prompt
        full_prompt = f"""You are a technical assistant that analyzes programming conversations and extracts code changes. Always respond with valid JSON.

{prompt}"""
        
        # Generate response using Gemini
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=float(os.getenv("GEMINI_TEMPERATURE", "0.3")),
                max_output_tokens=int(os.getenv("GEMINI_MAX_TOKENS", "1500"))
            )
        )
        
        # Parse AI response
        ai_response = response.text.strip()
        
        # Try to extract JSON from response
        json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            return {
                "tag": "other",
                "description": "AI analysis failed",
                "title": "Chat Conversation",
                "summary": "AI analysis not available",
                "before_code": None,
                "after_code": None
            }
            
    except Exception as e:
        print(f"Error in OpenAI analysis: {e}")
        return {
            "tag": "other",
            "description": "AI analysis failed",
            "title": "Chat Conversation",
            "summary": "AI analysis not available",
            "before_code": None,
            "after_code": None
        }

@mcp.tool()
async def save_chat_history(messages: List[Dict[str, Any]], conversation_id: str = None, 
                           project_name: str = "MCP_Chat_Logger", use_ai_analysis: bool = True) -> str:
    """
    Save chat history with AI analysis of the entire conversation
    
    Args:
        messages: List of chat messages, each containing role and content
        conversation_id: Optional conversation ID for file naming
        project_name: Project name (default: MCP_Chat_Logger)
        use_ai_analysis: Whether to use AI to analyze the entire conversation (default: True)
    """
    ensure_logs_directory()
    
    # Generate conversation ID if not provided
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
    
    # Use AI to analyze the entire conversation
    if use_ai_analysis:
        print("🤖 Analyzing entire conversation with Gemini...")
        ai_analysis = analyze_conversation_with_gemini(messages)
        
        title = ai_analysis.get("title", "Chat Conversation")
        summary = ai_analysis.get("summary", "No summary available")
        tag = ai_analysis.get("tag", "other")
        description = ai_analysis.get("description", "No description available")
        before_code = ai_analysis.get("before_code") or None
        after_code = ai_analysis.get("after_code") or None
        
        print(f"✅ AI Analysis: {tag} - {description[:50]}...")
    else:
        title = "Chat Conversation"
        summary = "No summary available"
        tag = "other"
        description = "No description available"
        before_code = None
        after_code = None
    
    # Extract participants
    participants = list(set(msg.get("role", "unknown") for msg in messages))
    
    # Convert messages to ChatMessage objects
    chat_messages = []
    for msg in messages:
        chat_messages.append(ChatMessage(
            role=msg.get("role", "unknown"),
            content=msg.get("content", ""),
            timestamp=msg.get("timestamp", datetime.now().isoformat())
        ))
    
    # Create conversation summary
    conversation = ConversationSummary(
        conversation_id=conversation_id,
        project_name=project_name,
        tag=tag,
        description=description,
        before_code=before_code,
        after_code=after_code,
        title=title,
        summary=summary,
        message_count=len(messages),
        participants=participants,
        messages=chat_messages
    )
    
    # Save to JSON file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"chat_logs/conversation_{conversation_id}_{timestamp}.json"
    
    # Convert to dict and save as JSON
    conversation_dict = conversation.model_dump()
    conversation_dict['messages'] = [msg.model_dump() for msg in conversation.messages]
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(conversation_dict, f, indent=2, ensure_ascii=False)
    
    return f"✅ Conversation saved to JSON file: {filename}"

@mcp.tool()
async def save_chat_history_markdown(messages: List[Dict[str, Any]], conversation_id: str = None) -> str:
    """
    Save chat history as a Markdown file (original functionality)
    
    Args:
        messages: List of chat messages, each containing role and content
        conversation_id: Optional conversation ID for file naming
    """
    ensure_logs_directory()
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"chat_logs/chat_{conversation_id}_{timestamp}.md" if conversation_id else f"chat_logs/chat_{timestamp}.md"
    
    # Format all messages
    formatted_content = "# Chat History\n\n"
    formatted_content += f"Conversation ID: {conversation_id}\n" if conversation_id else ""
    formatted_content += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    for message in messages:
        formatted_content += format_message(message)
    
    # Save file
    with open(filename, "w", encoding="utf-8") as f:
        f.write(formatted_content)
    
    return f"Chat history has been saved to file: {filename}"

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')

