
interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  idList: string;
  labels: Array<{ color: string; name: string }>;
  due: string | null;
  members: Array<{ fullName: string; id: string }>;
  dateLastActivity: string;
  url: string;
  actions?: Array<{
    id: string;
    type: string;
    date: string;
    memberCreator: { fullName: string };
    data: any;
  }>;
  checklists?: Array<{
    id: string;
    name: string;
    checkItems: Array<{
      id: string;
      name: string;
      state: 'complete' | 'incomplete';
    }>;
  }>;
}

interface TrelloList {
  id: string;
  name: string;
  pos: number;
}

interface TrelloMember {
  id: string;
  fullName: string;
  username: string;
}

interface CreateCardData {
  name: string;
  desc?: string;
  idList: string;
  due?: string;
  idMembers?: string[];
  pos?: 'top' | 'bottom' | number;
}

class TrelloService {
  private baseUrl = 'https://api.trello.com/1';
  private credentials: { key?: string; token?: string; boardId?: string } = {
    key: '703c970019af6615ddd56ff981e9adf2',
    token: 'c062109eefb7d29dcd078b2b81805acb964ce89b8133ad14d0f18793916b85b1',
    boardId: '9I93KoUZ'
  };
  
  private getAuthParams() {
    return `key=${this.credentials.key}&token=${this.credentials.token}`;
  }

  async getTrelloCards(): Promise<TrelloCard[]> {
    try {
      console.log('TrelloService: Buscando cards...');
      
      if (this.credentials.key && this.credentials.token && this.credentials.boardId) {
        console.log('TrelloService: Usando API real do Trello');
        const response = await fetch(
          `${this.baseUrl}/boards/${this.credentials.boardId}/cards?${this.getAuthParams()}&actions=all&checklists=all&members=true`
        );
        
        if (!response.ok) {
          throw new Error(`Erro na API do Trello: ${response.status}`);
        }
        
        const cards = await response.json();
        console.log('TrelloService: Cards carregados da API:', cards);
        return cards;
      }
      
      // Dados mock para fallback
      console.log('TrelloService: Usando dados mock');
      const mockCards: TrelloCard[] = [
        {
          id: '1',
          name: 'Post Instagram Cliente ABC',
          desc: 'Criar post para redes sociais do cliente ABC',
          idList: 'briefings',
          labels: [{ color: 'green', name: 'Urgente' }],
          due: '2024-12-20',
          members: [{ fullName: 'João Silva', id: 'user1' }],
          dateLastActivity: '2024-12-15',
          url: 'https://trello.com/c/1'
        },
        {
          id: '2',
          name: 'Campanha Meta Ads - Empresa XYZ',
          desc: 'Desenvolver campanha de marketing digital',
          idList: 'criacao',
          labels: [{ color: 'blue', name: 'Marketing' }],
          due: '2024-12-25',
          members: [{ fullName: 'Maria Santos', id: 'user2' }],
          dateLastActivity: '2024-12-14',
          url: 'https://trello.com/c/2'
        }
      ];

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
      
      if (this.credentials.key && this.credentials.token && this.credentials.boardId) {
        const response = await fetch(
          `${this.baseUrl}/boards/${this.credentials.boardId}/lists?${this.getAuthParams()}`
        );
        
        if (!response.ok) {
          throw new Error(`Erro na API do Trello: ${response.status}`);
        }
        
        const lists = await response.json();
        console.log('TrelloService: Listas carregadas da API:', lists);
        return lists;
      }
      
      // Mock lists
      const mockLists: TrelloList[] = [
        { id: 'briefings', name: 'Briefings Recebidos', pos: 1 },
        { id: 'criacao', name: 'Em Criação', pos: 2 },
        { id: 'revisao', name: 'Em Revisão', pos: 3 },
        { id: 'aprovado', name: 'Aprovado', pos: 4 }
      ];

      return mockLists;
    } catch (error) {
      console.error('Erro ao buscar listas do Trello:', error);
      throw error;
    }
  }

