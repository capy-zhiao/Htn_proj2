# CodeMindHack - AI-Powered Conversation Logger & Dashboard

A comprehensive system for logging, analyzing, and visualizing AI conversations with intelligent code change tracking and project management capabilities.

## 🚀 Features

### Core Functionality
- **AI-Powered Conversation Analysis**: Uses OpenAI GPT-4 to analyze conversations and extract meaningful insights
- **Code Change Tracking**: Automatically detects and categorizes code modifications, additions, and deletions
- **Smart Tag Classification**: Intelligent tagging system that categorizes conversations based on content and code changes
- **Project Management Dashboard**: Beautiful web interface for browsing and managing conversation summaries
- **Side-by-Side Code Comparison**: Visual before/after code comparison with clean, modern UI

### Advanced Features
- **MCP Server Integration**: Custom MCP (Model Context Protocol) server for seamless Claude Desktop integration
- **Real-time Analysis**: Automatic conversation processing with AI-powered insights
- **Flexible Data Storage**: JSON-based storage with easy export capabilities
- **Responsive Design**: Modern, mobile-friendly web interface
- **Intelligent Categorization**: Automatic project type detection and impact assessment

## 🏗️ Architecture

```
Claude Desktop
    ↓ User completes Q&A session
MCP Server (custom-built)
    ↓ Receives conversation data and uses AI to structure the data
Local JSON Storage
    ↓ Stores summarized data with code analysis
Flask Web Dashboard
    ↓ Retrieves and displays data
User browses project summaries with intelligent insights
```

## 🛠️ Technology Stack

### Backend
- **Python Flask**: Web framework for the dashboard
- **OpenAI GPT-4**: AI analysis and conversation processing
- **MCP Server**: Custom server for Claude Desktop integration
- **Pydantic**: Data validation and serialization

### Frontend
- **HTML/CSS/JavaScript**: Modern web interface
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful icon system
- **Responsive Design**: Mobile-first approach

### Data Processing
- **JSON Storage**: Lightweight, portable data format
- **Regex Pattern Matching**: Code analysis and extraction
- **AI-Powered Tagging**: Intelligent content categorization

## 📦 Installation

### Prerequisites
- Python 3.8+
- OpenAI API key
- Claude Desktop (for MCP integration)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Htn_proj
   ```

2. **Install dependencies**
   ```bash
   cd demo
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cd ../MCP_Chat_Logger
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   echo "OPENAI_MODEL=gpt-4" >> .env
   echo "OPENAI_TEMPERATURE=0.1" >> .env
   echo "OPENAI_MAX_TOKENS=2000" >> .env
   ```

4. **Start the MCP server**
   ```bash
   python simple_chat_logger.py
   ```

5. **Start the web dashboard**
   ```bash
   cd ../demo
   python app.py
   ```

6. **Access the dashboard**
   Open your browser and navigate to `http://localhost:5002`

## 🎯 Usage

### Logging Conversations

1. **Via MCP Server**: Use the `save_chat_history` function in Claude Desktop
2. **Direct API**: Send POST requests to the MCP server with conversation data
3. **Automatic Analysis**: The system will automatically analyze and categorize your conversations

### Dashboard Features

- **Project Overview**: View all logged conversations with smart categorization
- **Code Analysis**: See detailed before/after code comparisons
- **Smart Tags**: Browse conversations by automatically generated tags
- **Search & Filter**: Find specific conversations quickly
- **Export Options**: Export data in various formats

### Code Change Analysis

The system automatically detects and categorizes:
- **Function modifications**: Changes to existing functions
- **New code additions**: New functions, classes, or modules
- **Code removals**: Deleted or refactored code
- **Technology patterns**: API changes, database modifications, UI updates
- **File references**: Automatic detection of modified files

## 🏷️ Tag Classification System

### Automatic Tags
- **Modification Types**: `modified`, `added`, `removed`, `deleted`
- **Code Types**: `function`, `class`, `import`
- **Technology Areas**: `api`, `database`, `ui`
- **Specific Identifiers**: Function names (e.g., `` `analyze_conversation_with_openai` ``)
- **File References**: Detected file names (e.g., `` `app.py` ``)

### Smart Categorization
- **Feature Development**: New features and enhancements
- **Bug Fixes**: Error corrections and stability improvements
- **Code Refactoring**: Code structure improvements
- **API Changes**: Backend and integration modifications
- **UI Updates**: Frontend and user interface changes

## 📊 Dashboard Interface

### Main Features
- **Project List**: Overview of all logged conversations
- **Detail View**: Comprehensive analysis of individual conversations
- **Code Comparison**: Side-by-side before/after code display
- **Tag Browser**: Filter and search by intelligent tags
- **Impact Assessment**: AI-generated impact descriptions

### Visual Design
- **Modern UI**: Clean, professional interface
- **Responsive Layout**: Works on desktop and mobile
- **Color-Coded Tags**: Easy visual categorization
- **Code Highlighting**: Syntax-highlighted code blocks
- **Intuitive Navigation**: Easy-to-use project browser

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.1
OPENAI_MAX_TOKENS=2000
```

### Customization
- Modify `demo/static/js/config.js` for UI settings
- Update `demo/app.py` for backend configuration
- Customize tag generation in `dataManager.js`

## 📁 Project Structure

```
Htn_proj/
├── demo/                          # Web dashboard
│   ├── app.py                    # Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── static/                   # Frontend assets
│   │   ├── css/                  # Stylesheets
│   │   └── js/                   # JavaScript modules
│   └── templates/                # HTML templates
├── MCP_Chat_Logger/              # MCP server
│   ├── simple_chat_logger.py     # Main MCP server
│   ├── chat_logger.py            # Alternative implementation
│   └── chat_logs/                # Generated conversation logs
└── README.md                     # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- Claude Desktop for MCP integration
- The open-source community for various libraries and tools

## 📞 Support

For questions, issues, or contributions, please open an issue on the repository or contact the development team.

---

**Built with ❤️ for HackTheNorth 2025**