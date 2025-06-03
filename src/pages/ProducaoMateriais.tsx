
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Calendar, User, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import { trelloService, TrelloCard, TrelloList } from '@/services/trelloService';
import { TrelloConfigModal } from '@/components/TrelloConfigModal';
import { CreateCardModal } from '@/components/CreateCardModal';

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
  const [draggedCard, setDraggedCard] = useState<TrelloCard | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTrelloData();
  }, []);

  const loadTrelloData = async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      console.log('Carregando dados do Trello...');
      
      if (!trelloService.isConnected()) {
        throw new Error('Trello não está conectado. Configure as credenciais primeiro.');
      }

      console.log('TrelloService: Fazendo chamadas para API...');
      const [trelloCards, trelloLists] = await Promise.all([
        trelloService.getTrelloCards(),
        trelloService.getTrelloLists()
      ]);

      console.log('Cards recebidos:', trelloCards.length);
      console.log('Listas recebidas:', trelloLists.length);

      setCards(trelloCards || []);
      setLists(trelloLists || []);

      toast({
        title: "Dados atualizados!",
        description: `${trelloCards?.length || 0} cards e ${trelloLists?.length || 0} listas carregados do Trello`
      });

    } catch (error: any) {
      console.error('Erro ao carregar dados do Trello:', error);
      setConnectionError(error.message);
      toast({
        title: "Erro ao carregar produção",
        description: error.message || "Não foi possível conectar com o Trello",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCardsByStatus = (statusId: string) => {
    if (!lists.length || !cards.length) return [];

    // Mapear IDs de lista reais para nossos status
    const listMapping = lists.reduce((acc, list) => {
      const normalizedName = list.name.toLowerCase();
      if (normalizedName.includes('briefing') || normalizedName.includes('recebido')) {
        acc[list.id] = 'briefings';
      } else if (normalizedName.includes('criação') || normalizedName.includes('criacao') || normalizedName.includes('criando')) {
        acc[list.id] = 'criacao';
      } else if (normalizedName.includes('revisão') || normalizedName.includes('revisao')) {
        acc[list.id] = 'revisao';
      } else if (normalizedName.includes('aprovado') || normalizedName.includes('concluído') || normalizedName.includes('finalizado')) {
        acc[list.id] = 'aprovado';
      }
      return acc;
    }, {} as Record<string, string>);

    return cards.filter(card => {
      const mappedStatus = listMapping[card.idList];
      return mappedStatus === statusId;
    });
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

  const handleDragStart = (e: React.DragEvent, card: TrelloCard) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    
    if (!draggedCard) return;

    // Encontrar o ID real da lista baseado no mapeamento
    const targetList = lists.find(list => {
      const normalizedName = list.name.toLowerCase();
      switch (targetListId) {
        case 'briefings':
          return normalizedName.includes('briefing') || normalizedName.includes('recebido');
        case 'criacao':
          return normalizedName.includes('criação') || normalizedName.includes('criacao') || normalizedName.includes('criando');
        case 'revisao':
          return normalizedName.includes('revisão') || normalizedName.includes('revisao');
        case 'aprovado':
          return normalizedName.includes('aprovado') || normalizedName.includes('concluído') || normalizedName.includes('finalizado');
        default:
          return false;
      }
    });

    const realTargetListId = targetList?.id || targetListId;

    if (draggedCard.idList === realTargetListId) {
      setDraggedCard(null);
      return;
    }

    try {
      await trelloService.moveCard(draggedCard.id, realTargetListId);
      
      // Atualizar estado local
      setCards(prev => prev.map(card => 
        card.id === draggedCard.id 
          ? { ...card, idList: realTargetListId }
          : card
      ));

      toast({
        title: "Card movido!",
        description: `${draggedCard.name} foi movido para ${targetList?.name || targetListId}`
      });
    } catch (error) {
      console.error('Erro ao mover card:', error);
      toast({
        title: "Erro ao mover card",
        description: "Não foi possível mover o card",
        type: "error"
      });
    } finally {
      setDraggedCard(null);
    }
  };

  const handleDeleteCard = async (cardId: string, cardName: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${cardName}"?`)) return;

    try {
      await trelloService.deleteCard(cardId);
      setCards(prev => prev.filter(card => card.id !== cardId));
      
      toast({
        title: "Card deletado!",
        description: `${cardName} foi removido do Trello`
      });
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      toast({
        title: "Erro ao deletar card",
        description: "Não foi possível deletar o card",
        type: "error"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Produção de Materiais</h1>
            <p className="text-gray-400">Integração completa com Trello - Quadro "Produção Criart"</p>
          </div>
          
          <div className="flex gap-2">
            <CreateCardModal onCardCreated={loadTrelloData} />
            
            <Button 
              onClick={loadTrelloData} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <TrelloConfigModal />
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

        {/* Connection Error */}
        {connectionError && (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">❌ Erro de Conexão com Trello</h3>
                  <p className="text-gray-400 text-sm mb-2">{connectionError}</p>
                  <Button 
                    onClick={loadTrelloData}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Info Card */}
        {!connectionError && trelloService.isConnected() && (
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">✅ Integração Ativa com Trello</h3>
                  <p className="text-gray-400 text-sm">
                    Conectado ao quadro "Produção Criart". Você pode criar, editar, mover e deletar cards diretamente desta interface.
                    <a 
                      href={trelloService.getBoardUrl()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline ml-2 inline-flex items-center gap-1"
                    >
                      Ver no Trello <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center text-gray-400 py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            Carregando produção...
          </div>
        ) : connectionError ? (
          <div className="text-center text-gray-400 py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            Erro na conexão com o Trello. Verifique as configurações.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {statusColumns.map(column => (
              <div 
                key={column.id} 
                className="space-y-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
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
                      className={`${column.bgCard} border hover:shadow-lg transition-all duration-200 cursor-move`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-white mb-2 flex-1">{card.name}</h4>
                            <div className="flex gap-1 ml-2">
                              {card.url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 hover:bg-gray-700"
                                  onClick={() => window.open(card.url, '_blank')}
                                  title="Abrir no Trello"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-red-700"
                                onClick={() => handleDeleteCard(card.id, card.name)}
                                title="Deletar card"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {card.desc && (
                            <p className="text-sm text-gray-400 line-clamp-2">{card.desc}</p>
                          )}
                          
                          {card.labels && card.labels.length > 0 && (
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
                          
                          {card.due && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDueDate(card.due)}</span>
                            </div>
                          )}
                          
                          {card.members && card.members.length > 0 && (
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
                    <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-600 rounded-lg">
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
