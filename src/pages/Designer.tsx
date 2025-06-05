
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClipboardList, Target, CheckCircle, Plus } from 'lucide-react';

export default function Designer() {
  const { hasRole, loading } = useAuth();
  const [dailyGoal, setDailyGoal] = useState('');

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!hasRole(['design', 'admin'])) {
    return <Navigate to="/dashboard" replace />;
  }

  // Mock data para o Kanban
  const kanbanColumns = [
    { title: 'To Do', items: ['Logo para Cliente A', 'Flyer evento B'], color: 'bg-blue-500' },
    { title: 'Doing', items: ['Banner Instagram C'], color: 'bg-yellow-500' },
    { title: 'Review', items: ['Cartão de visita D'], color: 'bg-purple-500' },
    { title: 'Done', items: ['Post Facebook E', 'Identidade visual F'], color: 'bg-green-500' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Designer</h1>
            <p className="text-gray-400">Gerencie projetos e acompanhe metas</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <Card className="bg-dark-200 border-dark-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Meta do Dia
            </CardTitle>
            <CardDescription>
              Defina seu foco de produtividade diário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Input
                placeholder="Ex: Finalizar 3 logos hoje"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="bg-dark-300 border-dark-400 text-white"
              />
              <Button>Salvar Meta</Button>
            </div>
            {dailyGoal && (
              <div className="mt-4 p-3 bg-dark-300 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-white">{dailyGoal}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-dark-200 border-dark-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Quadro Kanban
            </CardTitle>
            <CardDescription>
              Gerencie o fluxo de trabalho dos seus projetos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {kanbanColumns.map((column) => (
                <div key={column.title} className="space-y-3">
                  <div className={`${column.color} text-white p-2 rounded-lg text-center font-semibold`}>
                    {column.title}
                  </div>
                  <div className="space-y-2">
                    {column.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-dark-300 rounded-lg text-white text-sm hover:bg-dark-400 cursor-pointer transition-colors"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white">Integração Trello</CardTitle>
              <CardDescription>
                Sincronize com seu workspace do Trello
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">Conectado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Última sync:</span>
                  <span className="text-white">há 2 min</span>
                </div>
                <Button variant="outline" className="w-full">
                  Configurar Integração
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white">Estatísticas</CardTitle>
              <CardDescription>
                Acompanhe sua produtividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Projetos concluídos:</span>
                  <span className="text-white font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Em andamento:</span>
                  <span className="text-yellow-400 font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Meta mensal:</span>
                  <span className="text-green-400 font-semibold">80%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
