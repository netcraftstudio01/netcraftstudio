import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

// Butterfly component for loading screen
const LoadingButterfly = ({ index }: { index: number }) => {
  const startX = Math.random() * 100;
  const startY = 100 + Math.random() * 20;
  
  return (
    <motion.div
      className="absolute"
      initial={{ 
        x: `${startX}vw`,
        y: `${startY}vh`,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        x: [`${startX}vw`, `${startX + (Math.random() - 0.5) * 40}vw`],
        y: [`${startY}vh`, '-10vh'],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 0.8, 0.5],
        rotate: [0, 20, -20, 0],
      }}
      transition={{
        duration: 6 + Math.random() * 3,
        delay: index * 0.5,
        ease: "easeInOut",
      }}
    >
      <motion.svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        className="text-tedx-red/40"
        animate={{
          scaleX: [1, 0.3, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path
          fill="currentColor"
          d="M12 2c-1.5 0-3 2-3 5s1.5 5 3 5 3-2 3-5-1.5-5-3-5zm-6 5c-2 0-4 2-4 5s2 5 4 5c1.5 0 3-1 4-2.5-1.5-1-2.5-3-2.5-5s1-4 2.5-5c-1-1.5-2.5-2.5-4-2.5zm12 0c-1.5 0-3 1-4 2.5 1.5 1 2.5 3 2.5 5s-1 4-2.5 5c1 1.5 2.5 2.5 4 2.5 2 0 4-2 4-5s-2-5-4-5z"
        />
      </motion.svg>
    </motion.div>
  );
};

// Particle component
const Particle = ({ index }: { index: number }) => {
  const size = Math.random() * 4 + 2;
  
  return (
    <motion.div
      className="absolute rounded-full bg-tedx-red"
      style={{
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1.5, 0],
        y: [0, -100],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        delay: index * 0.2,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
};

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [phase, setPhase] = useState<'initial' | 'kprcas' | 'tedx' | 'complete'>('initial');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start animation after brief delay
    const startTimer = setTimeout(() => setPhase('kprcas'), 300);
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 40);

    // Phase transitions
    const tedxTimer = setTimeout(() => setPhase('tedx'), 1800);
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      setTimeout(onLoadingComplete, 1000);
    }, 4500);

    return () => {
      clearTimeout(startTimer);
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
          exit={{ 
            opacity: 0, 
            scale: 1.2,
            filter: 'blur(10px)',
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <Particle key={i} index={i} />
            ))}
          </div>

          {/* Butterflies */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {phase !== 'initial' && [...Array(6)].map((_, i) => (
              <LoadingButterfly key={i} index={i} />
            ))}
          </div>

          {/* Morphing background shape */}
          <motion.div
            className="absolute w-[600px] h-[600px] bg-tedx-red/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              borderRadius: ['60% 40% 30% 70% / 60% 30% 70% 40%', '30% 60% 70% 40% / 50% 60% 30% 60%', '60% 40% 30% 70% / 60% 30% 70% 40%'],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Main content */}
          <div className="relative z-10 text-center perspective-1000">
             {/* TED X */}
            <AnimatePresence>
              {phase === 'tedx' && (
                <motion.div
                  className="flex justify-center items-center gap-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {tedLetters.map((letter, index) => (
                    <motion.span
                      key={index}
                      className="font-display text-6xl md:text-8xl lg:text-9xl text-tedx-red inline-block"
                      initial={{ opacity: 0, x: -50, scale: 0.5, filter: 'blur(10px)' }}
                      animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        filter: 'blur(0px)',
                        textShadow: [
                          '0 0 20px hsl(352 100% 46% / 0.4)',
                          '0 0 60px hsl(352 100% 46% / 0.6)',
                          '0 0 20px hsl(352 100% 46% / 0.4)',
                        ],
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.12,
                        ease: 'easeOut',
                        textShadow: {
                          duration: 2,
                          repeat: Infinity,
                        }
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  
                  {/* X with dramatic entrance */}
                  <motion.span
                    className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground inline-block relative align-text-top"
                    style={{top: '-40px'}}
                    initial={{ 
                      opacity: 0, 
                      scale: 0, 
                      rotate: -180,
                      filter: 'blur(20px)',
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5,
                      type: 'spring',
                      stiffness: 150,
                      damping: 15,
                    }}
                  >
                    <motion.span
                      className="inline-block"
                      animate={{
                        textShadow: [
                          '0 0 20px hsl(352 100% 46% / 0.3)',
                          '0 0 60px hsl(352 100% 46% / 0.7)',
                          '0 0 20px hsl(352 100% 46% / 0.3)',
                        ],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      X
                    </motion.span>
                    
                    {/* Ripple effect behind X */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-20 h-20 border border-tedx-red/30 rounded-full"
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 3, opacity: 0 }}
                          transition={{
                            duration: 2,
                            delay: 0.8 + i * 0.4,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* KPRCAS */}
            <motion.div
              className="flex justify-center mb-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase !== 'initial' ? 1 : 0 }}
            >
              {kprcasLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground tracking-wider inline-block"
                  initial={{ 
                    opacity: 0, 
                    y: 100, 
                    rotateX: -90,
                    filter: 'blur(10px)',
                  }}
                  animate={phase !== 'initial' ? { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    filter: 'blur(0px)',
                  } : {}}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    scale: 1.2,
                    color: 'hsl(352, 100%, 46%)',
                    transition: { duration: 0.2 }
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

           

            {/* Decorative animated line */}
            <motion.div
              className="mt-8 h-[2px] mx-auto overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            >
              <motion.div
                className="h-full w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(352, 100%, 46%), transparent)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Progress bar with shimmer */}
            <motion.div
              className="mt-12 w-64 md:w-80 h-[3px] bg-muted mx-auto overflow-hidden rounded-full relative"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-tedx-red via-red-400 to-tedx-red rounded-full relative"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </motion.div>

            {/* Loading text with typewriter effect */}
            <motion.p
              className="mt-6 text-muted-foreground text-sm tracking-[0.3em] uppercase font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Ideas Worth Spreading
              </motion.span>
            </motion.p>
          </div>

          {/* Corner decorations with animation */}
          <motion.div
            className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-tedx-red/50"
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          />
          <motion.div
            className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-tedx-red/30"
            initial={{ opacity: 0, scale: 0, rotate: 90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-tedx-red/30"
            initial={{ opacity: 0, scale: 0, rotate: 90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-tedx-red/50"
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
