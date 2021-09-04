import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TagForm } from "./TagForm";

export default {
  title: "Component/Form",
  component: TagForm,
} as ComponentMeta<typeof TagForm>;

const Template: ComponentStory<typeof TagForm> = (args) => (
  <TagForm {...args} />
);

export const TagFormDefault = Template.bind({});
TagFormDefault.args = {
  tag: {
    id: 1,
    name: "今のタグ",
    bookmarkIds: new Set([]),
  },
  onSubmit: (tag) => {
    console.log(tag);
  },
  onCancel: () => {
    console.log("CANCEL");
  },
};
