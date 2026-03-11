import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import { DashBoard } from "@/pages/DashBoard";
import { Login } from "@/pages/Login";
import { NotFound } from "@/pages/NotFound";
import { Members } from "@/pages/Members";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />

          <Route path="/members" element={<Members />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};