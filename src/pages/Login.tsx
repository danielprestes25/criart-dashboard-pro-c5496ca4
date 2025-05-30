
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Painel Criart",
        });
      } else {
        toast({
          title: "Erro no login",
          description: "E-mail ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Painel Criart</h1>
          <p className="text-gray-400">Faça login para acessar sua conta</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">
              Entrar no Painel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-dark-300 border-dark-400 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-dark-300 border-dark-400 text-white placeholder:text-gray-500"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar no Painel"}
              </Button>
            </form>

            <div className="mt-4 p-4 bg-dark-300/50 rounded-lg">
              <p className="text-sm text-gray-400 text-center">Dados de teste:</p>
              <p className="text-sm text-gray-300 text-center">admin@criart.com / 123456</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
