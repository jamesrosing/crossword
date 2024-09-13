import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Clue {
  number: number;
  text: string;
}

interface ClueListProps {
  type: 'across' | 'down';
  clues: Clue[];
  onClueSelect: (number: number) => void;
  selectedClue: number | null;
}

const ClueList: React.FC<ClueListProps> = ({ type, clues, onClueSelect, selectedClue }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold uppercase text-lg">{type}</h3>
      <ScrollArea className="h-[calc(50vh-4rem)] pr-4">
        <ul className="space-y-2">
          {clues.map((clue) => (
            <li key={clue.number}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left ${
                  selectedClue === clue.number ? 'bg-accent text-accent-foreground' : ''
                }`}
                onClick={() => onClueSelect(clue.number)}
              >
                <span className="font-semibold mr-2">{clue.number}.</span>
                <span className="line-clamp-2">{clue.text}</span>
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default ClueList;