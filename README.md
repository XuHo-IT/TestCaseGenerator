# TestCaseGenerator_UI

A modern, AI-powered Use Case Report Generator built with Next.js, React, and TypeScript. This application provides an intuitive interface for generating comprehensive use case reports with AI assistance and exporting them to professional Excel documents.

## 🚀 Features

- **AI-Powered Generation**: Generate comprehensive use case reports using advanced AI technology
- **Professional Excel Export**: Automatically download formatted Excel reports
- **Modern UI/UX**: Clean, responsive interface built with Tailwind CSS
- **Error Handling**: Robust error handling with retry mechanisms and fallback options
- **Real-time Feedback**: User-friendly loading states and progress indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Backend Integration**: RESTful API integration

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (AI FOR SE project)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/XuHo-IT/TestCasseGenerator_UI.git
   cd TestCasseGenerator_UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Enter Use Case Name**: Provide a descriptive name for your use case
2. **Add Context (Optional)**: Include additional context or requirements
3. **Generate Report**: Click the generate button to create your use case report
4. **Download Excel**: The report will automatically download as an Excel file

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

### Backend Integration

This frontend integrates with the AI FOR SE backend API endpoints:

- `POST /Testcase/generate-use-case-report` - Generate comprehensive use case reports
- `POST /Testcase/generate-use-case-table` - Fallback endpoint for use case tables

## 🐛 Troubleshooting

### Common Issues

1. **AI Service Overload**: The system automatically retries with exponential backoff
2. **Backend Model Mismatch**: Clear error messages guide users when backend models need updating
3. **Network Timeouts**: Extended timeouts handle long-running AI operations

### Error Messages

- **🤖 AI service overloaded**: Service is busy, automatic retry in progress
- **⚠️ Backend model mismatch**: AI generated valid data but backend model needs updating
- **🔧 Backend model issue**: Specific field type mismatches (e.g., array vs string)

## 📁 Project Structure

```
├── pages/
│   ├── components/
│   │   └── TestcaseForm.tsx    # Main form component
│   ├── _app.tsx               # App wrapper
│   └── index.tsx              # Home page
├── styles/
│   └── globals.css            # Global styles
├── public/                    # Static assets
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

## 🤝 Contributing

This project is part of the **AI FOR SE** project ecosystem. For contributions and issues, please refer to the main AI FOR SE project repository.

## 📝 License

This project is a side feature of the **AI FOR SE** project. Please refer to the main project for licensing information.

## 🔗 Related Projects

- **AI FOR SE**: Main project repository
- **Backend API**: AI-powered test case generation backend
- **AI Services**: Gemini AI integration for intelligent report generation

## 📞 Support

For support and questions related to this UI component, please contact the AI FOR SE development team.

---

**Note**: This is a side feature of the **AI FOR SE** project, providing a modern web interface for AI-powered use case report generation.