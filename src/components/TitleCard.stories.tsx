import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TitleCard } from "./TitleCard";

export default {
  title: "Component/TitleCard",
  component: TitleCard,
} as ComponentMeta<typeof TitleCard>;

const Tempate: ComponentStory<typeof TitleCard> = (args) => (
  <TitleCard {...args} />
);

export const TitleCardDefault = Tempate.bind({});
TitleCardDefault.args = {
  title: "タイトル",
  onClick: () => {
    console.log(1);
  },
};

export const TitleCardOnPressed = Tempate.bind({});
TitleCardOnPressed.args = {
  title: "タイトル",
  onClick: () => {
    console.log(2);
  },
  onPressed: true,
};
