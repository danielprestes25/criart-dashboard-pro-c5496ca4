
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Funcionarios from "./pages/Funcionarios";
import Cobrancas from "./pages/Cobrancas";
import Orcamentos from "./pages/Orcamentos";
import Campanhas from "./pages/Campanhas";
import CrmLeads from "./pages/CrmLeads";
import InteligenciaFinanceira from "./pages/InteligenciaFinanceira";
import ProducaoMateriais from "./pages/ProducaoMateriais";
import Perfil from "./pages/Perfil";
import SocialMedia from "./pages/SocialMedia";
import Designer from "./pages/Designer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/funcionarios" element={
              <ProtectedRoute>
                <Funcionarios />
              </ProtectedRoute>
            } />
            <Route path="/cobrancas" element={
              <ProtectedRoute>
                <Cobrancas />
              </ProtectedRoute>
            } />
            <Route path="/orcamentos" element={
              <ProtectedRoute>
                <Orcamentos />
              </ProtectedRoute>
            } />
            <Route path="/campanhas" element={
              <ProtectedRoute>
                <Campanhas />
              </ProtectedRoute>
            } />
            <Route path="/crm-leads" element={
              <ProtectedRoute>
                <CrmLeads />
              </ProtectedRoute>
            } />
            <Route path="/inteligencia-financeira" element={
              <ProtectedRoute>
                <InteligenciaFinanceira />
              </ProtectedRoute>
            } />
            <Route path="/producao-materiais" element={
              <ProtectedRoute>
                <ProducaoMateriais />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            } />
            <Route path="/social-media" element={
              <ProtectedRoute>
                <SocialMedia />
              </ProtectedRoute>
            } />
            <Route path="/designer" element={
              <ProtectedRoute>
                <Designer />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
