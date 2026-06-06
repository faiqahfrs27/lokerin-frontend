import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  startedAt: string;
  durationMin: number;
  onTimeUp: () => void;
}

function AssessmentTimer({ startedAt, durationMin, onTimeUp }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    computeSecondsLeft(startedAt, durationMin),
  );

  useEffect(() => {
    const tick = () => {
      const remaining = computeSecondsLeft(startedAt, durationMin);
      setSecondsLeft(remaining);
      if (remaining <= 0) onTimeUp();
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, durationMin, onTimeUp]);

  const isWarning = secondsLeft <= 60;
  const isDanger = secondsLeft <= 10;

  return (
    <div className={getTimerClass(isWarning, isDanger)}>
      <Clock size={16} strokeWidth={2} />
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
        {formatTime(secondsLeft)}
      </span>
    </div>
  );
}

function computeSecondsLeft(startedAt: string, durationMin: number): number {
  const startMs = new Date(startedAt).getTime();
  const endMs = startMs + durationMin * 60 * 1000;
  const remaining = Math.floor((endMs - Date.now()) / 1000);
  return Math.max(0, remaining);
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
}

function getTimerClass(isWarning: boolean, isDanger: boolean): string {
  const base = "assessment-timer";
  if (isDanger) return `${base} ${base}--danger`;
  if (isWarning) return `${base} ${base}--warning`;
  return base;
}

export default AssessmentTimer;