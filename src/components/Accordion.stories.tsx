import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Accordion, FunctionalAccordion } from "./Accordion";

export default {
  title: "Component/Accordion",
  component: Accordion,
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args} />
);

export const AccordionDefault = Template.bind({});
AccordionDefault.args = {
  title: "タイトル",
  labels: ["ラベル１", "ラベル２"],
  isFocus: true,
  onSelect: (label) => console.log(label),
};

const FunctionalAccordionTemplate: ComponentStory<
  typeof FunctionalAccordion
> = (args) => <FunctionalAccordion {...args} />;

export const FunctionalAccordionDefault = FunctionalAccordionTemplate.bind({});
FunctionalAccordionDefault.args = {
  title: "タイトル",
  labels: ["ラベル１", "ラベル２"],
  isFocus: true,
  onSelect: (label) => console.log(label),
  onAdd: () => console.log("ADD"),
  onEdit: () => console.log("EDIT"),
  onDelete: (label) => console.log(label),
};
