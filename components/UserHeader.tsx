import { motion } from 'framer-motion';

interface UserHeaderProps {
  user: {
    name: string;
    points: number;
  };
}

export default function UserHeader({ user }: UserHeaderProps) {
  return (
    <motion.div 
      className="mb-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-2">
        Olá, {user.name || 'Visitante'}
      </h1>
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <p className="text-lg">
          Você tem <span className="font-bold text-primary">{user.points}</span> pontos
        </p>
      </div>
    </motion.div>
  );
}