import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="space-y-2">
      <h3 className="font-bold uppercase">{type}</h3>
      <ScrollArea className="h-[calc(50vh-2rem)]">
        <ul className="space-y-1">
          {clues.map((clue) => (
            <li
              key={clue.number}
              className={`cursor-pointer p-1 rounded ${
                selectedClue === clue.number ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => onClueSelect(clue.number)}
            >
              <span className="font-semibold">{clue.number}.</span> {clue.text}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default ClueList;