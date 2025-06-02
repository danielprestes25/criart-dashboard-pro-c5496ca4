
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, CheckCircle, X, FileText, Edit, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { generatePropostaPDF } from '@/utils/pdfGenerator';
import { apiService } from '@/services/api';
import { Budget } from '@/types/database';

const Orcamentos = () => {
  const [propostas, setPropostas] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProposta, setEditingProposta] = useState<Budget | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });
  const [formData, setFormData] = useState({
    client_name: '',
    amount: '',
    project_description: '',
    valid_until: '',
    status: 'draft' as 'draft' | 'sent' | 'approved' | 'rejected'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    try {
      const data = await apiService.getBudgets();
      setPropostas(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar orçamentos',
        description: 'Não foi possível carregar os orçamentos',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      amount: '',
      project_description: '',
      valid_until: '',
      status: 'draft'
    });
    setEditingProposta(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.amount || !formData.project_description || !formData.valid_until) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        type: 'error'
      });
      return;
    }

    try {
      if (editingProposta) {
        await apiService.updateBudget(editingProposta.id, {
          client_name: formData.client_name,
          amount: parseFloat(formData.amount),
          project_description: formData.project_description,
          valid_until: formData.valid_until,
          status: formData.status
        });
        toast({
          title: 'Sucesso',
          description: 'Orçamento atualizado com sucesso'
        });
      } else {
        await apiService.createBudget({
          client_name: formData.client_name,
          amount: parseFloat(formData.amount),
          project_description: formData.project_description,
          valid_until: formData.valid_until,
          created_date: new Date().toISOString().split('T')[0],
          status: formData.status
        });
        toast({
          title: 'Sucesso',
          description: 'Orçamento criado com sucesso'
        });
      }

      resetForm();
      setIsDialogOpen(false);
      loadPropostas();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o orçamento',
        type: 'error'
      });
    }
  };

  const handleEdit = (proposta: Budget) => {
    setEditingProposta(proposta);
    setFormData({
      client_name: proposta.client_name,
      amount: proposta.amount.toString(),
      project_description: proposta.project_description,
      valid_until: proposta.valid_until,
      status: proposta.status as 'draft' | 'sent' | 'approved' | 'rejected'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.id) {
      try {
        await apiService.deleteBudget(deleteConfirm.id);
        toast({
          title: 'Sucesso',
          description: 'Orçamento excluído com sucesso'
        });
        loadPropostas();
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o orçamento',
          type: 'error'
        });
      }
    }
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const generatePDF = (proposta: Budget) => {
    generatePropostaPDF({
      id: proposta.id,
      cliente: proposta.client_name,
      valorProposto: proposta.amount,
      status: proposta.status,
      dataEnvio: proposta.created_date,
      descricao: proposta.project_description,
      validade: proposta.valid_until
    });
    toast({
      title: 'PDF Gerado',
      description: `PDF do orçamento para ${proposta.client_name} foi gerado com sucesso`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprovado
          </Badge>
        );
      case 'sent':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Send className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <X className="w-3 h-3 mr-1" />
            Rejeitado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Rascunho
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400">Carregando orçamentos...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Orçamentos e Propostas</h1>
            <p className="text-gray-400">Gerencie propostas comerciais e orçamentos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingProposta ? 'Editar Orçamento' : 'Criar Novo Orçamento'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Cliente *</label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Valor Proposto *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Descrição do Projeto *</label>
                  <textarea
                    rows={4}
                    value={formData.project_description}
                    onChange={(e) => setFormData({...formData, project_description: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descreva detalhadamente o projeto..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Validade da Proposta *</label>
                    <input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'sent' | 'approved' | 'rejected'})}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="sent">Enviado</option>
                      <option value="approved">Aprovado</option>
                      <option value="rejected">Rejeitado</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    {editingProposta ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">R$ {propostas.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</div>
              <p className="text-gray-400 text-sm">Valor Total Propostas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{propostas.filter(p => p.status === 'approved').length}</div>
              <p className="text-gray-400 text-sm">Aprovadas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">{propostas.filter(p => p.status === 'sent').length}</div>
              <p className="text-gray-400 text-sm">Enviadas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-400">{propostas.filter(p => p.status === 'rejected').length}</div>
              <p className="text-gray-400 text-sm">Rejeitadas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Propostas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-300">
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">Valor Proposto</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Data de Criação</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propostas.map((proposta) => (
                  <TableRow key={proposta.id} className="border-dark-300 hover:bg-dark-300/50">
                    <TableCell className="text-white font-medium">{proposta.client_name}</TableCell>
                    <TableCell className="text-white">R$ {proposta.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(proposta.status)}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(proposta.created_date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generatePDF(proposta)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(proposta)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(proposta.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Excluir Orçamento"
        description="Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita."
      />
    </DashboardLayout>
  );
};

export default Orcamentos;
