import React, { useState } from "react";

import { useChromeWindows } from "hooks";
import { TitleCard } from "components/TitleCard";

type WindowListProps = {
  onWindowSelect: (id: number) => void;
};

export const WindowList: React.FC<WindowListProps> = ({ onWindowSelect }) => {
  const { currentWindow, otherWindows } = useChromeWindows();
  const [pressedWindowIndex, setPressedWindowIndex] = useState<number | null>(
    null
  );

  return (
    <>
      {currentWindow && (
        <TitleCard
          title="Current Window"
          id={currentWindow.id}
          onClick={() => {
            setPressedWindowIndex(0);
            onWindowSelect(currentWindow.id);
          }}
          key={currentWindow.id}
          onPressed={pressedWindowIndex === 0}
        />
      )}
      {otherWindows.map((otherWindow, index) => (
        <div className="pt-2">
          <TitleCard
            title={`Window${index + 1}`}
            id={otherWindow.id}
            onClick={() => {
              setPressedWindowIndex(index + 1);
              onWindowSelect(otherWindow.id);
            }}
            key={otherWindow.id}
            onPressed={pressedWindowIndex === index + 1}
          />
        </div>
      ))}
    </>
  );
};
