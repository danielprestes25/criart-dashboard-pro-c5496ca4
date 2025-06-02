
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/cobrancas" element={<Cobrancas />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/campanhas" element={<Campanhas />} />
            <Route path="/crm-leads" element={<CrmLeads />} />
            <Route path="/inteligencia-financeira" element={<InteligenciaFinanceira />} />
            <Route path="/producao-materiais" element={<ProducaoMateriais />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
