"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, X, Play, Pause, RotateCcw } from "lucide-react";

interface TimerPopupProps {
  instruction: string;
}

function extractMinutes(text: string): number {
  // Match patterns like "30 minutes", "5-10 minutes", "3-4 mins", etc.
  const match = text.match(/(\d+)(?:\s*-\s*\d+)?\s*(?:minutes?|mins?)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 5; // Default to 5 minutes if no time found
}

export default function TimerPopup({ instruction }: TimerPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minutes, setMinutes] = useState(() => extractMinutes(instruction));
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalTime = minutes * 60 + seconds;

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopAudio();
    setTimeLeft(totalTime);
    setIsRunning(false);
    setIsFinished(false);
  }, [totalTime, stopAudio]);

  const handleClose = useCallback(() => {
    stopAudio();
    setIsOpen(false);
  }, [stopAudio]);

  useEffect(() => {
    setTimeLeft(totalTime);
  }, [totalTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            // Play notification sound
            if (typeof window !== "undefined") {
              try {
                const audio = new Audio("/sounds/timer_done.wav");
                audio.volume = 0.5;
                audio.loop = true;
                audioRef.current = audio;
                audio.play().catch(() => {});
              } catch {}
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const handleOpen = () => {
    setMinutes(extractMinutes(instruction));
    setSeconds(0);
    setTimeLeft(extractMinutes(instruction) * 60);
    setIsRunning(false);
    setIsFinished(false);
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
      >
        <Clock size={14} />
        Set Timer
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Clock size={20} />
                  Kitchen Timer
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Timer Display */}
            <div className="p-6">
              {/* Progress Ring */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={isFinished ? "#22c55e" : "#ec4899"}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * progress) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-5xl font-bold ${
                      isFinished ? "text-green-500" : "text-gray-800"
                    } ${isFinished ? "animate-pulse" : ""}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                  {isFinished && (
                    <span className="text-green-500 font-medium mt-2">
                      Time's up!
                    </span>
                  )}
                </div>
              </div>

              {/* Time Adjustment (when not running) */}
              {!isRunning && !isFinished && (
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center">
                    <label className="text-xs text-gray-500 block mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={minutes}
                      onChange={(e) =>
                        setMinutes(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-16 text-center text-lg font-bold border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <span className="text-2xl font-bold text-gray-400 mt-4">
                    :
                  </span>
                  <div className="text-center">
                    <label className="text-xs text-gray-500 block mb-1">
                      Seconds
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) =>
                        setSeconds(
                          Math.min(
                            59,
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        )
                      }
                      className="w-16 text-center text-lg font-bold border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isFinished ? (
                  <>
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className={`p-4 rounded-full text-white transition-all shadow-lg ${
                        isRunning
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isRunning ? <Pause size={28} /> : <Play size={28} />}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
                    >
                      <RotateCcw size={28} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={resetTimer}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-medium transition-all flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Start Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
