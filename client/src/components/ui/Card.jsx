import { motion } from 'framer-motion';

function Card({
  children,
  className = '',
  hover = false,
  padding = true,
  animate = false,
  delay = 0,
  style,
  onClick,
}) {
  const cls = ['card', padding ? 'p-5' : '', className].filter(Boolean).join(' ');

  if (animate) {
    return (
      <motion.div
        className={cls}
        style={style}
        onClick={onClick}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] }}
        whileHover={hover ? { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' } : {}}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cls} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

export default Card;
