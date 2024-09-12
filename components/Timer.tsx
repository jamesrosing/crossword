'use client'

import React, { useState, useEffect } from 'react'

interface TimerProps {
  className?: string
}

export function Timer({ className }: TimerProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return [hours, minutes, remainingSeconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':')
  }

  return (
    <div className={`font-mono text-lg ${className}`}>
      {formatTime(time)}
    </div>
  )
}