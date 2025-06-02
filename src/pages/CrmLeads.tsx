import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, UserPlus, Trash2, GripVertical } from 'lucide-react';
import { apiService } from '@/services/api';
import { Lead } from '@/types/database';

const leadSources = [
  'Website',
  'Google Ads',
  'Facebook Ads',
  'Instagram',
  'LinkedIn',
  'Indicação',
  'WhatsApp',
  'Outros'
];

const statusColumns = [
  { id: 'new', title: 'Novo', color: 'bg-blue-500', bgCard: 'bg-blue-500/10 border-blue-500/30' },
  { id: 'contacted', title: 'Contato Iniciado', color: 'bg-yellow-500', bgCard: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'qualified', title: 'Em Negociação', color: 'bg-orange-500', bgCard: 'bg-orange-500/10 border-orange-500/30' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-purple-500', bgCard: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'won', title: 'Ganhou', color: 'bg-green-500', bgCard: 'bg-green-500/10 border-green-500/30' },
  { id: 'lost', title: 'Perdido', color: 'bg-red-500', bgCard: 'bg-red-500/10 border-red-500/30' }
];

export default function CrmLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    notes: '',
    score: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await apiService.getLeads();
      setLeads(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar leads",
        description: "Não foi possível carregar os leads",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await apiService.updateLead(editingLead.id, formData);
        toast({
          title: "Lead atualizado!",
          description: "Lead foi atualizado com sucesso"
        });
      } else {
        await apiService.createLead({
          ...formData,
          status: 'new'
        });
        toast({
          title: "Lead criado!",
          description: "Novo lead foi adicionado com sucesso"
        });
      }
      
      setIsModalOpen(false);
      setEditingLead(null);
      setFormData({ name: '', email: '', phone: '', company: '', source: '', notes: '', score: 0 });
      loadLeads();
    } catch (error) {
      toast({
        title: "Erro ao salvar lead",
        description: "Não foi possível salvar o lead",
        type: "error"
      });
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      source: lead.source,
      notes: lead.notes || '',
      score: lead.score || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteLead(id);
      toast({
        title: "Lead excluído!",
        description: "Lead foi removido com sucesso"
      });
      loadLeads();
    } catch (error) {
      toast({
        title: "Erro ao excluir lead",
        description: "Não foi possível excluir o lead",
        type: "error"
      });
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      await apiService.updateLead(leadId, { status: newStatus as Lead['status'] });
      toast({
        title: "Status atualizado!",
        description: "Status do lead foi atualizado"
      });
      loadLeads();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status",
        type: "error"
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status !== newStatus) {
      handleStatusChange(draggedLead.id, newStatus);
    }
    setDraggedLead(null);
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-400/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">CRM de Leads</h1>
            <p className="text-gray-400">Gerencie seus leads em um quadro Kanban</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingLead ? 'Editar Lead' : 'Novo Lead'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-300">Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source" className="text-gray-300">Fonte *</Label>
                    <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                      <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                        <SelectValue placeholder="Selecione a fonte" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-300 border-dark-400">
                        {leadSources.map(source => (
                          <SelectItem key={source} value={source} className="text-white">
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="score" className="text-gray-300">Score (0-100)</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.score}
                      onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                      className="bg-dark-300 border-dark-400 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-300">Notas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-dark-300 border-dark-400 text-white"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {editingLead ? 'Atualizar' : 'Criar'} Lead
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setEditingLead(null);
                    setFormData({ name: '', email: '', phone: '', company: '', source: '', notes: '', score: 0 });
                  }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {statusColumns.map(column => (
            <Card key={column.id} className={`${column.bgCard} border`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {getLeadsByStatus(column.id).length}
                </div>
                <p className="text-sm text-gray-300">{column.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400">Carregando leads...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {statusColumns.map(column => (
              <div 
                key={column.id} 
                className="space-y-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center gap-2 p-3 rounded-lg bg-dark-200 border border-dark-300">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                  <span className="text-sm text-gray-400 ml-auto">
                    ({getLeadsByStatus(column.id).length})
                  </span>
                </div>
                
                <div className="space-y-3 min-h-[600px]">
                  {getLeadsByStatus(column.id).map(lead => (
                    <Card 
                      key={lead.id} 
                      className={`${column.bgCard} border cursor-move hover:shadow-lg transition-shadow duration-200`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-white truncate">{lead.name}</h4>
                              <p className="text-sm text-gray-400 truncate">{lead.email}</p>
                              {lead.company && (
                                <p className="text-xs text-gray-500 truncate">{lead.company}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreColor(lead.score || 0)}`}>
                                {lead.score || 0}
                              </span>
                              <GripVertical className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-300 space-y-1">
                            <p><strong>Fonte:</strong> {lead.source}</p>
                            {lead.phone && <p><strong>Tel:</strong> {lead.phone}</p>}
                          </div>
                          
                          {lead.notes && (
                            <p className="text-sm text-gray-400 line-clamp-2 bg-dark-300/50 p-2 rounded">
                              {lead.notes}
                            </p>
                          )}
                          
                          <div className="flex gap-1 pt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                              onClick={() => handleEdit(lead)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            {column.id !== 'won' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                onClick={() => handleStatusChange(lead.id, 'won')}
                                title="Marcar como ganho"
                              >
                                <UserPlus className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              onClick={() => handleDelete(lead.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
