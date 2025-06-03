
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, AlertCircle, ExternalLink } from 'lucide-react';
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
        description: "Trello configurado com sucesso. Atualize a página para ver os dados."
      });
      
      setIsOpen(false);
      // Limpar campos após sucesso
      setKey('');
      setToken('');
      setBoardId('');
    } catch (error) {
      console.error('Erro ao configurar Trello:', error);
      toast({
        title: "Erro na configuração",
        description: error instanceof Error ? error.message : "Não foi possível configurar o Trello",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfig = () => {
    trelloService.clearCredentials();
    toast({
      title: "Configuração removida",
      description: "Credenciais do Trello foram removidas. Atualize a página."
    });
    setIsOpen(false);
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
      
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Integração com Trello</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-200 font-medium mb-2">Instruções importantes:</p>
                <ul className="text-blue-100 space-y-1 list-disc list-inside">
                  <li><strong>Board ID:</strong> Use APENAS o ID, não inclua o nome do board</li>
                  <li>Exemplo correto: <code className="bg-gray-700 px-1 rounded">9I93KoUZ</code></li>
                  <li>Exemplo incorreto: <code className="bg-red-900/50 px-1 rounded">9I93KoUZ/produção-criart</code></li>
                </ul>
              </div>
            </div>
          </div>

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
              placeholder="Ex: 9I93KoUZ (apenas o ID, sem texto extra)"
              className="bg-gray-700 border-gray-600"
            />
            <p className="text-xs text-gray-400">
              ⚠️ Use apenas o ID do board (24+ caracteres), não inclua o nome
            </p>
          </div>
          
          <div className="text-sm text-gray-400 space-y-3">
            <p className="font-medium">Para obter suas credenciais:</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">1. API Key:</span>
                <a 
                  href="https://trello.com/app-key" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  trello.com/app-key
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <div>
                <span className="font-medium">2. Token:</span>
                <span className="ml-2">Clique em "Token" na página da API Key</span>
              </div>
              
              <div>
                <span className="font-medium">3. Board ID:</span>
                <div className="ml-4 mt-1 space-y-1">
                  <p>• Acesse seu quadro no Trello</p>
                  <p>• Olhe a URL: <code className="bg-gray-700 px-1 rounded text-xs">trello.com/b/9I93KoUZ/nome-board</code></p>
                  <p>• Copie apenas a parte após <code className="bg-gray-700 px-1 rounded text-xs">/b/</code> e antes da próxima <code className="bg-gray-700 px-1 rounded text-xs">/</code></p>
                  <p>• No exemplo acima, seria: <code className="bg-green-900/50 px-1 rounded text-xs">9I93KoUZ</code></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClearConfig}
              className="border-red-600 text-red-300 hover:bg-red-700/20"
            >
              Limpar Configuração
            </Button>
            
            <div className="flex gap-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
