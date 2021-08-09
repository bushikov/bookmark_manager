import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Accordion } from "./Accordion";

export default {
  title: "Component/Accordion",
  component: Accordion,
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args} />
);

export const AccordionDefault = Template.bind({});
AccordionDefault.args = {
  title: "タイトル",
  labels: ["ラベル１", "ラベル２"],
  isFocus: true,
  onSelect: (label) => console.log(label),
};
