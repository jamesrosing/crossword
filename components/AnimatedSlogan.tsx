'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './AnimatedSlogan.css'

export default function AnimatedSlogan() {
  const [animationStep, setAnimationStep] = useState(0)
  const [puzzle, setPuzzle] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStep < 13) {
        setAnimationStep(animationStep + 1)
      }
    }, animationStep === 0 ? 500 : 250)

    return () => clearTimeout(timer)
  }, [animationStep])

  const handleClick = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-puzzle', {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to generate puzzle');
      const generatedPuzzle = await response.json();
      setPuzzle(generatedPuzzle);
    } catch (error) {
      console.error('Error generating puzzle:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const gridVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1, transition: { duration: 0.3, ease: "easeInOut" } }
  }

  const letterVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.1,
        ease: "easeOut"
      } 
    }
  }

  const cellFillVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  }

  const containerVariants = {
    hidden: { y: 0 },
    visible: { y: -50, transition: { duration: 0.3, ease: "easeInOut" } }
  }

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.3 } }
  }

  const gridLines = [
    "M0,0 H200 V150 H0 Z", // Outline
    "M0,50 H200", // First horizontal inner line
    "M0,100 H200", // Second horizontal inner line
    "M50,0 V150", // First vertical inner line
    "M100,0 V150", // Second vertical inner line
    "M150,0 V150", // Third vertical inner line
  ]

  const letters = [
    { char: 'G', x: 25, y: 75 },
    { char: 'R', x: 75, y: 75 },
    { char: 'I', x: 125, y: 75 },
    { char: 'D', x: 175, y: 75 },
    { char: 'W', x: 125, y: 25 },
    { char: 'T', x: 125, y: 125 },
  ]

  const blankCells = [
    { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 150, y: 0 },
    { x: 0, y: 100 }, { x: 50, y: 100 }, { x: 150, y: 100 },
  ]

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        className="relative"
        initial="hidden"
        animate={animationStep >= 12 ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <svg width="200" height="150" viewBox="0 0 200 150" className="stroke-primary fill-none">
          {blankCells.map((cell, index) => (
            <motion.rect
              key={`cell-${index}`}
              x={cell.x}
              y={cell.y}
              width="50"
              height="50"
              className="fill-primary/80"
              variants={cellFillVariants}
              initial="hidden"
              animate={animationStep >= 11 ? "visible" : "hidden"}
            />
          ))}
          {gridLines.map((line, index) => (
            <motion.path
              key={index}
              d={line}
              strokeWidth={index === 0 ? "4" : "2"}
              variants={gridVariants}
              initial="hidden"
              animate={animationStep >= index ? "visible" : "hidden"}
            />
          ))}
          {letters.map((letter, index) => (
            <motion.text
              key={letter.char}
              x={letter.x}
              y={letter.y}
              fontSize="40"
              fontWeight="bold"
              fontFamily="Geist Sans, sans-serif"
              className="fill-primary"
              textAnchor="middle"
              dominantBaseline="central"
              variants={letterVariants}
              initial="hidden"
              animate={animationStep >= index + 6 ? "visible" : "hidden"}
            >
              {letter.char}
            </motion.text>
          ))}
        </svg>
      </motion.div>
      <motion.div
        className="text-center mt-8"
        variants={descriptionVariants}
        initial="hidden"
        animate={animationStep >= 12 ? "visible" : "hidden"}
      >
        <p className="text-xl mb-4 text-primary">Unlock your mind, one word at a time</p>
        <p className="text-sm text-primary/80">Click anywhere to start</p>
      </motion.div>
      
      {isGenerating && (
        <div className="mt-4 text-primary">Generating puzzle...</div>
      )}
      
      {puzzle && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Generated Puzzle:</h3>
          <pre className="mt-2 bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(puzzle, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}