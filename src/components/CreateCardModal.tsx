
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trelloService, TrelloList, TrelloMember } from '@/services/trelloService';

interface CreateCardModalProps {
  onCardCreated: () => void;
}

export function CreateCardModal({ onCardCreated }: CreateCardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lists, setLists] = useState<TrelloList[]>([]);
  const [members, setMembers] = useState<TrelloMember[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    idList: '',
    due: '',
    idMembers: [] as string[]
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [listsData, membersData] = await Promise.all([
        trelloService.getTrelloLists(),
        trelloService.getBoardMembers()
      ]);
      setLists(listsData);
      setMembers(membersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar listas e membros",
        type: "error"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.idList) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e lista são obrigatórios",
        type: "error"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      await trelloService.createCard({
        name: formData.name,
        desc: formData.desc,
        idList: formData.idList,
        due: formData.due || undefined,
        idMembers: formData.idMembers.length > 0 ? formData.idMembers : undefined,
        pos: 'top'
      });

      toast({
        title: "Card criado!",
        description: "Card adicionado ao Trello com sucesso"
      });

      setFormData({
        name: '',
        desc: '',
        idList: '',
        due: '',
        idMembers: []
      });
      
      setIsOpen(false);
      onCardCreated();
    } catch (error) {
      console.error('Erro ao criar card:', error);
      toast({
        title: "Erro ao criar card",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Card
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Card</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-name">Nome do Card *</Label>
            <Input
              id="card-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Post Instagram Cliente ABC"
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-desc">Descrição</Label>
            <Textarea
              id="card-desc"
              value={formData.desc}
              onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
              placeholder="Descrição detalhada do projeto..."
              className="bg-gray-700 border-gray-600 min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-list">Lista *</Label>
            <Select 
              value={formData.idList} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, idList: value }))}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Selecione uma lista" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {lists.map(list => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-due">Data de Entrega</Label>
            <div className="relative">
              <Input
                id="card-due"
                type="datetime-local"
                value={formData.due}
                onChange={(e) => setFormData(prev => ({ ...prev, due: e.target.value }))}
                className="bg-gray-700 border-gray-600"
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {members.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="card-member">Responsável</Label>
              <Select 
                value={formData.idMembers[0] || ''} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  idMembers: value ? [value] : [] 
                }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Criando...' : 'Criar Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
