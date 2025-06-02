
interface TrelloCard {
  id: string;
  name: string;
  idList: string;
  labels: Array<{ color: string; name: string }>;
  due: string | null;
  members: Array<{ fullName: string }>;
}

interface TrelloList {
  id: string;
  name: string;
}

class TrelloService {
  private baseUrl = 'https://api.trello.com/1';
  
  // TODO: Implementar integração real com Trello
  // Estas credenciais deveriam vir de variáveis de ambiente seguras
  // Por enquanto retornamos dados mock para demonstração
  
  async getTrelloCards(): Promise<TrelloCard[]> {
    try {
      // Simulando dados do Trello
      // Em produção, esta seria uma chamada real para:
      // const response = await fetch(`${this.baseUrl}/boards/${boardId}/cards?key=${key}&token=${token}`);
      
      const mockCards: TrelloCard[] = [
        {
          id: '1',
          name: 'Post Instagram Cliente ABC',
          idList: 'briefings',
          labels: [{ color: 'green', name: 'Urgente' }],
          due: '2024-12-20',
          members: [{ fullName: 'João Silva' }]
        },
        {
          id: '2',
          name: 'Campanha Meta Ads - Empresa XYZ',
          idList: 'criacao',
          labels: [{ color: 'blue', name: 'Marketing' }],
          due: '2024-12-25',
          members: [{ fullName: 'Maria Santos' }]
        },
        {
          id: '3',
          name: 'Design de Logo - StartupDEF',
          idList: 'revisao',
          labels: [{ color: 'purple', name: 'Design' }],
          due: null,
          members: [{ fullName: 'Pedro Costa' }]
        },
        {
          id: '4',
          name: 'Vídeo Institucional - Cliente Z',
          idList: 'aprovado',
          labels: [{ color: 'red', name: 'Vídeo' }],
          due: '2024-12-30',
          members: [{ fullName: 'Ana Silva' }]
        }
      ];

      return mockCards;
    } catch (error) {
      console.error('Erro ao buscar cards do Trello:', error);
      throw error;
    }
  }

  async getTrelloLists(): Promise<TrelloList[]> {
    try {
      // Em produção, esta seria uma chamada real para:
      // const response = await fetch(`${this.baseUrl}/boards/${boardId}/lists?key=${key}&token=${token}`);
      
      const mockLists: TrelloList[] = [
        { id: 'briefings', name: 'Briefings Recebidos' },
        { id: 'criacao', name: 'Em Criação' },
        { id: 'revisao', name: 'Em Revisão' },
        { id: 'aprovado', name: 'Aprovado' }
      ];

      return mockLists;
    } catch (error) {
      console.error('Erro ao buscar listas do Trello:', error);
      throw error;
    }
  }

  // Método para implementar futuramente a integração real
  async connectToTrello(key: string, token: string, boardId: string) {
    // TODO: Implementar conexão real com Trello
    // Validar credenciais e salvar de forma segura
    console.log('Conectando ao Trello com:', { key, token, boardId });
  }
}

export const trelloService = new TrelloService();
export type { TrelloCard, TrelloList };
