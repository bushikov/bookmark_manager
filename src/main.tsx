import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "tailwindcss/tailwind.css";

import App from "./app";

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.querySelector("#app")
);
