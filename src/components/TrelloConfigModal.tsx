
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trelloService } from '@/services/trelloService';

export function TrelloConfigModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState('');
  const [token, setToken] = useState('');
  const [boardId, setBoardId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!key || !token || !boardId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para configurar o Trello",
        type: "error"
      });
      return;
    }

    try {
      setIsLoading(true);
      await trelloService.connectToTrello(key, token, boardId);
      
      toast({
        title: "Configuração salva!",
        description: "Trello configurado com sucesso"
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao configurar Trello:', error);
      toast({
        title: "Erro na configuração",
        description: "Não foi possível configurar o Trello",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Settings className="h-4 w-4 mr-2" />
          Configurar Trello
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Configurar Integração com Trello</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trello-key">API Key</Label>
            <Input
              id="trello-key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Sua API Key do Trello"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trello-token">Token</Label>
            <Input
              id="trello-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Seu Token do Trello"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="board-id">Board ID</Label>
            <Input
              id="board-id"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              placeholder="ID do seu quadro no Trello"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          
          <div className="text-sm text-gray-400">
            <p>Para obter suas credenciais:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>API Key: <a href="https://trello.com/app-key" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">trello.com/app-key</a></li>
              <li>Token: Clique em "Token" na página da API Key</li>
              <li>Board ID: Copie da URL do seu quadro (após /b/)</li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
