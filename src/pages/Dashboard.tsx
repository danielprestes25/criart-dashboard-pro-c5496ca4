
import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, FileText, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Faturado no Mês',
    value: 'R$ 5.495',
    icon: DollarSign,
    change: '+12.5%',
    color: 'text-green-400',
  },
  {
    title: 'Clientes Ativos',
    value: '12',
    icon: Users,
    change: '+2 novos',
    color: 'text-blue-400',
  },
  {
    title: 'Cobranças Pendentes',
    value: '3',
    icon: FileText,
    change: 'R$ 1.200',
    color: 'text-yellow-400',
  },
  {
    title: 'Receita Estimada Anual',
    value: 'R$ 65.000',
    icon: TrendingUp,
    change: '+8.2%',
    color: 'text-purple-400',
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Visão geral do seu negócio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover:bg-dark-200/70 transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <p className={`text-xs ${stat.color} font-medium`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Pagamento recebido de Maria Silva</p>
                  <p className="text-gray-400 text-xs">R$ 850 • há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Novo cliente adicionado: João Santos</p>
                  <p className="text-gray-400 text-xs">Tech Solutions • há 5 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Orçamento enviado para Ana Costa</p>
                  <p className="text-gray-400 text-xs">R$ 2.500 • ontem</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Próximos Vencimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Carlos Mendes</p>
                  <p className="text-gray-400 text-xs">Criação de Site</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">R$ 1.200</p>
                  <p className="text-red-400 text-xs">Vence em 2 dias</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Fernanda Lima</p>
                  <p className="text-gray-400 text-xs">Marketing Digital</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">R$ 800</p>
                  <p className="text-yellow-400 text-xs">Vence em 5 dias</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Pedro Oliveira</p>
                  <p className="text-gray-400 text-xs">Consultoria</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">R$ 600</p>
                  <p className="text-green-400 text-xs">Vence em 10 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
