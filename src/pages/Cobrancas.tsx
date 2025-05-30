
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
import { Plus, CheckCircle, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

const Cobrancas = () => {
  const [receitas, setReceitas] = useState([
    {
      id: 1,
      cliente: 'Empresa ABC Ltda',
      valor: 2800,
      status: 'Pago',
      data: '2024-01-15',
      linkPagamento: 'https://mercadopago.com/abc123'
    },
    {
      id: 2,
      cliente: 'Startup XYZ',
      valor: 1500,
      status: 'Pendente',
      data: '2024-01-20',
      linkPagamento: 'https://mercadopago.com/xyz456'
    },
    {
      id: 3,
      cliente: 'Loja Virtual 123',
      valor: 3200,
      status: 'Vencido',
      data: '2024-01-10',
      linkPagamento: 'https://mercadopago.com/lv789'
    },
    {
      id: 4,
      cliente: 'Consultoria Beta',
      valor: 2100,
      status: 'Pago',
      data: '2024-01-18',
      linkPagamento: 'https://mercadopago.com/cb101'
    },
    {
      id: 5,
      cliente: 'E-commerce Gama',
      valor: 4500,
      status: 'Pendente',
      data: '2024-01-25',
      linkPagamento: 'https://mercadopago.com/eg112'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReceita, setEditingReceita] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });
  const [formData, setFormData] = useState({
    cliente: '',
    valor: '',
    dataVencimento: '',
    linkPagamento: '',
    status: 'Pendente'
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      cliente: '',
      valor: '',
      dataVencimento: '',
      linkPagamento: '',
      status: 'Pendente'
    });
    setEditingReceita(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.valor || !formData.dataVencimento) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        type: 'error'
      });
      return;
    }

    if (editingReceita) {
      setReceitas(prev => prev.map(receita => 
        receita.id === editingReceita.id 
          ? {
              ...receita,
              cliente: formData.cliente,
              valor: parseFloat(formData.valor),
              data: formData.dataVencimento,
              linkPagamento: formData.linkPagamento,
              status: formData.status
            }
          : receita
      ));
      toast({
        title: 'Sucesso',
        description: 'Cobrança atualizada com sucesso',
        type: 'success'
      });
    } else {
      const newReceita = {
        id: Math.max(...receitas.map(r => r.id)) + 1,
        cliente: formData.cliente,
        valor: parseFloat(formData.valor),
        status: formData.status,
        data: formData.dataVencimento,
        linkPagamento: formData.linkPagamento
      };
      setReceitas(prev => [...prev, newReceita]);
      toast({
        title: 'Sucesso',
        description: 'Cobrança criada com sucesso',
        type: 'success'
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (receita: any) => {
    setEditingReceita(receita);
    setFormData({
      cliente: receita.cliente,
      valor: receita.valor.toString(),
      dataVencimento: receita.data,
      linkPagamento: receita.linkPagamento,
      status: receita.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.id) {
      setReceitas(prev => prev.filter(receita => receita.id !== deleteConfirm.id));
      toast({
        title: 'Sucesso',
        description: 'Cobrança excluída com sucesso',
        type: 'success'
      });
    }
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pago
          </Badge>
        );
      case 'Pendente':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'Vencido':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Vencido
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
            <h1 className="text-3xl font-bold text-white mb-2">Receitas e Cobranças</h1>
            <p className="text-gray-400">Gerencie as receitas e cobranças de clientes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nova Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingReceita ? 'Editar Cobrança' : 'Nova Cobrança'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome do Cliente *</label>
                  <input
                    type="text"
                    value={formData.cliente}
                    onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Digite o nome do cliente"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Valor da Cobrança *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Data de Vencimento *</label>
                  <input
                    type="date"
                    value={formData.dataVencimento}
                    onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Link de Pagamento</label>
                  <input
                    type="url"
                    value={formData.linkPagamento}
                    onChange={(e) => setFormData({...formData, linkPagamento: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://mercadopago.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {editingReceita ? 'Atualizar Cobrança' : 'Criar Cobrança'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">R$ {receitas.reduce((sum, r) => sum + r.valor, 0).toLocaleString()}</div>
              <p className="text-gray-400 text-sm">Total de Receitas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{receitas.filter(r => r.status === 'Pago').length}</div>
              <p className="text-gray-400 text-sm">Pagas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">{receitas.filter(r => r.status === 'Pendente').length}</div>
              <p className="text-gray-400 text-sm">Pendentes</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-400">{receitas.filter(r => r.status === 'Vencido').length}</div>
              <p className="text-gray-400 text-sm">Vencidas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-300">
                  <TableHead className="text-gray-300">Nome do Cliente</TableHead>
                  <TableHead className="text-gray-300">Valor da Cobrança</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Data</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receitas.map((receita) => (
                  <TableRow key={receita.id} className="border-dark-300 hover:bg-dark-300/50">
                    <TableCell className="text-white font-medium">{receita.cliente}</TableCell>
                    <TableCell className="text-white">R$ {receita.valor.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(receita.status)}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(receita.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(receita)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(receita.id)}
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
        title="Excluir Cobrança"
        description="Tem certeza que deseja excluir esta cobrança? Esta ação não pode ser desfeita."
      />
    </DashboardLayout>
  );
};

export default Cobrancas;
