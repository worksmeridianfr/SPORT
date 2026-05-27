import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineCheckCircle } from 'react-icons/ai';

interface NotificationProps {
  message: string | null;
}

export function Notification({ message }: NotificationProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-4 pointer-events-none"
        >
          <div className="bg-rosso text-polar px-5 py-3 flex items-center gap-3 pointer-events-auto shadow-lg">
            <AiOutlineCheckCircle size={18} />
            <span
              className="font-display text-sm tracking-wider"
              style={{ letterSpacing: '0.05em' }}
            >
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
