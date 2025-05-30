
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
import { Plus, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

const Clientes = () => {
  const [funcionarios, setFuncionarios] = useState([
    {
      id: 1,
      nome: 'João Silva',
      cargo: 'Desenvolvedor Frontend',
      salario: 3500,
      dataPagamento: '2024-01-05',
      status: 'Pago'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      cargo: 'Designer UX/UI',
      salario: 2800,
      dataPagamento: '2024-01-05',
      status: 'Pendente'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      cargo: 'Social Media',
      salario: 2200,
      dataPagamento: '2024-01-05',
      status: 'Pago'
    },
    {
      id: 4,
      nome: 'Ana Rodrigues',
      cargo: 'Gerente de Projetos',
      salario: 4200,
      dataPagamento: '2024-01-05',
      status: 'Pendente'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    salario: '',
    dataPagamento: '',
    status: 'Pendente'
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: '',
      salario: '',
      dataPagamento: '',
      status: 'Pendente'
    });
    setEditingFuncionario(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.cargo || !formData.salario || !formData.dataPagamento) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        type: 'error'
      });
      return;
    }

    if (editingFuncionario) {
      setFuncionarios(prev => prev.map(funcionario => 
        funcionario.id === editingFuncionario.id 
          ? {
              ...funcionario,
              nome: formData.nome,
              cargo: formData.cargo,
              salario: parseFloat(formData.salario),
              dataPagamento: formData.dataPagamento,
              status: formData.status
            }
          : funcionario
      ));
      toast({
        title: 'Sucesso',
        description: 'Funcionário atualizado com sucesso',
        type: 'success'
      });
    } else {
      const newFuncionario = {
        id: Math.max(...funcionarios.map(f => f.id)) + 1,
        nome: formData.nome,
        cargo: formData.cargo,
        salario: parseFloat(formData.salario),
        dataPagamento: formData.dataPagamento,
        status: formData.status
      };
      setFuncionarios(prev => [...prev, newFuncionario]);
      toast({
        title: 'Sucesso',
        description: 'Funcionário adicionado com sucesso',
        type: 'success'
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (funcionario: any) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      salario: funcionario.salario.toString(),
      dataPagamento: funcionario.dataPagamento,
      status: funcionario.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.id) {
      setFuncionarios(prev => prev.filter(funcionario => funcionario.id !== deleteConfirm.id));
      toast({
        title: 'Sucesso',
        description: 'Funcionário excluído com sucesso',
        type: 'success'
      });
    }
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const getStatusBadge = (status: string) => {
    return status === 'Pago' ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle className="w-3 h-3 mr-1" />
        Pago
      </Badge>
    ) : (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pagamentos de Funcionários</h1>
            <p className="text-gray-400">Gerencie os pagamentos da equipe</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Pagamento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingFuncionario ? 'Editar Pagamento' : 'Novo Pagamento de Funcionário'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome do Funcionário *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Cargo *</label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Desenvolvedor, Designer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Valor do Salário *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salario}
                    onChange={(e) => setFormData({...formData, salario: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Data de Pagamento *</label>
                  <input
                    type="date"
                    value={formData.dataPagamento}
                    onChange={(e) => setFormData({...formData, dataPagamento: e.target.value})}
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
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {editingFuncionario ? 'Atualizar Pagamento' : 'Salvar Pagamento'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-300">
                  <TableHead className="text-gray-300">Nome do Funcionário</TableHead>
                  <TableHead className="text-gray-300">Cargo</TableHead>
                  <TableHead className="text-gray-300">Salário</TableHead>
                  <TableHead className="text-gray-300">Data do Pagamento</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionarios.map((funcionario) => (
                  <TableRow key={funcionario.id} className="border-dark-300 hover:bg-dark-300/50">
                    <TableCell className="text-white font-medium">{funcionario.nome}</TableCell>
                    <TableCell className="text-gray-300">{funcionario.cargo}</TableCell>
                    <TableCell className="text-white">R$ {funcionario.salario.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(funcionario.dataPagamento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{getStatusBadge(funcionario.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(funcionario)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(funcionario.id)}
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
        title="Excluir Funcionário"
        description="Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita."
      />
    </DashboardLayout>
  );
};

export default Clientes;
