import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./modules/Student/StudentDashboard";
import FacultyDashboard from "./modules/Faculty/FacultyDashboard";
import AdminDashboard from "./modules/Admin/AdminDashboard";

// Auth Pages
import Signin from "./auth/Signin";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import FacultyActivation from "./auth/FacultyActivation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Signin />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/activate-faculty" element={<FacultyActivation />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/student/*" element={<StudentDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
              <Route path="/faculty/*" element={<FacultyDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
