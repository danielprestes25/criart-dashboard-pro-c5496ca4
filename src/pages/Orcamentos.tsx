
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, FileDown, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Orcamento {
  id: string;
  clientName: string;
  descricao: string;
  valor: number;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado' | 'Enviado';
  validUntil: string;
  createdAt: string;
}

const initialOrcamentos: Orcamento[] = [
  {
    id: '1',
    clientName: 'Maria Silva',
    descricao: 'Desenvolvimento de website corporativo',
    valor: 5000,
    status: 'Aprovado',
    validUntil: '2024-02-15',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    clientName: 'João Santos',
    descricao: 'Campanha de marketing digital',
    valor: 3000,
    status: 'Pendente',
    validUntil: '2024-02-20',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    clientName: 'Ana Costa',
    descricao: 'Consultoria em estratégia digital',
    valor: 2500,
    status: 'Enviado',
    validUntil: '2024-02-10',
    createdAt: '2024-01-08',
  },
];

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(initialOrcamentos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    descricao: '',
    valor: '',
    validUntil: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrcamento: Orcamento = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      status: 'Pendente',
      validUntil: formData.validUntil,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrcamentos([...orcamentos, newOrcamento]);
    setFormData({ clientName: '', descricao: '', valor: '', validUntil: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Orçamento criado com sucesso!",
      description: `Orçamento de R$ ${formData.valor} para ${formData.clientName} foi adicionado.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pendente':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Rejeitado':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Enviado':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleGeneratePDF = (orcamento: Orcamento) => {
    toast({
      title: "PDF sendo gerado...",
      description: `Orçamento para ${orcamento.clientName} será baixado em instantes.`,
    });
    // Aqui seria integrada uma biblioteca de geração de PDF
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Orçamentos</h1>
            <p className="text-gray-400">Crie e gerencie orçamentos para seus clientes</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Criar Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Novo Orçamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-gray-300">Cliente</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, clientName: value })}>
                    <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-300 border-dark-400">
                      <SelectItem value="Maria Silva">Maria Silva</SelectItem>
                      <SelectItem value="João Santos">João Santos</SelectItem>
                      <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-gray-300">Descrição do Serviço</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-gray-300">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil" className="text-gray-300">Válido até</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1">
                    Criar Orçamento
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-dark-400 text-gray-300 hover:bg-dark-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-400">Aprovados</p>
                  <p className="text-xl font-bold text-white">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-400">Pendentes</p>
                  <p className="text-xl font-bold text-white">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-400">Enviados</p>
                  <p className="text-xl font-bold text-white">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-400">Valor Total</p>
                  <p className="text-xl font-bold text-white">R$ 10.500</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orcamentos Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-300">
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">Descrição</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Válido até</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamentos.map((orcamento) => (
                  <TableRow key={orcamento.id} className="border-dark-300">
                    <TableCell className="text-white font-medium">
                      {orcamento.clientName}
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-xs">
                      <div className="truncate" title={orcamento.descricao}>
                        {orcamento.descricao}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {formatCurrency(orcamento.valor)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(orcamento.status)}>
                        {orcamento.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(orcamento.validUntil)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                        onClick={() => handleGeneratePDF(orcamento)}
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        PDF
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
}
