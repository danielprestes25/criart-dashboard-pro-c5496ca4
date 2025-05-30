
import React, { useState } from 'react';
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

const Orcamentos = () => {
  const [propostas, setPropostas] = useState([
    {
      id: 1,
      cliente: 'Tech Solutions',
      valorProposto: 5800,
      status: 'Aceito',
      dataEnvio: '2024-01-12',
      descricao: 'Desenvolvimento de site corporativo',
      validade: '2024-02-12'
    },
    {
      id: 2,
      cliente: 'Marketing Digital Pro',
      valorProposto: 3200,
      status: 'Enviado',
      dataEnvio: '2024-01-18',
      descricao: 'Campanha de mídia social',
      validade: '2024-02-18'
    },
    {
      id: 3,
      cliente: 'Startup Innovation',
      valorProposto: 2100,
      status: 'Recusado',
      dataEnvio: '2024-01-08',
      descricao: 'Identidade visual completa',
      validade: '2024-02-08'
    },
    {
      id: 4,
      cliente: 'E-commerce Plus',
      valorProposto: 4500,
      status: 'Enviado',
      dataEnvio: '2024-01-20',
      descricao: 'Plataforma de vendas online',
      validade: '2024-02-20'
    },
    {
      id: 5,
      cliente: 'Consultoria Beta',
      valorProposto: 6800,
      status: 'Aceito',
      dataEnvio: '2024-01-15',
      descricao: 'Sistema de gestão interno',
      validade: '2024-02-15'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProposta, setEditingProposta] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });
  const [formData, setFormData] = useState({
    cliente: '',
    valorProposto: '',
    descricao: '',
    validade: '',
    status: 'Enviado'
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      cliente: '',
      valorProposto: '',
      descricao: '',
      validade: '',
      status: 'Enviado'
    });
    setEditingProposta(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.valorProposto || !formData.descricao || !formData.validade) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        type: 'error'
      });
      return;
    }

    if (editingProposta) {
      setPropostas(prev => prev.map(proposta => 
        proposta.id === editingProposta.id 
          ? {
              ...proposta,
              cliente: formData.cliente,
              valorProposto: parseFloat(formData.valorProposto),
              descricao: formData.descricao,
              validade: formData.validade,
              status: formData.status
            }
          : proposta
      ));
      toast({
        title: 'Sucesso',
        description: 'Orçamento atualizado com sucesso',
        type: 'success'
      });
    } else {
      const newProposta = {
        id: Math.max(...propostas.map(p => p.id)) + 1,
        cliente: formData.cliente,
        valorProposto: parseFloat(formData.valorProposto),
        status: formData.status,
        dataEnvio: new Date().toISOString().split('T')[0],
        descricao: formData.descricao,
        validade: formData.validade
      };
      setPropostas(prev => [...prev, newProposta]);
      toast({
        title: 'Sucesso',
        description: 'Orçamento criado com sucesso',
        type: 'success'
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (proposta: any) => {
    setEditingProposta(proposta);
    setFormData({
      cliente: proposta.cliente,
      valorProposto: proposta.valorProposto.toString(),
      descricao: proposta.descricao,
      validade: proposta.validade,
      status: proposta.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.id) {
      setPropostas(prev => prev.filter(proposta => proposta.id !== deleteConfirm.id));
      toast({
        title: 'Sucesso',
        description: 'Orçamento excluído com sucesso',
        type: 'success'
      });
    }
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const generatePDF = (proposta: any) => {
    // Simulação de geração de PDF
    toast({
      title: 'PDF Gerado',
      description: `PDF do orçamento para ${proposta.cliente} foi gerado com sucesso`,
      type: 'success'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aceito':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aceito
          </Badge>
        );
      case 'Enviado':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Send className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        );
      case 'Recusado':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <X className="w-3 h-3 mr-1" />
            Recusado
          </Badge>
        );
      default:
        return null;
    }
  };

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
                      value={formData.cliente}
                      onChange={(e) => setFormData({...formData, cliente: e.target.value})}
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
                      value={formData.valorProposto}
                      onChange={(e) => setFormData({...formData, valorProposto: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Descrição do Serviço *</label>
                  <textarea
                    rows={4}
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descreva detalhadamente o serviço a ser prestado..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Validade da Proposta *</label>
                    <input
                      type="date"
                      value={formData.validade}
                      onChange={(e) => setFormData({...formData, validade: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Enviado">Enviado</option>
                      <option value="Aceito">Aceito</option>
                      <option value="Recusado">Recusado</option>
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
              <div className="text-2xl font-bold text-white">R$ {propostas.reduce((sum, p) => sum + p.valorProposto, 0).toLocaleString()}</div>
              <p className="text-gray-400 text-sm">Valor Total Propostas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{propostas.filter(p => p.status === 'Aceito').length}</div>
              <p className="text-gray-400 text-sm">Aceitas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">{propostas.filter(p => p.status === 'Enviado').length}</div>
              <p className="text-gray-400 text-sm">Enviadas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-400">{propostas.filter(p => p.status === 'Recusado').length}</div>
              <p className="text-gray-400 text-sm">Recusadas</p>
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
                  <TableHead className="text-gray-300">Data de Envio</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propostas.map((proposta) => (
                  <TableRow key={proposta.id} className="border-dark-300 hover:bg-dark-300/50">
                    <TableCell className="text-white font-medium">{proposta.cliente}</TableCell>
                    <TableCell className="text-white">R$ {proposta.valorProposto.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(proposta.status)}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(proposta.dataEnvio).toLocaleDateString('pt-BR')}
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
