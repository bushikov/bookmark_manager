import React from "react";
import CrossMark from "svg/cross_mark.svg";

type TagProps = {
  title: string;
  onCrossClick: (arg0: string) => void;
};

export const Tag: React.FC<TagProps> = ({ title, onCrossClick }) => (
  <div className="flex flex-row items-center px-2 py-1 space-x-1 h-max w-max rounded bg-green-500">
    <div className="h-4 text-xs text-white">{title}</div>
    <div
      className="h-4 w-4 cursor-pointer"
      onClick={() => {
        onCrossClick(title);
      }}
    >
      <img src={CrossMark} />
    </div>
  </div>
);
