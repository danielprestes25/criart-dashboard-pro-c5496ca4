
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Megaphone,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Cobranças',
    url: '/cobrancas',
    icon: DollarSign,
  },
  {
    title: 'Orçamentos',
    url: '/orcamentos',
    icon: FileText,
  },
  {
    title: 'Campanhas',
    url: '/campanhas',
    icon: Megaphone,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-screen w-64 bg-dark-200 border-r border-dark-300">
      {/* Logo */}
      <div className="p-6 border-b border-dark-300">
        <h1 className="text-2xl font-bold gradient-text">Painel Criart</h1>
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
