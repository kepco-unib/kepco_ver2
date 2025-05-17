import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import { activeModeAtom } from "./recoil/activeModeAtom";
import RecoilObserver from "./RecoilObserver"; 

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilObserver />
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
