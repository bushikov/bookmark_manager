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
  tags: [
    {
      id: 1,
      name: "タグ１",
      bookmarkIds: new Set([1, 2, 3]),
    },
    {
      id: 2,
      name: "タグ２",
      bookmarkIds: new Set([2, 3, 4]),
    },
  ],
  isFocus: true,
  onChangeTagSearchType: (type) => console.log(`TYPE ${type}`),
  onCheck: (tags) => console.log(`ON CHECK ${JSON.stringify(tags)}`),
  onSelect: (label) => console.log(label),
  onRename: (tag) => console.log(`ON RENAME ${JSON.stringify(tag)}`),
};
