
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, TrendingUp, AlertTriangle, DollarSign, MessageSquare, Send } from 'lucide-react';
import { apiService } from '@/services/api';

interface FinancialInsight {
  resumo: string;
  recomendacoes: string[];
  alertas: string[];
  projecoes: {
    receita_projetada: number;
    gastos_recomendados: number;
    lucro_estimado: number;
  };
  score_saude_financeira: number;
}

const suggestedQuestions = [
  "Quanto posso investir em marketing este mês?",
  "Quais são meus maiores gastos desnecessários?",
  "Como está minha previsibilidade de receita?",
  "Preciso contratar mais funcionários?",
  "Qual o melhor momento para fazer investimentos?"
];

export default function InteligenciaFinanceira() {
  const [insights, setInsights] = useState<FinancialInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFinancialAnalysis();
  }, []);

  const loadFinancialAnalysis = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getFinancialAnalysis();
      setInsights(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar análise",
        description: "Não foi possível carregar a análise financeira",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion: string) => {
    setQuestion(suggestedQuestion);
    handleAskQuestion(suggestedQuestion);
  };

  const handleAskQuestion = async (questionText?: string) => {
    const finalQuestion = questionText || question;
    if (!finalQuestion.trim()) return;

    setChatHistory(prev => [...prev, { type: 'user', message: finalQuestion }]);
    setQuestion('');
    setIsLoading(true);

    try {
      // Simulate AI response for now - in real implementation, this would call the AI API
      const aiResponse = generateAIResponse(finalQuestion);
      setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
    } catch (error) {
      toast({
        title: "Erro na consulta",
        description: "Não foi possível processar sua pergunta",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (question: string): string => {
    // Simulate AI responses based on question keywords
    if (question.toLowerCase().includes('investir') || question.toLowerCase().includes('marketing')) {
      return "Com base na sua receita atual e histórico de ROI, recomendo investir entre R$ 800-1.200 em marketing este mês. Foque no Google Ads que tem mostrado melhor conversão (3.2x ROI).";
    }
    if (question.toLowerCase().includes('gastos') || question.toLowerCase().includes('despesas')) {
      return "Identifiquei que você tem 2 ferramentas duplicadas (CRM e automação de email). Cancelando uma delas, economizaria R$ 297/mês. Também há oportunidade de renegociar o plano do Google Workspace.";
    }
    if (question.toLowerCase().includes('receita') || question.toLowerCase().includes('previsibilidade')) {
      return "Sua receita tem padrão sazonal com picos em março e outubro. Para o próximo trimestre, projeto R$ 18.500 baseado no seu pipeline atual e histórico de conversão de 23%.";
    }
    if (question.toLowerCase().includes('funcionário') || question.toLowerCase().includes('contratar')) {
      return "Seus indicadores sugerem que você pode contratar 1 novo funcionário. Sua margem atual de 34% comporta um salário de até R$ 3.500 sem comprometer a saúde financeira.";
    }
    return "Baseado nos seus dados financeiros, essa é uma excelente pergunta. Preciso analisar mais dados específicos para dar uma recomendação precisa. Você pode reformular a pergunta com mais detalhes?";
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Crítica';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-white">Inteligência Financeira</h1>
            <p className="text-gray-400">Assistente IA para análises e recomendações financeiras</p>
          </div>
        </div>

        {isLoading && !insights ? (
          <div className="text-center text-gray-400 py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p>Analisando seus dados financeiros...</p>
          </div>
        ) : (
          <>
            {/* Score de Saúde Financeira */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Score de Saúde Financeira
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">
                    {insights?.score_saude_financeira || 75}%
                  </div>
                  <div>
                    <div className={`text-lg font-semibold ${getHealthScoreColor(insights?.score_saude_financeira || 75)}`}>
                      {getHealthScoreLabel(insights?.score_saude_financeira || 75)}
                    </div>
                    <p className="text-gray-400">Baseado em fluxo de caixa, receitas e despesas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo e Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Resumo Inteligente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {insights?.resumo || "Neste mês, seu lucro líquido subiu 15% em relação ao anterior. Seu negócio está crescendo de forma sustentável com boa margem de segurança."}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Alertas Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(insights?.alertas || [
                    "Cobrança #104 vencida há 15 dias",
                    "Pagamento de funcionário Pedro em atraso",
                    "Meta Ads vence em 3 dias"
                  ]).map((alerta, index) => (
                    <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10">
                      {alerta}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recomendações */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Recomendações Estratégicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(insights?.recomendacoes || [
                    "Investir R$ 900 em Google Ads baseado no ROI atual",
                    "Renegociar contrato do CRM para economizar 30%",
                    "Priorizar cobrança dos inadimplentes: João, Maria",
                    "Considere contratar 1 desenvolvedor júnior",
                    "Diversificar fontes de receita com novos serviços"
                  ]).map((recomendacao, index) => (
                    <div key={index} className="p-4 bg-green-400/10 border border-green-400/20 rounded-lg">
                      <p className="text-green-300 text-sm">{recomendacao}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat com IA */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Consulte a IA Financeira
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Perguntas Sugeridas */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">Perguntas sugeridas:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs text-gray-300 border-gray-600 hover:border-primary hover:text-primary"
                        onClick={() => handleSuggestedQuestion(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Histórico do Chat */}
                {chatHistory.length > 0 && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          chat.type === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-dark-300 text-gray-300'
                        }`}>
                          <p className="text-sm">{chat.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Campo de Pergunta */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Faça uma pergunta sobre suas finanças..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    className="bg-dark-300 border-dark-400 text-white"
                  />
                  <Button 
                    onClick={() => handleAskQuestion()}
                    disabled={!question.trim() || isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
