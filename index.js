const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let DB = {};

function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

function calcProgress(intervals, duration) {
  const total = intervals.reduce((acc, [s, e]) => acc + (e - s), 0);
  return Math.min(100, ((total / duration) * 100).toFixed(2));
}

app.get('/progress', (req, res) => {
  const { userId, videoId } = req.query;
  const key = `${userId}-${videoId}`;
  res.json(DB[key] || { watchedIntervals: [], lastWatchedTime: 0, progress: 0 });
});

app.post('/progress', (req, res) => {
  const { userId, videoId, watchedIntervals, lastWatchedTime, videoDuration } = req.body;
  const key = `${userId}-${videoId}`;
  const merged = mergeIntervals(watchedIntervals);
  const progress = calcProgress(merged, videoDuration);
  DB[key] = { watchedIntervals: merged, lastWatchedTime, progress };
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
