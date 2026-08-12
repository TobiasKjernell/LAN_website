import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const BOOT_LINES = [
  'ESTABLISHING UPLINK',
  'SYNCING LAN PROTOCOL',
  'LOADING ASSETS',
  'CONNECTION ESTABLISHED',
]

interface IntroSplashProps {
  onComplete: () => void
}

function SplashContent({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-32 bg-linear-to-b from-transparent via-white/10 to-transparent"
          initial={{ y: '-20%' }}
          animate={{ y: '120%' }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.05em', scale: 0.92 }}
          animate={{ opacity: 1, letterSpacing: '0.35em', scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-countdown pl-[0.35em] text-4xl font-black uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] sm:text-6xl"
        >
          LAN
        </motion.span>

        <div className="flex w-56 flex-col items-center gap-4 sm:w-72">
          <div className="h-0.5 w-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full origin-left bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            />
          </div>

          <motion.ul
            className="flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-white/50 sm:text-xs"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.45, delayChildren: 0.3 } } }}
          >
            {BOOT_LINES.map((line) => (
              <motion.li
                key={line}
                variants={{
                  hidden: { opacity: 0, y: 4 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {line}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      <p className="absolute bottom-6 text-[10px] uppercase tracking-widest text-white/30">
        Click or press any key to skip
      </p>
    </>
  )
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const prefersReducedMotion = useReducedMotion()
  const [exiting, setExiting] = useState(false)

  function beginExit() {
    setExiting(true)
  }

  useEffect(() => {
    if (prefersReducedMotion) {
      beginExit()
      return
    }
    const timer = setTimeout(beginExit, 2600)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return
    window.addEventListener('keydown', beginExit)
    return () => window.removeEventListener('keydown', beginExit)
  }, [prefersReducedMotion])

  const panelTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.85,
    ease: [0.85, 0, 0.15, 1] as const,
  }

  return (
    <div
      className="fixed inset-0 z-100"
      role="presentation"
      aria-hidden="true"
      onClick={beginExit}
    >
      {/* top half */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black"
        style={{ clipPath: 'inset(0% 0% 50% 0%)' }}
        initial={false}
        animate={exiting ? { y: '-55vh' } : { y: 0 }}
        transition={panelTransition}
      >
        <SplashContent prefersReducedMotion={!!prefersReducedMotion} />
      </motion.div>

      {/* bottom half */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black"
        style={{ clipPath: 'inset(50% 0% 0% 0%)' }}
        initial={false}
        animate={exiting ? { y: '55vh' } : { y: 0 }}
        transition={panelTransition}
        onAnimationComplete={() => {
          if (exiting) onComplete()
        }}
      >
        <SplashContent prefersReducedMotion={!!prefersReducedMotion} />
      </motion.div>

      {/* seam flash */}
      <motion.div
        className="pointer-events-none fixed inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={
          exiting
            ? { opacity: [0, 0.8, 0], transition: { duration: 0.45, times: [0, 0.2, 1] } }
            : { opacity: 0 }
        }
      />
    </div>
  )
}
