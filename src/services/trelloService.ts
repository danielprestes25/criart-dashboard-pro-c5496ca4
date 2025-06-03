
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
  private credentials: { key?: string; token?: string; boardId?: string } = {};
  
  async getTrelloCards(): Promise<TrelloCard[]> {
    try {
      console.log('TrelloService: Buscando cards...');
      
      // Se as credenciais estiverem configuradas, usar API real
      if (this.credentials.key && this.credentials.token && this.credentials.boardId) {
        console.log('TrelloService: Usando API real do Trello');
        const response = await fetch(
          `${this.baseUrl}/boards/${this.credentials.boardId}/cards?key=${this.credentials.key}&token=${this.credentials.token}`
        );
        
        if (!response.ok) {
          throw new Error(`Erro na API do Trello: ${response.status}`);
        }
        
        const cards = await response.json();
        return cards;
      }
      
      // Caso contrário, usar dados mock
      console.log('TrelloService: Usando dados mock');
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

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockCards;
    } catch (error) {
      console.error('Erro ao buscar cards do Trello:', error);
      throw error;
    }
  }

  async getTrelloLists(): Promise<TrelloList[]> {
    try {
      console.log('TrelloService: Buscando listas...');
      
      // Se as credenciais estiverem configuradas, usar API real
      if (this.credentials.key && this.credentials.token && this.credentials.boardId) {
        console.log('TrelloService: Usando API real do Trello para listas');
        const response = await fetch(
          `${this.baseUrl}/boards/${this.credentials.boardId}/lists?key=${this.credentials.key}&token=${this.credentials.token}`
        );
        
        if (!response.ok) {
          throw new Error(`Erro na API do Trello: ${response.status}`);
        }
        
        const lists = await response.json();
        return lists;
      }
      
      // Caso contrário, usar dados mock
      console.log('TrelloService: Usando dados mock para listas');
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

  async connectToTrello(key: string, token: string, boardId: string) {
    try {
      console.log('TrelloService: Conectando ao Trello...', { key: key.substring(0, 8) + '...', boardId });
      
      // Validar credenciais fazendo uma chamada de teste
      const testResponse = await fetch(
        `${this.baseUrl}/boards/${boardId}?key=${key}&token=${token}`
      );
      
      if (!testResponse.ok) {
        throw new Error('Credenciais inválidas ou board não encontrado');
      }
      
      // Se chegou até aqui, as credenciais são válidas
      this.credentials = { key, token, boardId };
      
      // Salvar no localStorage para persistir entre sessões
      localStorage.setItem('trello_credentials', JSON.stringify(this.credentials));
      
      console.log('TrelloService: Conexão estabelecida com sucesso!');
      return true;
    } catch (error) {
      console.error('TrelloService: Erro ao conectar:', error);
      throw error;
    }
  }

  // Carregar credenciais do localStorage na inicialização
  loadStoredCredentials() {
    try {
      const stored = localStorage.getItem('trello_credentials');
      if (stored) {
        this.credentials = JSON.parse(stored);
        console.log('TrelloService: Credenciais carregadas do localStorage');
      }
    } catch (error) {
      console.error('TrelloService: Erro ao carregar credenciais:', error);
    }
  }
}

// Criar instância e carregar credenciais
const trelloServiceInstance = new TrelloService();
trelloServiceInstance.loadStoredCredentials();

export const trelloService = trelloServiceInstance;
export type { TrelloCard, TrelloList };
