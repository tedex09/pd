'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const SPIN_VALUES = [0, 5, 10, 20, 50];

export default function Roleta({ onSpinComplete }: { onSpinComplete: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

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
    } catch (error) {
      console.error('Error saving reward:', error);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg text-center">
      <div className="mb-6">
        <div className="w-48 h-48 mx-auto border-4 border-primary rounded-full flex items-center justify-center mb-4">
          {isSpinning ? (
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          ) : (
            <span className="text-4xl font-bold">
              {selectedValue !== null ? `${selectedValue} pts` : '?'}
            </span>
          )}
        </div>
      </div>
      <Button
        onClick={spin}
        disabled={!canSpin || isSpinning}
        className="w-full"
      >
        {isSpinning ? 'Girando...' : 'Girar Roleta'}
      </Button>
      {!canSpin && selectedValue === null && (
        <p className="mt-2 text-sm text-muted-foreground">
          Volte amanhã para girar novamente!
        </p>
      )}
    </div>
  );
}