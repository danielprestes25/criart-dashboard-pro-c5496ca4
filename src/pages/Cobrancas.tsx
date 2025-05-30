
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Cobranca {
  id: string;
  clientName: string;
  valor: number;
  status: 'Pago' | 'Pendente' | 'Vencido';
  vencimento: string;
  paymentUrl?: string;
}

const initialCobrancas: Cobranca[] = [
  {
    id: '1',
    clientName: 'Maria Silva',
    valor: 1200,
    status: 'Pago',
    vencimento: '2024-01-15',
    paymentUrl: 'https://mercadopago.com.br/checkout/123',
  },
  {
    id: '2',
    clientName: 'João Santos',
    valor: 850,
    status: 'Pendente',
    vencimento: '2024-01-20',
    paymentUrl: 'https://mercadopago.com.br/checkout/456',
  },
  {
    id: '3',
    clientName: 'Ana Costa',
    valor: 600,
    status: 'Vencido',
    vencimento: '2024-01-10',
    paymentUrl: 'https://mercadopago.com.br/checkout/789',
  },
];

export default function Cobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>(initialCobrancas);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    valor: '',
    vencimento: '',
    paymentUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCobranca: Cobranca = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      valor: parseFloat(formData.valor),
      status: 'Pendente',
      vencimento: formData.vencimento,
      paymentUrl: formData.paymentUrl,
    };

    setCobrancas([...cobrancas, newCobranca]);
    setFormData({ clientName: '', valor: '', vencimento: '', paymentUrl: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Cobrança criada com sucesso!",
      description: `Cobrança de R$ ${formData.valor} para ${formData.clientName} foi adicionada.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pendente':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Vencido':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Cobranças</h1>
            <p className="text-gray-400">Gerencie suas cobranças e pagamentos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Nova Cobrança</DialogTitle>
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
                  <Label htmlFor="vencimento" className="text-gray-300">Data de Vencimento</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={formData.vencimento}
                    onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentUrl" className="text-gray-300">Link de Pagamento</Label>
                  <Input
                    id="paymentUrl"
                    type="url"
                    placeholder="https://mercadopago.com.br/checkout/..."
                    value={formData.paymentUrl}
                    onChange={(e) => setFormData({ ...formData, paymentUrl: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1">
                    Criar Cobrança
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Recebido</p>
                  <p className="text-xl font-bold text-white">R$ 1.200</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Pendente</p>
                  <p className="text-xl font-bold text-white">R$ 850</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Vencido</p>
                  <p className="text-xl font-bold text-white">R$ 600</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cobrancas Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Cobranças</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-300">
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Vencimento</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobrancas.map((cobranca) => (
                  <TableRow key={cobranca.id} className="border-dark-300">
                    <TableCell className="text-white font-medium">
                      {cobranca.clientName}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatCurrency(cobranca.valor)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cobranca.status)}>
                        {cobranca.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(cobranca.vencimento)}
                    </TableCell>
                    <TableCell>
                      {cobranca.paymentUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          onClick={() => window.open(cobranca.paymentUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ver Link
                        </Button>
                      )}
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
