import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Tag } from "./Tag";

export default {
  title: "Component/Tag",
  component: Tag,
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const TagTagDefault = Template.bind({});
TagTagDefault.args = {
  title: "タグ１",
  onCrossClick: (title) => console.log(`${title} is clicked`),
};
