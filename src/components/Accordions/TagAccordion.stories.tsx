import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TagAccordion } from "./TagAccordion";

export default {
  title: "Component/Accordion",
  component: TagAccordion,
} as ComponentMeta<typeof TagAccordion>;

const Template: ComponentStory<typeof TagAccordion> = (args) => (
  <TagAccordion {...args} />
);

export const TagAccordionDefault = Template.bind({});
TagAccordionDefault.args = {
  title: "タイトル",
  labels: ["ラベル１", "ラベル２"],
  isFocus: true,
  onSelect: (label) => console.log(label),
};
