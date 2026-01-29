# IELTS Speaking Coach AI 🎤

An AI-powered IELTS Speaking practice platform with real-time feedback, pronunciation analysis, and comprehensive progress tracking.

![IELTS Coach](https://img.shields.io/badge/IELTS-Speaking%20Coach-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite)

## ✨ Features

### 🎯 Practice Modes
- **Full Test** - Complete 11-14 minute IELTS speaking test
- **Part 1 Only** - Quick introduction practice (4-5 min)
- **Part 2 Only** - Individual long turn (3-4 min)
- **Part 3 Only** - Abstract discussion (4-5 min)

### 🎤 AI-Powered Feedback
- **Pronunciation Analysis** - Clarity, intonation, word stress scoring
- **Grammar Corrections** - Specific mistake identification
- **Fluency Feedback** - Pauses, fillers, speed analysis
- **Vocabulary Suggestions** - Better word choices
- **Band Score Estimation** - Real-time IELTS scoring (0-9)

### 📚 Topic Selection
- **21 Topics** across 7 categories
- **3 Difficulty Levels** - Beginner, Intermediate, Advanced
- Smart filtering by category and difficulty

### 📊 Progress Tracking
- **5 Key Metrics** - Band, Grammar, Fluency, Pronunciation, Vocabulary
- **Session History** - Complete conversation replays
- **Progress Charts** - Track improvement over time
- **Strengths & Weaknesses** - AI-identified areas
- **Export Reports** - Download session summaries

### 💬 Real-Time Features
- **Speech Transcription** - See what you said
- **Live Feedback** - Instant AI analysis
- **Audio Playback** - Review your recordings
- **Timer** - Part 2 preparation and speaking timers

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd copy-of-ielts-speaking-coach-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional)
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

Or use the [Vercel Dashboard](https://vercel.com):
- Import your GitHub repository
- Add `GEMINI_API_KEY` in Environment Variables
- Deploy!

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Or use the [Netlify Dashboard](https://netlify.com):
- Drag and drop the `dist` folder
- Or connect your GitHub repository

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

**Important:** Never commit your `.env.local` file to version control!

## 📦 Build

```bash
npm run build
```

The build output will be in the `dist` folder.

## 🎨 Tech Stack

- **Frontend:** React 19.2 + TypeScript
- **Build Tool:** Vite 6.2
- **AI:** Google Gemini API
- **Charts:** Recharts
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with gradients

## 📱 Browser Support

- Chrome/Edge (recommended for best speech recognition)
- Firefox
- Safari
- Opera

## 🎯 Roadmap

- [ ] PWA support (offline mode)
- [ ] Vocabulary flashcards
- [ ] Weekly goals and streaks
- [ ] Detailed pronunciation drills
- [ ] Session comparison
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Google Gemini API for AI-powered feedback
- IELTS for the test format
- React and Vite communities

---

**Made with ❤️ for IELTS learners worldwide**

🌟 **Star this repo if you find it helpful!**
