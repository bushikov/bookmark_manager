import React, { useState } from "react";

type TabHeaderProps = {
  defaultValue?: number;
  labels: string[];
  onChange: (index: number) => void;
};

export const TabHeader: React.FC<TabHeaderProps> = ({
  defaultValue = 0,
  labels,
  onChange,
}) => {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <ul className="flex border-b border-gray-200">
      {labels.map((label, index) => (
        <li
          key={label}
          className={`px-5 py-3 select-none ${
            index === selected
              ? "text-gray-900 border-b border-gray-900"
              : "text-blue-500 border-b border-gray-200"
          }`}
          style={{ marginBottom: -1 }}
        >
          <button
            onClick={() => {
              setSelected(index);
              onChange(index);
            }}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
};
