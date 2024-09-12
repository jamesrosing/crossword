'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DifficultySelector() {
  const [difficulty, setDifficulty] = useState('medium')

  return (
    <Select value={difficulty} onValueChange={setDifficulty}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="easy">Easy</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="hard">Hard</SelectItem>
        <SelectItem value="expert">Expert</SelectItem>
      </SelectContent>
    </Select>
  )
}