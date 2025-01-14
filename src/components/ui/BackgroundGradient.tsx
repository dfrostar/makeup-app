import { motion } from 'framer-motion';

export const BackgroundGradient = () => {
  return (
    <>
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-[10px] opacity-50"
          style={{
            background: 'linear-gradient(to right, #ec4899, #8b5cf6, #ec4899)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Floating shapes */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl"
            style={{
              background: i % 2 === 0 ? '#ec4899' : '#8b5cf6',
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
            }}
            animate={{
              x: [Math.random() * 100, Math.random() * -100],
              y: [Math.random() * 100, Math.random() * -100],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Glass overlay */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-[100px]" />
    </>
  );
};
