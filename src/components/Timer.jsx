import React, { useEffect, useRef, useState } from "react";
import styles from "./app.module.css";

const INITIAL_MS = 5 * 60 * 1000;

function formatTimer(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}m:${ss}s`;
}

function Timer({ soundOn, soundButton }) {
  const [remaining, setRemaining] = useState(INITIAL_MS);
  const [running, setRunning] = useState(false);
  const endAt = useRef(null);
  const rafId = useRef(null);
  const audioCtx = useRef(null);
  const soundOnRef = useRef(soundOn);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const playAlarm = () => {
    if (!soundOnRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx.current) audioCtx.current = new AudioContext();
      const ctx = audioCtx.current;
      const now = ctx.currentTime;
      [0, 0.25, 0.5].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.2, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.22);
      });
    } catch (_) {
      // Ignore audio errors in unsupported environments
    }
  };

  useEffect(() => {
    if (!running) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return undefined;
    }

    const tick = () => {
      const left = Math.max(0, endAt.current - Date.now());
      setRemaining(left);
      if (left <= 0) {
        setRunning(false);
        playAlarm();
        return;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [running]);

  const start = () => {
    endAt.current = Date.now() + remaining;
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    if (endAt.current) {
      setRemaining(Math.max(0, endAt.current - Date.now()));
    }
  };

  const reset = () => {
    setRunning(false);
    endAt.current = null;
    setRemaining(INITIAL_MS);
  };

  return (
    <>
      <div className={styles.display}>
        <h2 className={styles.time}>{formatTimer(remaining)}</h2>
      </div>
      <div className={styles.controls}>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={`${styles.startBtn} ${running ? styles.startBtnRunning : ""}`}
            onClick={running ? stop : start}
            disabled={!running && remaining <= 0}
          >
            {running ? "STOP" : "START"}
          </button>
          <button type="button" className={styles.resetBtn} onClick={reset}>
            RESET
          </button>
        </div>
        {soundButton}
      </div>
    </>
  );
}

export default Timer;
