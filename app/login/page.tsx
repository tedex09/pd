'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuthPhone = useAuthStore((state) => state.setPhone);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${phone}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Usuário não encontrado');
      }

      setAuthPhone(phone);
      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <Phone className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Entre com seu telefone
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="(99) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full rounded-lg border px-4 py-3"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}