import React from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import Router from "./router/Router";
import { AdminModalProvider } from "./contexts/adminModal";
import AdminModal from "./components/admin/AdminModal";   

const RouterWrapper = process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;

function App() {
  return (
    <RouterWrapper>
      <AdminModalProvider>
        <Router />
        <AdminModal />   {/* rendu global, masquée tant qu’inactive */}
      </AdminModalProvider>
    </RouterWrapper>
  );
}

export default App;

