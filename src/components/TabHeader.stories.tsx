import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TabHeader } from "./TabHeader";

export default {
  title: "Component/TabHeader",
  component: TabHeader,
} as ComponentMeta<typeof TabHeader>;

const Template: ComponentStory<typeof TabHeader> = (args) => (
  <TabHeader {...args} />
);

export const TabHeaderDefault = Template.bind({});
TabHeaderDefault.args = {
  labels: ["タブ１", "タブ２", "タブ３"],
  onChange: (index) => {
    console.log(index);
    return;
  },
};
