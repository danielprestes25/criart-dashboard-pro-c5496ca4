
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Phone, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Ativo' | 'Inativo' | 'Prospecto';
}

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    phone: '(11) 99999-9999',
    company: 'Silva & Associados',
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@techsolutions.com',
    phone: '(11) 88888-8888',
    company: 'Tech Solutions',
    status: 'Ativo',
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@startup.com',
    phone: '(11) 77777-7777',
    company: 'Startup Inovadora',
    status: 'Prospecto',
  },
];

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Client = {
      id: Date.now().toString(),
      ...formData,
      status: 'Prospecto',
    };

    setClients([...clients, newClient]);
    setFormData({ name: '', email: '', phone: '', company: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Cliente adicionado com sucesso!",
      description: `${formData.name} foi adicionado à sua lista de clientes.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Inativo':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'Prospecto':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
            <p className="text-gray-400">Gerencie seus clientes e prospectos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-300">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-dark-300 border-dark-400 text-white"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1">
                    Salvar Cliente
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

        {/* Clients Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-dark-300">
                  <TableHead className="text-gray-300">Nome</TableHead>
                  <TableHead className="text-gray-300">Contato</TableHead>
                  <TableHead className="text-gray-300">Empresa</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="border-dark-300">
                    <TableCell className="text-white font-medium">
                      {client.name}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-300 text-sm">
                          <Mail className="h-3 w-3 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-gray-300 text-sm">
                          <Phone className="h-3 w-3 mr-2" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-300">
                        <Building className="h-3 w-3 mr-2" />
                        {client.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
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
