
import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total de Receitas no Mês',
      value: 'R$ 15.450',
      icon: TrendingUp,
      description: '+12% em relação ao mês anterior',
    },
    {
      title: 'Total de Despesas no Mês',
      value: 'R$ 8.230',
      icon: TrendingDown,
      description: 'Incluindo salários e ferramentas',
    },
    {
      title: 'Saldo Atual',
      value: 'R$ 7.220',
      icon: DollarSign,
      description: 'Disponível em conta',
    },
    {
      title: 'Pagamentos Pendentes',
      value: '5',
      icon: Clock,
      description: 'Funcionários e fornecedores',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Financeiro</h1>
          <p className="text-gray-400">Visão geral das finanças da Criart</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Pagamento - João Silva</p>
                  <p className="text-gray-400 text-sm">Desenvolvedor</p>
                </div>
                <span className="text-red-400 font-medium">-R$ 3.500</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Receita - Cliente ABC</p>
                  <p className="text-gray-400 text-sm">Projeto de site</p>
                </div>
                <span className="text-green-400 font-medium">+R$ 2.800</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Ferramenta - RD Station</p>
                  <p className="text-gray-400 text-sm">Marketing</p>
                </div>
                <span className="text-red-400 font-medium">-R$ 199</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Próximos Vencimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">Salário - Maria Santos</p>
                  <p className="text-gray-400 text-sm">Vence em 3 dias</p>
                </div>
                <span className="text-yellow-400 font-medium">R$ 2.800</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">Meta Ads</p>
                  <p className="text-gray-400 text-sm">Vence em 5 dias</p>
                </div>
                <span className="text-yellow-400 font-medium">R$ 500</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">Google Workspace</p>
                  <p className="text-gray-400 text-sm">Vencido há 2 dias</p>
                </div>
                <span className="text-red-400 font-medium">R$ 120</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
