import React from 'react';
import Timer from './Timer';
import { Button } from './ui/button';

interface GameControlsProps {
  isTimerRunning: boolean;
  onReset: () => void;
  onCheck: () => void;
  onReveal: () => void;
  onGetHint: () => void;
  isHintLoading: boolean;
  isAIHintAvailable: boolean;
}

export default function GameControls({ 
  isTimerRunning, 
  onReset, 
  onCheck, 
  onReveal, 
  onGetHint,
  isHintLoading,
  isAIHintAvailable
}: GameControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
      <Timer isRunning={isTimerRunning} />
      <div className="flex space-x-2 mt-2 sm:mt-0">
        <Button onClick={onReset}>Reset</Button>
        <Button onClick={onCheck}>Check</Button>
        <Button onClick={onReveal}>Reveal</Button>
        <Button 
          onClick={onGetHint} 
          disabled={isHintLoading || !isAIHintAvailable}
        >
          {isHintLoading ? 'Loading Hint...' : isAIHintAvailable ? 'Get AI Hint' : 'AI Hint Unavailable'}
        </Button>
      </div>
    </div>
  );
}