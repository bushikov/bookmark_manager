import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TagAliasAccordion } from "./TagAliasAccordion";

export default {
  title: "Component/Accordion",
  component: TagAliasAccordion,
} as ComponentMeta<typeof TagAliasAccordion>;

const Template: ComponentStory<typeof TagAliasAccordion> = (args) => (
  <TagAliasAccordion {...args} />
);

export const TagAliasAccordionDefault = Template.bind({});
TagAliasAccordionDefault.args = {
  title: "タイトル",
  labels: ["ラベル１", "ラベル２"],
  isFocus: true,
  onSelect: (label) => console.log(label),
  onAdd: () => console.log("ADD"),
  onEdit: () => console.log("EDIT"),
  onDelete: (label) => console.log(label),
};
