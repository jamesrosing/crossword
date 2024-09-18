import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface PuzzleWord {
  word: string;
  row: number;
  col: number;
  vertical: boolean;
  clue: string;
  number: number;
}

interface ClueListProps {
  type: 'across' | 'down';
  clues: PuzzleWord[];
  onClueSelect: (word: PuzzleWord) => void;
  selectedClue: PuzzleWord | null;
}

const ClueList: React.FC<ClueListProps> = ({ type, clues, onClueSelect, selectedClue }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-bold uppercase text-lg">{type}</h3>
      <ScrollArea className="h-[calc(25vh-2rem)] pr-4">
        <ul className="space-y-1">
          {clues.map((clue) => (
            <li key={clue.number}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left text-sm py-1 ${
                  selectedClue === clue ? 'bg-blue-100' : ''
                }`}
                onClick={() => onClueSelect(clue)}
              >
                <span className="font-semibold mr-2">{clue.number}.</span>
                <span className="line-clamp-2">{clue.clue}</span>
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default ClueList;