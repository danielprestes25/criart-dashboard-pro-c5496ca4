
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
import { Plus, CheckCircle, Clock } from 'lucide-react';

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Pagamento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">Novo Pagamento de Funcionário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome do Funcionário</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Digite o nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Cargo</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Desenvolvedor, Designer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Valor do Salário</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Data de Pagamento</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <select className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                  </select>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Salvar Pagamento
                </Button>
              </div>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clientes;
