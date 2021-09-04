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
  tagAliases: [
    {
      id: 1,
      name: "エイリアス１",
      type: "and",
      tags: new Set(["タグ１", "タグ２"]),
    },
    {
      id: 2,
      name: "エイリアス２",
      type: "or",
      tags: new Set(["タグ１", "タグ２"]),
    },
  ],
  isFocus: true,
  onSelect: (tagAlias) => console.log(tagAlias),
  onAdd: () => console.log("ADD"),
  onEdit: () => console.log("EDIT"),
  onDelete: () => console.log("DELETE"),
};
