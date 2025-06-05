
import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Brain, Plus } from 'lucide-react';

export default function SocialMedia() {
  const { hasRole, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!hasRole(['social', 'admin'])) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Social Media</h1>
            <p className="text-gray-400">Gerencie seu conteúdo e acompanhe métricas</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendário de Conteúdo
              </CardTitle>
              <CardDescription>
                Visualize e gerencie suas postagens programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Calendário
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Insights Instagram
              </CardTitle>
              <CardDescription>
                Acompanhe métricas de engagement e alcance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Seguidores</span>
                  <span className="text-white font-semibold">1.2k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engagement</span>
                  <span className="text-green-400 font-semibold">5.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alcance</span>
                  <span className="text-white font-semibold">850</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-200 border-dark-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                IA de Otimização
              </CardTitle>
              <CardDescription>
                Receba sugestões inteligentes para seu conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-dark-300 rounded-lg">
                  <p className="text-sm text-white">
                    "Você precisa de +2 reels e +1 carrossel esta semana."
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Ver Mais Sugestões
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-dark-200 border-dark-300">
          <CardHeader>
            <CardTitle className="text-white">Saúde da Conta</CardTitle>
            <CardDescription>
              Avaliação da frequência de posts e engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">Boa</div>
                <div className="text-sm text-gray-400">Frequência de Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">Médio</div>
                <div className="text-sm text-gray-400">Taxa de Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">Ótimo</div>
                <div className="text-sm text-gray-400">Consistência</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
