
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, DollarSign, Megaphone, UserCheck, Brain, User, LogOut, Palette, Calendar, TrendingUp, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const location = useLocation();
  const { logout, user, hasRole } = useAuth();

  // Menus baseados em roles
  const getMenuItems = () => {
    const items = [];

    // Admin vê tudo
    if (hasRole(['admin'])) {
      items.push(
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Funcionários', url: '/funcionarios', icon: Users },
        { title: 'Receitas e Cobranças', url: '/cobrancas', icon: DollarSign },
        { title: 'Orçamentos e Propostas', url: '/orcamentos', icon: FileText },
        { title: 'Ferramentas de Marketing', url: '/campanhas', icon: Megaphone },
        { title: 'CRM de Leads', url: '/crm-leads', icon: UserCheck },
        { title: 'Produção de Materiais', url: '/producao-materiais', icon: Palette },
        { title: 'IA Financeira', url: '/inteligencia-financeira', icon: Brain },
        { title: 'Social Media', url: '/social-media', icon: TrendingUp },
        { title: 'Designer', url: '/designer', icon: ClipboardList }
      );
    }
    // Social Media role
    else if (hasRole(['social'])) {
      items.push(
        { title: 'Social Media', url: '/social-media', icon: TrendingUp },
        { title: 'Calendário', url: '/social-media/calendario', icon: Calendar },
        { title: 'Insights', url: '/social-media/insights', icon: TrendingUp },
        { title: 'IA Conteúdo', url: '/social-media/ia', icon: Brain }
      );
    }
    // Design role
    else if (hasRole(['design'])) {
      items.push(
        { title: 'Designer', url: '/designer', icon: ClipboardList },
        { title: 'Kanban', url: '/designer/kanban', icon: ClipboardList },
        { title: 'Metas', url: '/designer/metas', icon: Users },
        { title: 'Produção', url: '/producao-materiais', icon: Palette }
      );
    }

    // Perfil sempre disponível
    items.push({ title: 'Perfil', url: '/perfil', icon: User });

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col h-screen w-64 bg-dark-200 border-r border-dark-300">
      {/* Logo */}
      <div className="p-6 border-b border-dark-300">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/ef34442c-50fc-4535-a0f2-97651b6dacb6.png" 
            alt="Criart Logo" 
            className="h-8 w-auto" 
          />
          <h1 className="text-xl font-bold gradient-text"></h1>
        </div>
        {user && (
          <div className="mt-2 text-sm text-gray-400">
            {user.name} ({user.role})
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-dark-300 ${
                isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-300">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-dark-300"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
