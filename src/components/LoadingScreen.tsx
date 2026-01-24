import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [phase, setPhase] = useState<'kprcas' | 'tedx' | 'complete'>('kprcas');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Phase transitions
    const tedxTimer = setTimeout(() => setPhase('tedx'), 1500);
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      setTimeout(onLoadingComplete, 800);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(tedxTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  const kprcasLetters = 'KPRCAS'.split('');
  const tedLetters = 'TED'.split('');

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-tedx-red rounded-full opacity-30"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [null, Math.random() * -500],
                  opacity: [0.3, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center">
            {/* KPRCAS */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {kprcasLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground tracking-wider"
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* TED X */}
            <AnimatePresence>
              {phase === 'tedx' && (
                <motion.div
                  className="flex justify-center items-center gap-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {tedLetters.map((letter, index) => (
                    <motion.span
                      key={index}
                      className="font-display text-6xl md:text-8xl lg:text-9xl text-tedx-red animate-pulse-glow"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.15,
                        ease: 'easeOut',
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  
                  {/* X with special animation */}
                  <motion.span
                    className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground relative"
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.6,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <motion.span
                      animate={{
                        textShadow: [
                          '0 0 20px hsl(352 100% 46% / 0.4)',
                          '0 0 60px hsl(352 100% 46% / 0.8)',
                          '0 0 20px hsl(352 100% 46% / 0.4)',
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      X
                    </motion.span>
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative line */}
            <motion.div
              className="mt-8 h-[2px] mx-auto loader-line"
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Progress bar */}
            <motion.div
              className="mt-12 w-64 md:w-80 h-[2px] bg-muted mx-auto overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-tedx-red"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              className="mt-4 text-muted-foreground text-sm tracking-widest uppercase font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Ideas Worth Spreading
            </motion.p>
          </div>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-tedx-red"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-tedx-red"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
