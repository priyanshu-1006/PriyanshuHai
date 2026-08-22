# 🚀 Nexsus Assist

**AI-Powered Utility Platform** - Your all-in-one toolkit for PDF, image, text, media, and developer operations.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)

## ✨ Features

- 🤖 **AI-Powered Routing** - Natural language tool selection via Groq/Claude
- 🛠️ **55 Specialized Tools** - PDF, Image, Text, Media, Dev utilities
- 💬 **Conversational Interface** - Chat-based workflow with file uploads
- 🎨 **Modern UI** - Glass-morphism design with dark mode support
- 📱 **Mobile Optimized** - Touch-friendly navigation and responsive layout
- ⌨️ **Keyboard Shortcuts** - Power user workflows (Ctrl+K, Ctrl+H, etc.)
- 💾 **Tool History** - Track recent executions and favorites
- 📊 **Upload Progress** - Real-time file upload indicators
- 🔒 **Type Safe** - Full TypeScript coverage with strict typing
- 📦 **Export/Import** - Save and restore user preferences

## 🚀 Quick Start

### Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` - your app is running!

### Deploy to Production 🌐

**15-Minute Deployment** - See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

Or use automated scripts:

**Windows:**
```bash
deploy-backend.bat   # Deploy to Railway
deploy-frontend.bat  # Deploy to Vercel
```

**Linux/Mac:**
```bash
./deploy-backend.sh   # Deploy to Railway
./deploy-frontend.sh  # Deploy to Vercel
```

**Detailed Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nexsus-Assist
   ```

2. **Setup environment files**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Docker (Alternative)

```bash
docker compose up --build
```

## 📚 Documentation

For detailed documentation, see [NEXSUS-ASSIST.md](./docs/NEXSUS-ASSIST.md)

## 🏗️ Architecture

```
Nexsus-Assist/
├── frontend/          # Next.js 15 + TypeScript
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # Utilities and types
└── backend/          # FastAPI + Python
    ├── app/
    │   ├── api/      # API routes
    │   ├── tools/    # Tool implementations
    │   └── utils/    # Helper functions
    └── requirements.txt
```

## 🛠️ Available Tools (55 Total)

### 📄 PDF Tools (10)
- Merge, Split, Compress, Extract Text/Images
- Rotate, Watermark, Encrypt/Decrypt
- Images to PDF

### 🖼️ Image Tools (17)
- Convert, Resize, Crop, Rotate, Flip
- Compress, Blur, Sharpen, Grayscale, Sepia
- Invert, Edge Detect, Emboss, Remove Background
- Extract Text, SVG to PNG, Watermark

### 📝 Text Tools (8)
- Word Count, Case Convert, Find/Replace
- Remove Whitespace, Summarize, Translate
- Rewrite, Extract Keywords

### 🎬 Media Tools (3)
- Video to Audio/GIF
- Audio Convert

### 💻 Dev Tools (17)
- JSON Format/Minify, JSON ↔ YAML
- Base64/URL Encode/Decode
- Hash Generate, UUID Generate, QR Generate
- JWT Decode, Regex Tester, Cron Parse
- Color Convert, Lorem Ipsum, Markdown to HTML

## 🎯 Usage Examples

### Via Chat Interface

```
User: "Merge these two PDFs"
[Upload file1.pdf, file2.pdf]
→ AI routes to pdf_merge tool
```

### Via API

```bash
# Upload file
curl -X POST http://localhost:8000/api/v1/files/upload \
  -F "file=@document.pdf"

# Execute tool
curl -X POST http://localhost:8000/api/v1/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "pdf_split",
    "payload": {"stored_name": "abc123.pdf"}
  }'

# Download result
curl http://localhost:8000/api/v1/files/download/{stored_name} \
  --output result.pdf
```

## ⌨️ Keyboard Shortcuts

- `Ctrl+K` - Search tools
- `Ctrl+Shift+U` - Upload file
- `Ctrl+Enter` - Submit/Execute
- `Ctrl+H` - Show history
- `Ctrl+F` - Toggle favorites
- `Ctrl+1-6` - Jump to tool categories
- `?` - Show keyboard shortcuts help
- `Escape` - Close modals

## 🔧 Configuration

### Backend (.env)

```env
# AI Provider
GROQ_API_KEY=your_groq_api_key
ANTHROPIC_API_KEY=your_claude_api_key

# Server
APP_HOST=0.0.0.0
APP_PORT=8000
APP_REQUIRE_HTTPS=false

# Storage
APP_TEMP_DIR=/tmp/nexsus-temp
APP_MAX_UPLOAD_SIZE_MB=25

# Security
APP_API_KEY_AUTH_ENABLED=false
APP_RATE_LIMIT_PER_MINUTE=60
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🔒 Security Features

- ✅ Request rate limiting (60 req/min)
- ✅ File signature validation
- ✅ Optional API key authentication
- ✅ Upload size limits (25 MB default)
- ✅ Type-safe operations
- ✅ Error boundaries for graceful failures

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📖 API Documentation

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

### Core Endpoints

**File Management:**
- `POST /api/v1/files/upload` - Upload file (multipart/form-data)
- `GET /api/v1/files/download/{stored_name}` - Download file

**Tool Execution:**
- `GET /api/v1/tools` - List available tools
- `POST /api/v1/tools/execute` - Execute a tool

**AI Processing:**
- `POST /api/v1/ai/process` - Process natural language request
- `POST /api/v1/ai/intent` - Classify user intent
- `POST /api/v1/ai/route` - Route and execute tool

**Authentication (if enabled):**
- `GET /api/v1/auth/keys` - List API keys (admin)
- `POST /api/v1/auth/keys` - Create API key (admin)
- `POST /api/v1/auth/keys/revoke` - Revoke API key (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Groq](https://groq.com/) - AI inference
- [Anthropic Claude](https://www.anthropic.com/) - AI models
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

Made with ❤️ by the Nexsus Assist team
