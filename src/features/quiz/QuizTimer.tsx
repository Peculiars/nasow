"use client"

import { useState, useEffect } from "react"

interface QuizTimerProps {
  durationMinutes: number
  onTimeUp: () => void
}

export function QuizTimer({ durationMinutes, onTimeUp }: QuizTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp()
      return
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft, onTimeUp])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  const isWarning = secondsLeft < 300
  const isCritical = secondsLeft < 60

  return (
    <div
      className={`text-center p-3 rounded-lg border-2 ${
        isCritical
          ? "border-red-500 bg-red-50"
          : isWarning
            ? "border-yellow-500 bg-yellow-50"
            : "border-blue-200 bg-blue-50"
      }`}
    >
      <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
      <p
        className={`text-2xl font-bold font-mono ${
          isCritical ? "text-red-600" : isWarning ? "text-yellow-600" : "text-blue-600"
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
    </div>
  )
}
