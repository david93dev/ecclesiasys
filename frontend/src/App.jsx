import "./index.css";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
