
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Brain
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CampanhaResult {
  investimento: number;
  canais: string[];
  estimativaLeads: number;
  roi: string;
  alcance: number;
  conversao: string;
}

export default function Campanhas() {
  const [formData, setFormData] = useState({
    objetivo: '',
    ticketMedio: '',
    nicho: '',
    duracao: '',
  });
  
  const [resultado, setResultado] = useState<CampanhaResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ticketMedio = parseFloat(formData.ticketMedio);
    const duracao = parseInt(formData.duracao);
    
    // Lógica de cálculo simplificada
    let investimentoBase = 0;
    let canaisRecomendados: string[] = [];
    
    switch (formData.objetivo) {
      case 'vendas':
        investimentoBase = ticketMedio * 0.3;
        canaisRecomendados = ['Google Ads', 'Facebook Ads', 'Instagram'];
        break;
      case 'leads':
        investimentoBase = ticketMedio * 0.2;
        canaisRecomendados = ['Facebook Ads', 'LinkedIn', 'Google Ads'];
        break;
      case 'trafego':
        investimentoBase = ticketMedio * 0.15;
        canaisRecomendados = ['Instagram', 'TikTok', 'Google Ads'];
        break;
    }

    const investimentoTotal = investimentoBase * duracao;
    const estimativaLeads = Math.round((investimentoTotal / 50) * (Math.random() * 0.5 + 0.75));
    const roi = ((estimativaLeads * ticketMedio * 0.1) / investimentoTotal * 100).toFixed(1);

    const novoResultado: CampanhaResult = {
      investimento: investimentoTotal,
      canais: canaisRecomendados,
      estimativaLeads,
      roi: `${roi}%`,
      alcance: estimativaLeads * 8,
      conversao: '12-18%',
    };

    setResultado(novoResultado);
    
    toast({
      title: "Campanha planejada com sucesso!",
      description: `Plano criado para ${formData.nicho} com investimento de R$ ${investimentoTotal.toLocaleString('pt-BR')}.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Planejador de Campanhas</h1>
          <p className="text-gray-400">Crie campanhas inteligentes baseadas em IA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Configuração da Campanha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objetivo" className="text-gray-300">Objetivo da Campanha</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, objetivo: value })}>
                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-300 border-dark-400">
                      <SelectItem value="vendas">Aumentar Vendas</SelectItem>
                      <SelectItem value="leads">Gerar Leads</SelectItem>
                      <SelectItem value="trafego">Aumentar Tráfego</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticketMedio" className="text-gray-300">Ticket Médio (R$)</Label>
                  <Input
                    id="ticketMedio"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 500"
                    value={formData.ticketMedio}
                    onChange={(e) => setFormData({ ...formData, ticketMedio: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nicho" className="text-gray-300">Nicho/Segmento</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, nicho: value })}>
                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                      <SelectValue placeholder="Selecione o nicho" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-300 border-dark-400">
                      <SelectItem value="e-commerce">E-commerce</SelectItem>
                      <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="imobiliario">Imobiliário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracao" className="text-gray-300">Duração (semanas)</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, duracao: value })}>
                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-300 border-dark-400">
                      <SelectItem value="2">2 semanas</SelectItem>
                      <SelectItem value="4">4 semanas</SelectItem>
                      <SelectItem value="8">8 semanas</SelectItem>
                      <SelectItem value="12">12 semanas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 mt-6"
                  disabled={!formData.objetivo || !formData.ticketMedio || !formData.nicho || !formData.duracao}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Gerar Plano de Campanha
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {resultado && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
                  Resultado da Análise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Investment */}
                <div className="p-4 bg-dark-300/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">Investimento Sugerido</span>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(resultado.investimento)}
                    </span>
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-blue-400" />
                    Canais Recomendados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resultado.canais.map((canal, index) => (
                      <Badge key={index} className="bg-primary/20 text-primary border-primary/30">
                        {canal}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-dark-300/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Leads Estimados</span>
                    </div>
                    <span className="text-xl font-bold text-white">{resultado.estimativaLeads}</span>
                  </div>
                  
                  <div className="p-3 bg-dark-300/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-400">ROI Esperado</span>
                    </div>
                    <span className="text-xl font-bold text-white">{resultado.roi}</span>
                  </div>

                  <div className="p-3 bg-dark-300/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-gray-400">Alcance</span>
                    </div>
                    <span className="text-xl font-bold text-white">{resultado.alcance.toLocaleString('pt-BR')}</span>
                  </div>

                  <div className="p-3 bg-dark-300/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">Conversão</span>
                    </div>
                    <span className="text-xl font-bold text-white">{resultado.conversao}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-300">
                  <p className="text-sm text-gray-400 mb-2">
                    💡 <strong>Dica:</strong> Baseado no seu nicho "{formData.nicho}", 
                    recomendamos focar em {resultado.canais[0]} para maximizar resultados.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    Exportar Plano Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Campaign Tips */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">💡 Dicas para Campanhas de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-dark-300/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">Segmentação</h4>
                <p className="text-gray-400 text-sm">
                  Defina seu público-alvo com precisão. Quanto mais específico, melhor será sua taxa de conversão.
                </p>
              </div>
              <div className="p-4 bg-dark-300/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">Teste A/B</h4>
                <p className="text-gray-400 text-sm">
                  Sempre teste diferentes criativos, textos e audiências para otimizar seus resultados.
                </p>
              </div>
              <div className="p-4 bg-dark-300/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">Monitoramento</h4>
                <p className="text-gray-400 text-sm">
                  Acompanhe métricas diariamente e ajuste sua estratégia com base nos dados coletados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
