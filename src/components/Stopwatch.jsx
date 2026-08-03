import React, { useEffect, useRef, useState } from "react";
import styles from "./app.module.css";

function formatStopwatch(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSeconds = Math.floor(totalCs / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const pad = (n, len = 2) => String(n).padStart(len, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(cs)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}.${pad(cs)}`;
}

function Stopwatch({ soundButton }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startedAt = useRef(null);
  const baseElapsed = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    if (!running) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return undefined;
    }

    const tick = () => {
      setElapsed(baseElapsed.current + (Date.now() - startedAt.current));
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [running]);

  const start = () => {
    startedAt.current = Date.now();
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    baseElapsed.current = elapsed;
  };

  const reset = () => {
    setRunning(false);
    startedAt.current = null;
    baseElapsed.current = 0;
    setElapsed(0);
  };

  return (
    <>
      <div className={styles.display}>
        <h2 className={styles.time}>{formatStopwatch(elapsed)}</h2>
      </div>
      <div className={styles.controls}>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={`${styles.startBtn} ${running ? styles.startBtnRunning : ""}`}
            onClick={running ? stop : start}
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

export default Stopwatch;
