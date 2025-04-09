import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ActionButtonProps {
  icon: React.ReactNode;
  text: string;
  points: number;
  onClick: () => void;
}

export default function ActionButton({ icon, text, points, onClick }: ActionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        className="w-full flex items-center justify-between gap-2 p-6"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{text}</span>
        </div>
        <span className="text-sm font-medium text-primary">+{points} pts</span>
      </Button>
    </motion.div>
  );
}