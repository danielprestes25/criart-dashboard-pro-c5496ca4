
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Calendar, User, Settings } from 'lucide-react';
import { trelloService, TrelloCard, TrelloList } from '@/services/trelloService';

const statusColumns = [
  { id: 'briefings', title: 'Briefings Recebidos', color: 'bg-blue-500', bgCard: 'bg-blue-500/10 border-blue-500/30' },
  { id: 'criacao', title: 'Em Criação', color: 'bg-yellow-500', bgCard: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'revisao', title: 'Em Revisão', color: 'bg-orange-500', bgCard: 'bg-orange-500/10 border-orange-500/30' },
  { id: 'aprovado', title: 'Aprovado', color: 'bg-green-500', bgCard: 'bg-green-500/10 border-green-500/30' }
];

export default function ProducaoMateriais() {
  const [cards, setCards] = useState<TrelloCard[]>([]);
  const [lists, setLists] = useState<TrelloList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTrelloData();
  }, []);

  const loadTrelloData = async () => {
    try {
      setIsLoading(true);
      
      const [trelloCards, trelloLists] = await Promise.all([
        trelloService.getTrelloCards(),
        trelloService.getTrelloLists()
      ]);

      setCards(trelloCards);
      setLists(trelloLists);

      toast({
        title: "Dados carregados!",
        description: "Produção de materiais atualizada"
      });

    } catch (error) {
      console.error('Erro ao carregar dados do Trello:', error);
      toast({
        title: "Erro ao carregar produção",
        description: "Não foi possível conectar com o Trello",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCardsByStatus = (statusId: string) => {
    return cards.filter(card => card.idList === statusId);
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Atrasado ${Math.abs(diffDays)} dias`;
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return 'Vence amanhã';
    return `${diffDays} dias`;
  };

  const getLabelColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'green': 'bg-green-500',
      'blue': 'bg-blue-500',
      'purple': 'bg-purple-500',
      'red': 'bg-red-500',
      'yellow': 'bg-yellow-500',
      'orange': 'bg-orange-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Produção de Materiais</h1>
            <p className="text-gray-400">Acompanhe o status dos materiais em produção via Trello</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={loadTrelloData} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button 
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar Trello
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusColumns.map(column => (
            <Card key={column.id} className={`${column.bgCard} border`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {getCardsByStatus(column.id).length}
                </div>
                <p className="text-sm text-gray-300">{column.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-white font-medium mb-1">Integração com Trello</h3>
                <p className="text-gray-400 text-sm">
                  Para conectar com seu quadro real do Trello, configure suas credenciais nas configurações. 
                  Por enquanto, estamos exibindo dados de demonstração.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Carregando produção...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {statusColumns.map(column => (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 border border-gray-700">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                  <span className="text-sm text-gray-400 ml-auto">
                    ({getCardsByStatus(column.id).length})
                  </span>
                </div>
                
                <div className="space-y-3 min-h-[500px]">
                  {getCardsByStatus(column.id).map(card => (
                    <Card 
                      key={card.id} 
                      className={`${column.bgCard} border hover:shadow-lg transition-shadow duration-200`}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-white mb-2">{card.name}</h4>
                            
                            {card.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {card.labels.map((label, index) => (
                                  <span 
                                    key={index}
                                    className={`text-xs px-2 py-1 rounded-full text-white ${getLabelColor(label.color)}`}
                                  >
                                    {label.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {card.due && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDueDate(card.due)}</span>
                            </div>
                          )}
                          
                          {card.members.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <User className="h-3 w-3" />
                              <span>{card.members[0].fullName}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getCardsByStatus(column.id).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Nenhum material neste status
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
