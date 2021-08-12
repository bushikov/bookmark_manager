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
  onSubmit: (arg) => console.log(arg),
  onCancel: () => console.log("CANCEL"),
};
