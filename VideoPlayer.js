import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const VideoPlayer = ({ userId, videoId }) => {
  const videoRef = useRef();
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentStart, setCurrentStart] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3000/progress?userId=${userId}&videoId=${videoId}`)
      .then(({ data }) => {
        setWatchedIntervals(data.watchedIntervals || []);
        videoRef.current.currentTime = data.lastWatchedTime || 0;
        setProgress(data.progress || 0);
      });
  }, [userId, videoId]);

  const handlePlay = () => {
    setCurrentStart(videoRef.current.currentTime);
  };

  const handlePause = async () => {
    const end = videoRef.current.currentTime;
    if (currentStart != null && end > currentStart + 1) {
      const newInterval = [currentStart, end];
      const updated = mergeIntervals([...watchedIntervals, newInterval]);
      setWatchedIntervals(updated);
      setProgress(calcProgress(updated, videoRef.current.duration));
      setCurrentStart(null);

      await axios.post('http://localhost:3000/progress', {
        userId,
        videoId,
        watchedIntervals: updated,
        lastWatchedTime: end,
        videoDuration: videoRef.current.duration,
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <video
        ref={videoRef}
        width="600"
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        onSeeked={handlePlay}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
      <h3>Progress: {progress}%</h3>
    </div>
  );
};

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

export default VideoPlayer;
