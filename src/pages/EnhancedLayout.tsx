import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import BackgroundAnimation from './BackgroundAnimation';

interface EnhancedLayoutProps {
  children: ReactNode;
}

const EnhancedLayout = ({ children }: EnhancedLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <BackgroundAnimation />
      {/* Main Content with proper spacing */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default EnhancedLayout;
