# 🌙 Dream Builder — AI Bedtime Story Generator

A magical full-stack app that generates personalised AI bedtime stories for toddlers using **Groq AI (free)** with Llama 3.1.

---

## ✨ Features

- 🤖 AI story generation using Groq (llama-3.1-8b-instant) — **100% free**
- 🎨 Beautiful child-friendly UI with starry night theme
- 🔊 Read-aloud with Web Speech API (free, built into browser)
- 📚 Story archive with favourites
- 🔐 Parent authentication (JWT)
- ✨ Framer Motion animations throughout
- 📱 Fully responsive

---

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas free tier](https://www.mongodb.com/atlas))
- Groq API key (free at [console.groq.com](https://console.groq.com))

---

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb://localhost:27017/dreambuilder
JWT_SECRET=any_random_secret_string
PORT=5000
```

Start the server:
```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd client
npm install
npm start
```

The app will open at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
dream-builder/
├── server/
│   ├── server.js              # Express app entry
│   ├── routes/
│   │   ├── auth.js            # Login & register
│   │   └── story.js           # Generate, save, list, delete
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Story.js           # Story schema
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protection
│   └── utils/
│       └── groq.js            # Groq AI integration
│
└── client/
    └── src/
        ├── pages/
        │   ├── Landing.jsx    # Hero page
        │   ├── Auth.jsx       # Login/Register
        │   ├── StoryForm.jsx  # 3-step story creation
        │   ├── StoryViewer.jsx # Story + read-aloud
        │   └── Archive.jsx    # Saved stories
        ├── components/
        │   └── Navbar.jsx
        ├── context/
        │   └── AuthContext.jsx
        └── api/
            └── storyApi.js
```

---

## 💰 Cost — 100% Free Stack

| Service | Plan | Cost |
|---------|------|------|
| Groq AI (llama-3.1-8b-instant) | Free tier | $0 |
| MongoDB Atlas | Free M0 cluster | $0 |
| Web Speech API | Browser built-in | $0 |
| React + Node.js | Open source | $0 |

---

## 🎨 Design

- **Font**: Fredoka One (display) + Nunito (body)
- **Theme**: Deep night sky with purple/pink gradients
- **Style**: Glassmorphism cards, starry background, floating animations
- **Animations**: Framer Motion throughout

---

## 🔧 Tech Stack

- **Frontend**: React 18, Framer Motion, React Router v6
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **AI**: Groq SDK (llama-3.1-8b-instant)
- **Auth**: JWT + bcryptjs
- **Speech**: Web Speech API (browser-native)

---

Made with 💜 for little dreamers everywhere 🌙
