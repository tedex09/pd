import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Gift, Star, Trophy, Medal, Crown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const SPIN_VALUES = [
  { value: 0, icon: Gift, color: '#FF6B6B' },
  { value: 5, icon: Star, color: '#4ECDC4' },
  { value: 10, icon: Trophy, color: '#45B7D1' },
  { value: 20, icon: Medal, color: '#96CEB4' },
  { value: 50, icon: Crown, color: '#FFEEAD' }
];

export default function Roleta({ onSpinComplete }: { onSpinComplete: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<LucideIcon | null>(null);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    checkLastSpin();
  }, []);

  const checkLastSpin = async () => {
    try {
      const phone = localStorage.getItem('phone');
      if (!phone) return;

      const res = await fetch(`/api/users/${phone}`);
      const data = await res.json();
      
      if (!data.lastSpin || new Date(data.lastSpin).getDate() !== new Date().getDate()) {
        setCanSpin(true);
      }
      setStreak(data.streak || 0);
    } catch (error) {
      console.error('Error checking last spin:', error);
    }
  };

  const spin = async () => {
    setIsSpinning(true);
    
    // Simulate spinning animation with multiple rotations
    const rotations = 5; // Number of full rotations
    const duration = 3000; // Total duration in milliseconds
    
    // Randomly select a reward
    const randomIndex = Math.floor(Math.random() * SPIN_VALUES.length);
    const selectedReward = SPIN_VALUES[randomIndex];
    
    // Animate the wheel
    await new Promise(resolve => setTimeout(resolve, duration));
    
    setSelectedValue(selectedReward.value);
    setSelectedIcon(selectedReward.icon);

    try {
      const phone = localStorage.getItem('phone');
      if (!phone) return;

      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          type: 'daily_spin',
          value: selectedReward.value,
        }),
      });

      const data = await res.json();
      setCanSpin(false);
      onSpinComplete();

      // Show success toast with streak info
      toast({
        title: "Parabéns! 🎉",
        description: `Você ganhou ${selectedReward.value} pontos!\n${streak > 0 ? `Sequência atual: ${streak + 1} dias` : ''}`,
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
            rotate: isSpinning ? [0, 360 * 5] : 0 // Multiple rotations
          }}
          transition={{ 
            duration: isSpinning ? 3 : 0,
            ease: "easeInOut"
          }}
        >
          <div className="w-48 h-48 mx-auto border-4 border-primary rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
            {isSpinning ? (
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {selectedIcon ? (
                  <selectedIcon className="w-12 h-12 mb-2" />
                ) : (
                  <Gift className="w-12 h-12 mb-2" />
                )}
                <span className="text-4xl font-bold">
                  {selectedValue !== null ? `${selectedValue} pts` : '?'}
                </span>
              </motion.div>
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
      
      {streak > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          🔥 Sequência atual: {streak} dias
        </p>
      )}
      
      {!canSpin && selectedValue === null && (
        <p className="mt-4 text-sm text-muted-foreground">
          Volte amanhã para girar novamente!
        </p>
      )}
    </div>
  );
}