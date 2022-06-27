import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./app";

// Still not too sure what to do with this honestly

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);