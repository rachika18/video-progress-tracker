# video-progress-tracker

---

## 🧠 How It Works

### 🎬 Watch Tracking
- Each time the user **plays or pauses** the video, it records the start/end time.
- Already-watched seconds are **not counted again**.
- If a user watches [10s–30s] and [25s–40s], it merges them into [10s–40s].

### 📊 Progress Calculation
- Progress is based on **unique watched time**.
- Example: If a video is 100 seconds, and 60 unique seconds are watched, progress = `60%`.

### 💾 Persistent Progress
- On pause/stop, the frontend sends the watched intervals to the backend.
- When the user returns, the video resumes from the last saved timestamp.

---

## 🛠️ Getting Started

### 📍 Requirements
- Node.js (v16+)
- npm

### 📦 Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/video-progress-tracker.git
cd video-progress-tracker
