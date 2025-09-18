import React from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import Router from "./router/Router";

const RouterWrapper = process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;

function App() {
  return (
    <RouterWrapper>
      <Router />
    </RouterWrapper>
  );
}

export default App;

