import React, { useState } from "react";

type AccordionProps = {
  title: string;
  labels?: string[];
  isFocus: boolean;
  onSelect: (args0: string) => void;
};

export const Accordion: React.FC<AccordionProps> = ({
  title,
  labels,
  isFocus,
  onSelect,
}) => {
  const [isFolded, setIsFolded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div
        className="border border-gray-200 p-3 cursor-pointer"
        onClick={() => setIsFolded(!isFolded)}
      >
        {title}
      </div>
      {!isFolded &&
        labels &&
        labels.map((label, index) => (
          <div
            key={label}
            className={`border border-gray-200 pl-8 py-2 pr-2 ${
              isFocus && index === selectedIndex ? "bg-gray-200" : "bg-white"
            }`}
          >
            <div className="flex flex-row justify-between">
              <p className="py-1">{label}</p>
              <button
                className={`rounded px-2 py-1 bg-gray-100 hover:bg-gray-300 focus:ring ${
                  isFocus && index == selectedIndex
                    ? "shadow-inner"
                    : "shadow-md"
                }`}
                onClick={() => {
                  setSelectedIndex(index);
                  onSelect(label);
                }}
              >
                SELECT
              </button>
            </div>
          </div>
        ))}
    </>
  );
};
