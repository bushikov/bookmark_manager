import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TagAliasForm } from "./TagAliasForm";

export default {
  title: "Component/Form",
  component: TagAliasForm,
} as ComponentMeta<typeof TagAliasForm>;

const Template: ComponentStory<typeof TagAliasForm> = (args) => (
  <TagAliasForm {...args} />
);

export const TagAliasFormDefault = Template.bind({});
TagAliasFormDefault.args = {
  tagAlias: {
    name: "",
    type: "and",
    tags: new Set([]),
  },
  onSubmit: (arg) => console.log(arg),
  onCancel: () => console.log("CANCEL"),
};

export const TagAliasFormInitialData = Template.bind({});
TagAliasFormInitialData.args = {
  tagAlias: {
    name: "エイリアス",
    type: "or",
    tags: new Set(["タグ１", "タグ２"]),
  },
  onSubmit: (arg) => console.log(arg),
  onCancel: () => console.log("CANCEL"),
};
