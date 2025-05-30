
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
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Cobrancas = () => {
  const [receitas, setReceitas] = useState([
    {
      id: 1,
      cliente: 'Empresa ABC Ltda',
      valor: 2800,
      status: 'Pago',
      data: '2024-01-15'
    },
    {
      id: 2,
      cliente: 'Startup XYZ',
      valor: 1500,
      status: 'Pendente',
      data: '2024-01-20'
    },
    {
      id: 3,
      cliente: 'Loja Virtual 123',
      valor: 3200,
      status: 'Vencido',
      data: '2024-01-10'
    },
    {
      id: 4,
      cliente: 'Consultoria Beta',
      valor: 2100,
      status: 'Pago',
      data: '2024-01-18'
    },
    {
      id: 5,
      cliente: 'E-commerce Gama',
      valor: 4500,
      status: 'Pendente',
      data: '2024-01-25'
    }
  ]);

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nova Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">Nova Cobrança</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome do Cliente</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Digite o nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Valor da Cobrança</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Data de Vencimento</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Link de Pagamento</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://mercadopago.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <select className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Criar Cobrança
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">R$ 14.100</div>
              <p className="text-gray-400 text-sm">Total de Receitas</p>
            </div>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">2</div>
              <p className="text-gray-400 text-sm">Pagas</p>
            </Card>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">2</div>
              <p className="text-gray-400 text-sm">Pendentes</p>
            </Card>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-400">1</div>
              <p className="text-gray-400 text-sm">Vencidas</p>
            </Card>
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

export default Cobrancas;
