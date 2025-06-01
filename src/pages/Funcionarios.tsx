
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { apiService } from '@/services/api';
import { Employee } from '@/types/database';

export default function Funcionarios() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    salary: '',
    hire_date: '',
    status: 'active' as 'active' | 'inactive'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await apiService.getEmployees();
      setEmployees(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar funcionários",
        description: "Não foi possível carregar os funcionários",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await apiService.updateEmployee(editingEmployee.id, {
          ...formData,
          salary: parseFloat(formData.salary)
        });
        toast({
          title: "Funcionário atualizado!",
          description: "Funcionário foi atualizado com sucesso",
          type: "success"
        });
      } else {
        await apiService.createEmployee({
          ...formData,
          salary: parseFloat(formData.salary)
        });
        toast({
          title: "Funcionário criado!",
          description: "Novo funcionário foi adicionado com sucesso",
          type: "success"
        });
      }
      
      setIsModalOpen(false);
      setEditingEmployee(null);
      setFormData({ name: '', email: '', role: '', salary: '', hire_date: '', status: 'active' });
      loadEmployees();
    } catch (error) {
      toast({
        title: "Erro ao salvar funcionário",
        description: "Não foi possível salvar o funcionário",
        type: "error"
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      salary: employee.salary.toString(),
      hire_date: employee.hire_date,
      status: employee.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteEmployee(id);
      toast({
        title: "Funcionário excluído!",
        description: "Funcionário foi removido com sucesso",
        type: "success"
      });
      loadEmployees();
    } catch (error) {
      toast({
        title: "Erro ao excluir funcionário",
        description: "Não foi possível excluir o funcionário",
        type: "error"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Funcionários</h1>
            <p className="text-gray-400">Gerencie os funcionários da empresa</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-200 border-dark-300">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300">Cargo *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-gray-300">Salário *</Label>
                    <Input
                      id="salary"
                      type="number"
                      step="0.01"
                      value={formData.salary}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hire_date" className="text-gray-300">Data de Contratação *</Label>
                    <Input
                      id="hire_date"
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
                      className="bg-dark-300 border-dark-400 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-300">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}>
                      <SelectTrigger className="bg-dark-300 border-dark-400 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-300 border-dark-400">
                        <SelectItem value="active" className="text-white">Ativo</SelectItem>
                        <SelectItem value="inactive" className="text-white">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {editingEmployee ? 'Atualizar' : 'Criar'} Funcionário
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setEditingEmployee(null);
                    setFormData({ name: '', email: '', role: '', salary: '', hire_date: '', status: 'active' });
                  }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-white">{employees.length}</div>
                  <p className="text-gray-400 text-sm">Total de Funcionários</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{employees.filter(e => e.status === 'active').length}</div>
              <p className="text-gray-400 text-sm">Funcionários Ativos</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                R$ {employees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()}
              </div>
              <p className="text-gray-400 text-sm">Folha de Pagamento Total</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Lista de Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-gray-400">Carregando funcionários...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-dark-300">
                    <TableHead className="text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Cargo</TableHead>
                    <TableHead className="text-gray-300">Salário</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} className="border-dark-300 hover:bg-dark-300/50">
                      <TableCell className="text-white font-medium">{employee.name}</TableCell>
                      <TableCell className="text-gray-300">{employee.email}</TableCell>
                      <TableCell className="text-gray-300">{employee.role}</TableCell>
                      <TableCell className="text-white">R$ {employee.salary.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(employee.id)}
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
