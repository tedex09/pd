import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const SPIN_VALUES = [0, 5, 10, 20, 50];

export default function Roleta({ onSpinComplete }: { onSpinComplete: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkLastSpin();
  }, []);

  const checkLastSpin = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      
      if (!data.lastSpin || new Date(data.lastSpin).getDate() !== new Date().getDate()) {
        setCanSpin(true);
      }
    } catch (error) {
      console.error('Error checking last spin:', error);
    }
  };

  const spin = async () => {
    setIsSpinning(true);
    
    // Simulate spinning animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const randomIndex = Math.floor(Math.random() * SPIN_VALUES.length);
    const value = SPIN_VALUES[randomIndex];
    setSelectedValue(value);

    try {
      const userId = localStorage.getItem('userId');
      await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'daily_spin',
          value,
        }),
      });

      setCanSpin(false);
      onSpinComplete();

      // Show success toast
      toast({
        title: "Parabéns! 🎉",
        description: `Você ganhou ${value} pontos!`,
      });

    } catch (error) {
      console.error('Error saving reward:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua recompensa.",
        variant: "destructive",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg text-center w-full max-w-sm mx-auto">
      <AnimatePresence>
        <motion.div 
          className="mb-6"
          initial={{ scale: 1 }}
          animate={{ 
            scale: isSpinning ? [1, 1.1, 1] : 1,
            rotate: isSpinning ? [0, 360] : 0
          }}
          transition={{ 
            duration: isSpinning ? 2 : 0,
            ease: "easeInOut"
          }}
        >
          <div className="w-48 h-48 mx-auto border-4 border-primary rounded-full flex items-center justify-center mb-4 relative">
            {isSpinning ? (
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            ) : (
              <motion.span 
                className="text-4xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {selectedValue !== null ? `${selectedValue} pts` : '?'}
              </motion.span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      <Button
        onClick={spin}
        disabled={!canSpin || isSpinning}
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-all"
      >
        {isSpinning ? 'Girando...' : 'Girar Roleta'}
      </Button>
      
      {!canSpin && selectedValue === null && (
        <p className="mt-4 text-sm text-muted-foreground">
          Volte amanhã para girar novamente!
        </p>
      )}
    </div>
  );
}