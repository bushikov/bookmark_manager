import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { UrlCard } from "./UrlCard";

export default {
  title: "Component/UrlCard",
  component: UrlCard,
} as ComponentMeta<typeof UrlCard>;

const Tempate: ComponentStory<typeof UrlCard> = (args) => <UrlCard {...args} />;

export const UrlCardDefault = Tempate.bind({});
UrlCardDefault.args = {
  title:
    "タイトルあああああああああああああああああああああああああああああああああああああああああああああああああああん",
  url: "https://www.amazon.co.jp/dp/B01NCX3W3O/",
  tags: ["タグ１", "タグ２", "タグ３"],
  onAdd: (text) => console.log(text),
  onDelete: (text) => console.log(text),
};

export const UrlCardNothing = Tempate.bind({});
UrlCardNothing.args = {
  title:
    "タイトルあああああああああああああああああああああああああああああああああああああああああああああああああああん",
  url: "https://www.amazon.co.jp/dp/B01NCX3W3O/",
  onAdd: (text) => console.log(text),
  onDelete: (text) => console.log(text),
};
