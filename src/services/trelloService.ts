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
    return new URLSearchParams({
      key: this.credentials.key || '',
      token: this.credentials.token || ''
    });
  }

  async getTrelloCards(): Promise<TrelloCard[]> {
    try {
      console.log('TrelloService: Buscando cards do Trello...');
      
      if (!this.credentials.key || !this.credentials.token || !this.credentials.boardId) {
        throw new Error('Credenciais do Trello não configuradas');
      }

      console.log('TrelloService: Usando credenciais atualizadas');
      const params = this.getAuthParams();
      params.append('actions', 'all');
      params.append('checklists', 'all');
      params.append('members', 'true');

      const response = await fetch(
        `${this.baseUrl}/boards/${this.credentials.boardId}/cards?${params.toString()}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        throw new Error(`Erro na API do Trello: ${response.status} - ${errorText}`);
      }
      
      const cards = await response.json();
      console.log('TrelloService: Cards carregados da API:', cards);
      return cards;
    } catch (error) {
      console.error('Erro ao buscar cards do Trello:', error);
      throw error;
    }
  }

  async getTrelloLists(): Promise<TrelloList[]> {
    try {
      console.log('TrelloService: Buscando listas do Trello...');
      
      if (!this.credentials.key || !this.credentials.token || !this.credentials.boardId) {
        throw new Error('Credenciais do Trello não configuradas');
      }

      const params = this.getAuthParams();
      const response = await fetch(
        `${this.baseUrl}/boards/${this.credentials.boardId}/lists?${params.toString()}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        throw new Error(`Erro na API do Trello: ${response.status} - ${errorText}`);
      }
      
      const lists = await response.json();
      console.log('TrelloService: Listas carregadas da API:', lists);
      return lists;
    } catch (error) {
      console.error('Erro ao buscar listas do Trello:', error);
      throw error;
    }
  }

  async getBoardMembers(): Promise<TrelloMember[]> {
    try {
      if (!this.credentials.key || !this.credentials.token || !this.credentials.boardId) {
        throw new Error('Credenciais do Trello não configuradas');
      }

      const params = this.getAuthParams();
      const response = await fetch(
        `${this.baseUrl}/boards/${this.credentials.boardId}/members?${params.toString()}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar membros: ${response.status} - ${errorText}`);
      }
      
      const members = await response.json();
      console.log('TrelloService: Membros carregados:', members);
      return members;
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

      const params = this.getAuthParams();
      params.append('name', cardData.name);
      params.append('idList', cardData.idList);
      
      if (cardData.desc) {
        params.append('desc', cardData.desc);
      }
      
      if (cardData.due) {
        params.append('due', cardData.due);
      }
      
      if (cardData.idMembers && cardData.idMembers.length > 0) {
        params.append('idMembers', cardData.idMembers.join(','));
      }
      
      if (cardData.pos !== undefined) {
        params.append('pos', cardData.pos.toString());
      }

      const response = await fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao criar card: ${response.status} - ${errorText}`);
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

      const params = this.getAuthParams();
      
      if (updates.name) {
        params.append('name', updates.name);
      }
      
      if (updates.desc !== undefined) {
        params.append('desc', updates.desc);
      }
      
      if (updates.idList) {
        params.append('idList', updates.idList);
      }
      
      if (updates.due !== undefined) {
        params.append('due', updates.due || '');
      }
      
      if (updates.idMembers) {
        params.append('idMembers', updates.idMembers.join(','));
      }
      
      if (updates.pos !== undefined) {
        params.append('pos', updates.pos.toString());
      }

      const response = await fetch(`${this.baseUrl}/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao atualizar card: ${response.status} - ${errorText}`);
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

      const params = this.getAuthParams();
      const response = await fetch(
        `${this.baseUrl}/cards/${cardId}?${params.toString()}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao deletar card: ${response.status} - ${errorText}`);
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

      const params = this.getAuthParams();
      params.append('limit', '50');

      const response = await fetch(
        `${this.baseUrl}/cards/${cardId}/actions?${params.toString()}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar ações do card: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar ações do card:', error);
      throw error;
    }
  }

  async connectToTrello(key: string, token: string, boardId: string) {
    try {
      console.log('TrelloService: Testando conexão com Trello...');
      
      const cleanBoardId = boardId.split('/')[0].trim();
      
      if (!/^[a-zA-Z0-9]{8,}$/.test(cleanBoardId)) {
        throw new Error('Board ID deve conter apenas letras e números (8+ caracteres)');
      }
      
      const testParams = new URLSearchParams({
        key,
        token
      });
      
      const testResponse = await fetch(
        `${this.baseUrl}/boards/${cleanBoardId}?${testParams.toString()}`
      );
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        throw new Error(`Credenciais inválidas ou board não encontrado: ${testResponse.status} - ${errorText}`);
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
        this.credentials = { ...this.credentials, ...storedCreds };
        console.log('TrelloService: Credenciais carregadas do localStorage');
      } else {
        console.log('TrelloService: Usando credenciais atualizadas');
        // Salvar as credenciais atualizadas no localStorage
        localStorage.setItem('trello_credentials', JSON.stringify(this.credentials));
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
    console.log('TrelloService: Credenciais resetadas para as novas');
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
