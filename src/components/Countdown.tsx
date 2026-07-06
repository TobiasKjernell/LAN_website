import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="tabular-nums text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-sm uppercase tracking-widest text-white/60">{label}</span>
    </div>
  )
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const hasArrived = timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds <= 0

  if (hasArrived) {
    return (
      <p className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
        The LAN party has started!
      </p>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8">
      <Unit value={timeLeft.days} label="days" />
      <span className="text-4xl sm:text-6xl font-bold text-white/30 -mt-4">:</span>
      <Unit value={timeLeft.hours} label="hours" />
      <span className="text-4xl sm:text-6xl font-bold text-white/30 -mt-4">:</span>
      <Unit value={timeLeft.minutes} label="min" />
      <span className="text-4xl sm:text-6xl font-bold text-white/30 -mt-4">:</span>
      <Unit value={timeLeft.seconds} label="sec" />
    </div>
  )
}
