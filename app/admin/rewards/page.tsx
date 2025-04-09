'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface RewardConfig {
  value: number;
  probability: number;
  active: boolean;
}

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<RewardConfig[]>([
    { value: 0, probability: 30, active: true },
    { value: 5, probability: 30, active: true },
    { value: 10, probability: 20, active: true },
    { value: 20, probability: 15, active: true },
    { value: 50, probability: 5, active: true },
  ]);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
    loadRewards();
  }, []);

  const checkAdmin = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
    }
  };

  const loadRewards = () => {
    const savedRewards = localStorage.getItem('rewardConfig');
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards));
    }
  };

  const handleSave = () => {
    localStorage.setItem('rewardConfig', JSON.stringify(rewards));
  };

  const updateReward = (index: number, field: keyof RewardConfig, value: number | boolean) => {
    const newRewards = [...rewards];
    newRewards[index] = { ...newRewards[index], [field]: value };
    setRewards(newRewards);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciar Recompensas</h1>

      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Valor (pts)</th>
                  <th className="text-left py-3 px-4">Probabilidade (%)</th>
                  <th className="text-left py-3 px-4">Ativo</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        value={reward.value}
                        onChange={(e) => updateReward(index, 'value', parseInt(e.target.value))}
                        className="w-24"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        type="number"
                        value={reward.probability}
                        onChange={(e) => updateReward(index, 'probability', parseInt(e.target.value))}
                        className="w-24"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Switch
                        checked={reward.active}
                        onCheckedChange={(checked) => updateReward(index, 'active', checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </div>
        </div>
      </div>
    </div>
  );
}