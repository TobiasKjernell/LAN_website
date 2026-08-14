import { AnimatePresence, motion } from 'framer-motion'

interface SavingOverlayProps {
  show: boolean
  message?: string
}

export function SavingOverlay({ show, message = 'Saving changes' }: SavingOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="flex w-full max-w-md flex-col items-center gap-6 px-8 py-16 text-center sm:py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-accent" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-countdown text-xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)] sm:text-2xl">
                {message}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                Hang tight, updating your LAN party
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
