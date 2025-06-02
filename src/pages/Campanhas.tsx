import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Play, Pause, BarChart3 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { apiService } from '@/services/api';
import { Campaign } from '@/types/database';

const platforms = [
  'Google Ads',
  'Facebook Ads',
  'Instagram Ads',
  'LinkedIn Ads',
  'TikTok Ads',
  'YouTube Ads',
  'Twitter Ads',
  'Outros'
];

const objectives = [
  'Awareness - Reconhecimento da marca',
  'Traffic - Tráfego para o site',
  'Engagement - Engajamento',
  'Lead Generation - Geração de leads',
  'Sales - Vendas',
  'App Install - Instalação de app',
  'Video Views - Visualizações de vídeo'
];

const Campanhas = () => {
  const [campanhas, setCampanhas] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampanha, setEditingCampanha] = useState<Campaign | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    budget: '',
    start_date: '',
    end_date: '',
    target_audience: '',
    objective: '',
    status: 'active' as 'active' | 'paused' | 'completed'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCampanhas();
  }, []);

  const loadCampanhas = async () => {
    try {
      const data = await apiService.getCampaigns();
      setCampanhas(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar campanhas',
        description: 'Não foi possível carregar as campanhas',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      budget: '',
      start_date: '',
      end_date: '',
      target_audience: '',
      objective: '',
      status: 'active'
    });
    setEditingCampanha(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.platform || !formData.budget || !formData.start_date || !formData.end_date) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        type: 'error'
      });
      return;
    }

    try {
      if (editingCampanha) {
        await apiService.updateCampaign(editingCampanha.id, {
          name: formData.name,
          platform: formData.platform,
          budget: parseFloat(formData.budget),
          start_date: formData.start_date,
          end_date: formData.end_date,
          target_audience: formData.target_audience,
          objective: formData.objective,
          status: formData.status
        });
        toast({
          title: 'Sucesso',
          description: 'Campanha atualizada com sucesso'
        });
      } else {
        await apiService.createCampaign({
          name: formData.name,
          platform: formData.platform,
          budget: parseFloat(formData.budget),
          start_date: formData.start_date,
          end_date: formData.end_date,
          target_audience: formData.target_audience,
          objective: formData.objective,
          status: formData.status
        });
        toast({
          title: 'Sucesso',
          description: 'Campanha criada com sucesso'
        });
      }

      resetForm();
      setIsDialogOpen(false);
      loadCampanhas();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a campanha',
        type: 'error'
      });
    }
  };

  const handleEdit = (campanha: Campaign) => {
    setEditingCampanha(campanha);
    setFormData({
      name: campanha.name,
      platform: campanha.platform,
      budget: campanha.budget.toString(),
      start_date: campanha.start_date,
      end_date: campanha.end_date,
      target_audience: campanha.target_audience || '',
      objective: campanha.objective || '',
      status: campanha.status as 'active' | 'paused' | 'completed'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.id) {
      try {
        await apiService.deleteCampaign(deleteConfirm.id);
        toast({
          title: 'Sucesso',
          description: 'Campanha excluída com sucesso'
        });
        loadCampanhas();
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a campanha',
          type: 'error'
        });
      }
    }
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const toggleCampaignStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await apiService.updateCampaign(id, { status: newStatus });
      toast({
        title: 'Status atualizado',
        description: `Campanha ${newStatus === 'active' ? 'ativada' : 'pausada'} com sucesso`
      });
      loadCampanhas();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da campanha',
        type: 'error'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Play className="w-3 h-3 mr-1" />
            Ativa
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Pause className="w-3 h-3 mr-1" />
            Pausada
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <BarChart3 className="w-3 h-3 mr-1" />
            Finalizada
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTotalBudget = () => {
    return campanhas.reduce((sum, c) => sum + c.budget, 0);
  };

  const getActiveCampaigns = () => {
    return campanhas.filter(c => c.status === 'active').length;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400">Carregando campanhas...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Campanhas de Marketing</h1>
            <p className="text-gray-400">Gerencie suas campanhas publicitárias</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCampanha ? 'Editar Campanha' : 'Criar Nova Campanha'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Nome da Campanha *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-dark-300 border-dark-400 text-white"
                      placeholder="Nome da campanha"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Plataforma *</Label>
                    <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                      <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                        <SelectValue placeholder="Selecione a plataforma" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-300 border-dark-400">
                        {platforms.map(platform => (
                          <SelectItem key={platform} value={platform} className="text-white">
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Orçamento *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="bg-dark-300 border-dark-400 text-white"
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Data de Início *</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300">Data de Fim *</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Objetivo</Label>
                  <Select value={formData.objective} onValueChange={(value) => setFormData({...formData, objective: value})}>
                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-300 border-dark-400">
                      {objectives.map(objective => (
                        <SelectItem key={objective} value={objective} className="text-white">
                          {objective}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Público-Alvo</Label>
                  <Textarea
                    value={formData.target_audience}
                    onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                    className="bg-dark-300 border-dark-400 text-white"
                    placeholder="Descreva o público-alvo da campanha..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'paused' | 'completed'})}>
                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-300 border-dark-400">
                      <SelectItem value="active" className="text-white">Ativa</SelectItem>
                      <SelectItem value="paused" className="text-white">Pausada</SelectItem>
                      <SelectItem value="completed" className="text-white">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    {editingCampanha ? 'Atualizar Campanha' : 'Criar Campanha'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">R$ {getTotalBudget().toLocaleString()}</div>
              <p className="text-gray-400 text-sm">Orçamento Total</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{getActiveCampaigns()}</div>
              <p className="text-gray-400 text-sm">Campanhas Ativas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">{campanhas.filter(c => c.status === 'paused').length}</div>
              <p className="text-gray-400 text-sm">Pausadas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">{campanhas.filter(c => c.status === 'completed').length}</div>
              <p className="text-gray-400 text-sm">Finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campanhas.map((campanha) => (
            <Card key={campanha.id} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{campanha.name}</CardTitle>
                  {getStatusBadge(campanha.status)}
                </div>
                <p className="text-gray-400 text-sm">{campanha.platform}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Orçamento:</span>
                    <span className="text-white font-medium">R$ {campanha.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Período:</span>
                    <span className="text-white text-sm">
                      {new Date(campanha.start_date).toLocaleDateString('pt-BR')} - {new Date(campanha.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {campanha.objective && (
                    <div className="text-sm text-gray-400">
                      <strong>Objetivo:</strong> {campanha.objective}
                    </div>
                  )}
                  {campanha.target_audience && (
                    <div className="text-sm text-gray-400">
                      <strong>Público:</strong> {campanha.target_audience}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(campanha)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {campanha.status !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCampaignStatus(campanha.id, campanha.status)}
                      className={campanha.status === 'active' ? "text-yellow-400 hover:text-yellow-300" : "text-green-400 hover:text-green-300"}
                    >
                      {campanha.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(campanha.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Excluir Campanha"
        description="Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita."
      />
    </DashboardLayout>
  );
};

export default Campanhas;
