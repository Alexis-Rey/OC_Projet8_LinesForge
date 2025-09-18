import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Landing from "../pages/Landing";
import MainLayout from "../pages/MainLayout";
import Home from "../pages/Home";
import Project from "../pages/Project";
import NotFound from "../pages/NotFound";
import Forgeron from "../pages/Forgeron";
import ScrollReset from "../components/ScrollReset";
import ErrorBoundary from "../components/ErrorBoundary";



function Router() {
    return (<>
    <ErrorBoundary>
    <ScrollReset />
    <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/LinesForge" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="projects/:id" element={<Project />} />
            <Route path="le-forgeron" element={<Forgeron />} />
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="/404" element={<NotFound />} />
    </Routes>
    </ErrorBoundary>
</>)};

export default Router;