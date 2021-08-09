import React from "react";

type TitleCardProps = {
  id: number;
  title: string;
  onClick: () => void;
  onPressed?: boolean;
};

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  onClick,
  onPressed,
}) => (
  <button
    className={`w-full rounded p-4 ${
      onPressed === true ? "shadow-inner bg-gray-200" : "shadow-md bg-gray-100"
    }`}
    onClick={onClick}
  >
    <p className="text-left">{title}</p>
  </button>
);
