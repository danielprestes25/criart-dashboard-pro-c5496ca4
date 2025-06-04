
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const getErrorMessage = (error: string) => {
    if (error.includes('Invalid login credentials')) {
      return 'Email ou senha inválidos';
    } else if (error.includes('Email not confirmed')) {
      return 'Email não confirmado. Verifique sua caixa de entrada.';
    } else if (error.includes('User already registered')) {
      return 'Usuário já registrado com este email';
    } else if (error.includes('Password should be at least 6 characters')) {
      return 'A senha deve ter pelo menos 6 caracteres';
    } else if (error.includes('Invalid email')) {
      return 'Email inválido';
    } else if (error.includes('Signup disabled')) {
      return 'Cadastro desabilitado. Entre em contato com o suporte.';
    }
    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!email.trim() || !password.trim()) {
        toast({
          title: 'Erro',
          description: 'Email e senha são obrigatórios',
          type: 'error'
        });
        setLoading(false);
        return;
      }

      if (!isLogin && !name.trim()) {
        toast({
          title: 'Erro',
          description: 'Nome é obrigatório',
          type: 'error'
        });
        setLoading(false);
        return;
      }

      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(email, password, name);
      }

      if (result.error) {
        const errorMessage = getErrorMessage(result.error);
        
        toast({
          title: 'Erro',
          description: errorMessage,
          type: 'error'
        });
      } else {
        if (!isLogin) {
          toast({
            title: 'Conta criada!',
            description: 'Verifique seu email para confirmar a conta',
            type: 'success'
          });
          // Switch to login mode after successful signup
          setIsLogin(true);
          setPassword('');
        } else {
          toast({
            title: 'Login realizado!',
            description: 'Redirecionando...',
            type: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado. Tente novamente.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 to-dark-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/ef34442c-50fc-4535-a0f2-97651b6dacb6.png" 
            alt="Criart Logo" 
            className="h-12 w-auto mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h1>
          <p className="text-gray-400">
            {isLogin ? 'Acesse sua conta Criart' : 'Crie sua conta Criart'}
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {isLogin ? 'Login' : 'Registro'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-dark-300 border-dark-400 text-white"
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-dark-300 border-dark-400 text-white"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-dark-300 border-dark-400 text-white pr-10"
                    placeholder="Digite sua senha"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPassword('');
                    setName('');
                  }}
                  className="text-primary hover:text-primary/80"
                  disabled={loading}
                >
                  {isLogin 
                    ? 'Não tem conta? Criar uma' 
                    : 'Já tem conta? Fazer login'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
