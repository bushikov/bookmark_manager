import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Form } from "./Form";

export default {
  title: "Component/Form",
  component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />;

export const FormDefault = Template.bind({});
FormDefault.args = {
  initialAliasName: "",
  initialType: "and",
  initialTags: [],
  onSubmit: (arg) => console.log(arg),
  onCancel: () => console.log("CANCEL"),
};

export const FormInitialData = Template.bind({});
FormInitialData.args = {
  initialAliasName: "エイリアス",
  initialType: "or",
  initialTags: ["タグ１", "タグ２"],
  onSubmit: (arg) => console.log(arg),
  onCancel: () => console.log("CANCEL"),
};
