import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CrosswordGenerator } from '@/lib/crosswordGenerator';
import { Puzzle } from '@/types/puzzle';
import { generateClue } from '@/lib/clueGenerator';

export function PuzzleEditor() {
  const [size, setSize] = useState(15);
  const [wordList, setWordList] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const handleGeneratePuzzle = () => {
    const generator = new CrosswordGenerator(size);
    const newPuzzle = generator.generatePuzzle(wordList);
    setPuzzle(newPuzzle);
  };

  const handleAddWord = (word: string) => {
    setWordList([...wordList, word]);
  };

  const handleGenerateClues = async () => {
    if (!puzzle) return;

    const updatedWords = await Promise.all(
      puzzle.words.map(async (word) => ({
        ...word,
        clue: await generateClue(word.word),
      }))
    );

    setPuzzle({ ...puzzle, words: updatedWords });
  };

  return (
    <div>
      <h2>Puzzle Editor</h2>
      <div>
        <label>Grid Size:</label>
        <Input
          type="number"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Add Word:</label>
        <Input
          type="text"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddWord(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
      <Button onClick={handleGeneratePuzzle}>Generate Puzzle</Button>
      <Button onClick={handleGenerateClues}>Generate Clues</Button>
      {puzzle && (
        <div>
          {/* Display the generated puzzle */}
          {/* You can reuse components from the main puzzle display here */}
        </div>
      )}
    </div>
  );
}