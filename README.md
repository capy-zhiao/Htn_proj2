# Htn_proj

work flow:Claude Desktop
    ↓ User completes Q&A session
MCP Server (custom-built)
    ↓ Receives conversation data and use ai to structure the data
DynamoDB (AWS cloud)
    ↓ Stores summarized data
React Frontend (web interface)
    ↓ Retrieves data from DynamoDB
User browses project summaries