  async getBoardMembers(): Promise<TrelloMember[]> {
    try {
      if (this.credentials.key && this.credentials.token && this.credentials.boardId) {
        const response = await fetch(
          `${this.baseUrl}/boards/${this.credentials.boardId}/members?${this.getAuthParams()}`
        );
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar membros: ${response.status}`);
        }
        
        return await response.json();
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar membros do board:', error);
      throw error;
    }
  }

  async createCard(cardData: CreateCardData): Promise<TrelloCard> {
    try {
      console.log('TrelloService: Criando card...', cardData);
      
      if (!this.credentials.key || !this.credentials.token) {
        throw new Error('Credenciais do Trello não configuradas');
      }

      const params = new URLSearchParams({
        ...cardData,
        key: this.credentials.key,
        token: this.credentials.token
      });

      const response = await fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar card: ${response.status}`);
      }

      const newCard = await response.json();
      console.log('TrelloService: Card criado com sucesso:', newCard);
      return newCard;
    } catch (error) {
      console.error('Erro ao criar card:', error);
      throw error;
    }
  }

  async updateCard(cardId: string, updates: Partial<CreateCardData>): Promise<TrelloCard> {
    try {
      console.log('TrelloService: Atualizando card...', { cardId, updates });
      
      if (!this.credentials.key || !this.credentials.token) {
        throw new Error('Credenciais do Trello não configuradas');
      }

      const params = new URLSearchParams({
        ...updates,
        key: this.credentials.key,
        token: this.credentials.token
      });

      const response = await fetch(`${this.baseUrl}/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar card: ${response.status}`);
      }

      const updatedCard = await response.json();
      console.log('TrelloService: Card atualizado com sucesso:', updatedCard);
      return updatedCard;
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      throw error;
    }
  }

  async moveCard(cardId: string, targetListId: string): Promise<TrelloCard> {
    return this.updateCard(cardId, { idList: targetListId });
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      console.log('TrelloService: Deletando card...', cardId);
      
      if (!this.credentials.key || !this.credentials.token) {
        throw new Error('Credenciais do Trello não configuradas');
      }

      const response = await fetch(
        `${this.baseUrl}/cards/${cardId}?${this.getAuthParams()}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Erro ao deletar card: ${response.status}`);
      }

      console.log('TrelloService: Card deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      throw error;
    }
  }

  async getCardActions(cardId: string): Promise<any[]> {
    try {
      if (!this.credentials.key || !this.credentials.token) {
        throw new Error('Credenciais do Trello não configuradas');
      }

      const response = await fetch(
        `${this.baseUrl}/cards/${cardId}/actions?${this.getAuthParams()}&limit=50`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar ações do card: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar ações do card:', error);
      throw error;
    }
  }

  async connectToTrello(key: string, token: string, boardId: string) {
    try {
      console.log('TrelloService: Conectando ao Trello...');
      
      const cleanBoardId = boardId.split('/')[0].trim();
      
      if (!/^[a-zA-Z0-9]{8,}$/.test(cleanBoardId)) {
        throw new Error('Board ID deve conter apenas letras e números (8+ caracteres)');
      }
      
      const testResponse = await fetch(
        `${this.baseUrl}/boards/${cleanBoardId}?key=${key}&token=${token}`
      );
      
      if (!testResponse.ok) {
        throw new Error('Credenciais inválidas ou board não encontrado');
      }
      
      this.credentials = { key, token, boardId: cleanBoardId };
      localStorage.setItem('trello_credentials', JSON.stringify(this.credentials));
      
      console.log('TrelloService: Conexão estabelecida com sucesso!');
      return true;
    } catch (error) {
      console.error('TrelloService: Erro ao conectar:', error);
      throw error;
    }
  }

  loadStoredCredentials() {
    try {
      const stored = localStorage.getItem('trello_credentials');
      if (stored) {
        const storedCreds = JSON.parse(stored);
        // Usar credenciais fixas se não houver armazenadas
        this.credentials = {
          key: storedCreds.key || '703c970019af6615ddd56ff981e9adf2',
          token: storedCreds.token || 'c062109eefb7d29dcd078b2b81805acb964ce89b8133ad14d0f18793916b85b1',
          boardId: storedCreds.boardId || '9I93KoUZ'
        };
        console.log('TrelloService: Credenciais carregadas');
      }
    } catch (error) {
      console.error('TrelloService: Erro ao carregar credenciais:', error);
    }
  }

  clearCredentials() {
    this.credentials = {
      key: '703c970019af6615ddd56ff981e9adf2',
      token: 'c062109eefb7d29dcd078b2b81805acb964ce89b8133ad14d0f18793916b85b1',
      boardId: '9I93KoUZ'
    };
    localStorage.removeItem('trello_credentials');
    console.log('TrelloService: Credenciais resetadas para padrão');
  }

  isConnected() {
    return !!(this.credentials.key && this.credentials.token && this.credentials.boardId);
  }

  getBoardUrl() {
    return `https://trello.com/b/${this.credentials.boardId}`;
  }
}

const trelloServiceInstance = new TrelloService();
trelloServiceInstance.loadStoredCredentials();

export const trelloService = trelloServiceInstance;
export type { TrelloCard, TrelloList, TrelloMember, CreateCardData };
