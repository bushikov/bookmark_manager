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
  initialAliasName: "",
  initialType: "and",
  initialTags: [],
  onSubmit: (arg) => console.log(arg),
  onCancel: () => console.log("CANCEL"),
};

export const TagAliasFormInitialData = Template.bind({});
TagAliasFormInitialData.args = {
  initialAliasName: "エイリアス",
  initialType: "or",
  initialTags: ["タグ１", "タグ２"],
  onSubmit: (arg) => console.log(arg),
  onCancel: () => console.log("CANCEL"),
};
