# 项目摘要仪表板

这是一个简单的Python Flask后端 + HTML前端的项目摘要仪表板，用于展示从聊天日志中提取的项目更新信息。

## 功能特性

- 📊 项目摘要展示
- 🔍 搜索和过滤功能
- 🤖 AI生成的代码变更分析
- 📱 响应式设计
- 🎨 现代化的用户界面

## 安装和运行

### 1. 安装Python依赖

```bash
pip install -r requirements.txt
```

### 2. 运行应用

```bash
python app.py
```

### 3. 访问应用

打开浏览器访问: http://localhost:5000

## 项目结构

```
demo/
├── app.py              # Flask后端应用
├── requirements.txt    # Python依赖
├── templates/
│   └── index.html     # 前端HTML页面
└── README.md          # 说明文档
```

## 数据源

应用会读取 `../MCP_Chat_Logger/chat_logs/` 目录下的JSON文件，这些文件是由MCP Chat Logger生成的对话摘要。

## API接口

- `GET /` - 主页
- `GET /api/projects` - 获取项目数据

## 技术栈

- **后端**: Python Flask
- **前端**: HTML + CSS (Tailwind CSS) + JavaScript
- **图标**: Lucide Icons
