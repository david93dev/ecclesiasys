import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import { DashBoard } from "@/pages/DashBoard";
import { Login } from "@/pages/Login";
import { NotFound } from "@/pages/NotFound";
import { Members } from "@/pages/Members";
import { Ministries } from "@/pages/Ministries";
import { Events } from "@/pages/Events";
import { Contributions } from "@/pages/Contributions";
import { SettingsPage } from "@/pages/SettingsPage";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoutes } from "./PublicRoutes";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contributions" element={<Contributions />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
