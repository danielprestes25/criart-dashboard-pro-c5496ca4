
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReceitas: 0,
    totalDespesas: 0,
    saldoAtual: 0,
    pagamentosPendentes: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  console.log('Dashboard component is rendering');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar dados das APIs
      const [revenues, expenses, cobrancas] = await Promise.all([
        apiService.getRevenues(),
        apiService.getExpenses(),
        apiService.getCobrancas()
      ]);

      console.log('Dashboard data loaded:', { revenues, expenses, cobrancas });

      // Calcular estatísticas
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyRevenues = revenues.filter(r => {
        const date = new Date(r.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const monthlyExpenses = expenses.filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const totalReceitas = monthlyRevenues.reduce((sum, r) => sum + Number(r.amount), 0);
      const totalDespesas = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const saldoAtual = totalReceitas - totalDespesas;
      const pagamentosPendentes = cobrancas.filter(c => c.status === 'Pendente').length;

      setStats({
        totalReceitas,
        totalDespesas,
        saldoAtual,
        pagamentosPendentes
      });

      // Preparar transações recentes (últimas 5)
      const allTransactions = [
        ...revenues.slice(0, 3).map(r => ({
          type: 'receita',
          description: r.description,
          client: r.client,
          amount: r.amount,
          date: r.date
        })),
        ...expenses.slice(0, 2).map(e => ({
          type: 'despesa',
          description: e.description,
          supplier: e.supplier,
          amount: e.amount,
          date: e.date
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

      setRecentTransactions(allTransactions);

      // Preparar próximos vencimentos
      const pendingPayments = cobrancas
        .filter(c => c.status === 'Pendente' || c.status === 'Vencido')
        .slice(0, 3)
        .map(c => ({
          description: `Cobrança - ${c.cliente}`,
          amount: c.valor,
          dueDate: c.data,
          status: c.status
        }));

      setUpcomingPayments(pendingPayments);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: "Erro ao carregar dashboard",
        description: "Não foi possível carregar os dados",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Vencido há ${Math.abs(diffDays)} dias`;
    if (diffDays === 0) return 'Vence hoje';
    return `Vence em ${diffDays} dias`;
  };

  const dashboardStats = [
    {
      title: 'Total de Receitas no Mês',
      value: formatCurrency(stats.totalReceitas),
      icon: TrendingUp,
      description: 'Receitas do mês atual',
    },
    {
      title: 'Total de Despesas no Mês',
      value: formatCurrency(stats.totalDespesas),
      icon: TrendingDown,
      description: 'Despesas do mês atual',
    },
    {
      title: 'Saldo Atual',
      value: formatCurrency(stats.saldoAtual),
      icon: DollarSign,
      description: 'Receitas - Despesas',
    },
    {
      title: 'Pagamentos Pendentes',
      value: stats.pagamentosPendentes.toString(),
      icon: Clock,
      description: 'Cobranças pendentes',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Carregando dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Financeiro</h1>
          <p className="text-gray-400">Visão geral das finanças da Criart</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => {
            console.log('Rendering stat card:', stat.title);
            return (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-gray-400 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Nenhuma transação encontrada</p>
              ) : (
                recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">
                        {transaction.type === 'receita' ? transaction.client : transaction.supplier}
                      </p>
                    </div>
                    <span className={`font-medium ${
                      transaction.type === 'receita' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Próximos Vencimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingPayments.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Nenhum vencimento pendente</p>
              ) : (
                upcomingPayments.map((payment, index) => {
                  const isOverdue = payment.status === 'Vencido';
                  const daysInfo = getDaysUntilDue(payment.dueDate);
                  
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                      isOverdue 
                        ? 'bg-red-900 border-red-600' 
                        : 'bg-yellow-900 border-yellow-600'
                    }`}>
                      <div>
                        <p className="text-white font-medium">{payment.description}</p>
                        <p className="text-gray-400 text-sm">{daysInfo}</p>
                      </div>
                      <span className={`font-medium ${
                        isOverdue ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
