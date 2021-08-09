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
        className="border border-gray-200 p-2 cursor-pointer"
        onClick={() => setIsFolded(!isFolded)}
      >
        {title}
      </div>
      {!isFolded &&
        labels &&
        labels.map((label, index) => (
          <div
            key={label}
            onClick={() => {
              setSelectedIndex(index);
              onSelect(label);
            }}
            className={`border border-gray-200 py-2 pl-8 cursor-pointer ${
              isFocus && index === selectedIndex ? "bg-gray-200" : "bg-white"
            }`}
          >
            {label}
          </div>
        ))}
    </>
  );
};
