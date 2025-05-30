
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

const Campanhas = () => {
  const [ferramentas, setFerramentas] = useState([
    {
      id: 1,
      nome: 'RD Station',
      tipo: 'CRM',
      valorMensal: 199,
      status: 'Pago'
    },
    {
      id: 2,
      nome: 'Meta Ads',
      tipo: 'Anúncios',
      valorMensal: 500,
      status: 'A pagar'
    },
    {
      id: 3,
      nome: 'Google Ads',
      tipo: 'Anúncios',
      valorMensal: 800,
      status: 'Pago'
    },
    {
      id: 4,
      nome: 'Canva Pro',
      tipo: 'Design',
      valorMensal: 45,
      status: 'Pago'
    },
    {
      id: 5,
      nome: 'Figma',
      tipo: 'Design',
      valorMensal: 120,
      status: 'A pagar'
    },
    {
      id: 6,
      nome: 'Google Workspace',
      tipo: 'Produtividade',
      valorMensal: 120,
      status: 'Vencido'
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
      case 'A pagar':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            A pagar
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

  const getTipoColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      'CRM': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Anúncios': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Design': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Produtividade': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[tipo] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Ferramentas de Marketing</h1>
            <p className="text-gray-400">Gerencie gastos com ferramentas e plataformas</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">Registrar Nova Ferramenta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome da Ferramenta</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: RD Station, Meta Ads"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Categoria</label>
                  <select className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Selecione uma categoria</option>
                    <option value="CRM">CRM</option>
                    <option value="Anúncios">Anúncios</option>
                    <option value="Design">Design</option>
                    <option value="Produtividade">Produtividade</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Valor Mensal</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <select className="w-full px-3 py-2 bg-dark-300 border border-dark-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="A pagar">A pagar</option>
                    <option value="Pago">Pago</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Salvar Ferramenta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">R$ 1.784</div>
              <p className="text-gray-400 text-sm">Total Mensal</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">4</div>
              <p className="text-gray-400 text-sm">Pagas</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">2</div>
              <p className="text-gray-400 text-sm">A Pagar</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-400">1</div>
              <p className="text-gray-400 text-sm">Vencidas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Ferramentas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-300">
                  <TableHead className="text-gray-300">Nome da Ferramenta</TableHead>
                  <TableHead className="text-gray-300">Tipo</TableHead>
                  <TableHead className="text-gray-300">Valor Mensal</TableHead>
                  <TableHead className="text-gray-300">Status de Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ferramentas.map((ferramenta) => (
                  <TableRow key={ferramenta.id} className="border-dark-300 hover:bg-dark-300/50">
                    <TableCell className="text-white font-medium">{ferramenta.nome}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(ferramenta.tipo)}>
                        {ferramenta.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">R$ {ferramenta.valorMensal}</TableCell>
                    <TableCell>{getStatusBadge(ferramenta.status)}</TableCell>
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

export default Campanhas;
