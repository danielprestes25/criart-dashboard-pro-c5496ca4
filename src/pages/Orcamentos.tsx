
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
import { Plus, Send, CheckCircle, X, FileText } from 'lucide-react';

const Orcamentos = () => {
  const [propostas, setPropostas] = useState([
    {
      id: 1,
      cliente: 'Tech Solutions',
      valorProposto: 5800,
      status: 'Aceito',
      dataEnvio: '2024-01-12'
    },
    {
      id: 2,
      cliente: 'Marketing Digital Pro',
      valorProposto: 3200,
      status: 'Enviado',
      dataEnvio: '2024-01-18'
    },
    {
      id: 3,
      cliente: 'Startup Innovation',
      valorProposto: 2100,
      status: 'Recusado',
      dataEnvio: '2024-01-08'
    },
    {
      id: 4,
      cliente: 'E-commerce Plus',
      valorProposto: 4500,
      status: 'Enviado',
      dataEnvio: '2024-01-20'
    },
    {
      id: 5,
      cliente: 'Consultoria Beta',
      valorProposto: 6800,
      status: 'Aceito',
      dataEnvio: '2024-01-15'
    }
  ]);

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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Orçamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Cliente</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Valor Proposto</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Descrição do Serviço</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descreva detalhadamente o serviço a ser prestado..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Validade da Proposta</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <select className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="Enviado">Enviado</option>
                      <option value="Aceito">Aceito</option>
                      <option value="Recusado">Recusado</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    Salvar Orçamento
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
                    <FileText className="w-4 h-4" />
                    Gerar PDF
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">R$ 22.400</div>
              <p className="text-gray-400 text-sm">Valor Total Propostas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">2</div>
              <p className="text-gray-400 text-sm">Aceitas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">2</div>
              <p className="text-gray-400 text-sm">Enviadas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-400">1</div>
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
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        <FileText className="w-4 h-4" />
                      </Button>
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

export default Orcamentos;
