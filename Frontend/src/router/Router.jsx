import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Landing from "../pages/Landing";
import MainLayout from "../pages/MainLayout";
// import Home from "../pages/Home";
// import About from "../pages/About";
// import NotFound from "../pages/NotFound";
// import Logement from "../pages/Logement";

function Router() {
    return <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/Home" element={<MainLayout />}>
            {/* <Route index element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/logement/:id" element={<Logement />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/*" element={<Navigate to="/404" />} /> */}
        </Route>
    </Routes>
};

export default Router;