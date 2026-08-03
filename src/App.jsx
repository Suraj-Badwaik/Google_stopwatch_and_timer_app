import React, { useState } from "react";
import styles from "./components/app.module.css";
import Timer from "./components/Timer";
import Stopwatch from "./components/Stopwatch";

function HourglassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2h12" />
      <path d="M6 22h12" />
      <path d="M8 2v3.5c0 1.5.8 2.9 2.1 3.7L12 11l1.9-1.8c1.3-.8 2.1-2.2 2.1-3.7V2" />
      <path d="M8 22v-3.5c0-1.5.8-2.9 2.1-3.7L12 13l1.9 1.8c1.3.8 2.1 2.2 2.1 3.7V22" />
    </svg>
  );
}

function StopwatchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 1.5" />
      <path d="M10 2h4" />
      <path d="M12 2v2" />
    </svg>
  );
}

function SpeakerIcon({ muted }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4V5z" />
        <path d="M23 9l-6 6" />
        <path d="M17 9l6 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 010 7" />
      <path d="M18.5 5.5a9 9 0 010 13" />
    </svg>
  );
}

function App() {
  const [mode, setMode] = useState("timer");
  const [soundOn, setSoundOn] = useState(true);

  const soundButton = (
    <button
      className={`${styles.soundBtn} ${!soundOn ? styles.soundBtnMuted : ""}`}
      onClick={() => setSoundOn((v) => !v)}
      aria-label={soundOn ? "Mute sound" : "Unmute sound"}
      type="button"
    >
      <SpeakerIcon muted={!soundOn} />
    </button>
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "timer" ? styles.tabActive : ""}`}
            onClick={() => setMode("timer")}
            aria-pressed={mode === "timer"}
          >
            <HourglassIcon />
            Timer
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "stopwatch" ? styles.tabActive : ""}`}
            onClick={() => setMode("stopwatch")}
            aria-pressed={mode === "stopwatch"}
          >
            <StopwatchIcon />
            Stopwatch
          </button>
        </div>

        {mode === "timer" ? (
          <Timer soundOn={soundOn} soundButton={soundButton} />
        ) : (
          <Stopwatch soundButton={soundButton} />
        )}
      </div>
    </div>
  );
}

export default App;
