# ResumeFit - AI-Powered Resume Analysis & Job Matching Platform

ResumeFit is an intelligent career platform designed to bridge the gap between job seekers and recruiters using AI-driven resume parsing, automated skill gap analysis, and smart job recommendation algorithms.

---

## 🚀 Key Features

### 🎓 Student / Job Seeker Portal
- **Interactive Resume Upload**: Upload PDF/DOCX resumes with real-time parsing.
- **Skill Extraction & Verification**: Automatic detection of core competencies and missing skills.
- **AI Match Score**: Real-time compatibility rating against live job opportunities.
- **Personalized Recommendations**: Tailored job suggestions with actionable skill improvement tips.

### 💼 Recruiter Portal
- **Job Creation & Management**: Seamlessly post and configure job openings with skill requirements.
- **Candidate Matching**: View applicant ranks powered by AI matching scores.
- **Candidate Profiles**: Quick review of candidate strengths and skill breakdowns.

### 🛡️ Admin Dashboard
- **System Overview**: High-level metrics for user registrations, active jobs, and placement rates.
- **User & Job Management**: Comprehensive controls for platform governance.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts
- **State & Routing**: React Router DOM, Context API
- **Styling**: Tailwind CSS with custom theme & responsive design

---

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bitu-kumar045/AI-resume.git
   cd AI-resume
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Or from the root directory:
   ```bash
   npm run dev
   ```
   Or double-click `start-resumefit.bat` on Windows.

5. **Open in Browser:**
   Visit `http://localhost:5173` to explore the application.

---

## 📁 Project Structure

```text
AI-resume/
├── backend/                  # Backend services and API
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components & modals
│   │   ├── context/          # Authentication & application context
│   │   ├── pages/            # Student, Recruiter, and Admin dashboards
│   │   └── services/         # API integration & mock services
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json              # Workspace root scripts
├── start-resumefit.bat       # Quick launcher for Windows
└── README.md
```

---

## 📄 License
MIT License. Feel free to use and modify for personal or commercial projects.
