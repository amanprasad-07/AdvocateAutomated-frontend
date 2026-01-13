import { motion } from "framer-motion";

/**
 * ScrollReveal Component
 *
 * Wraps child components with a scroll-based
 * entrance animation using Framer Motion.
 * Elements fade in and translate vertically
 * when they enter the viewport.
 *
 * @param {ReactNode} children - Content to be animated
 * @param {number} delay - Optional animation delay in seconds
 * @param {number} y - Initial vertical offset before animation
 */
const ScrollReveal = ({
  children,
  delay = 0,
  y = 40,
}) => {
  return (
    <motion.div
      // Initial hidden state before entering viewport
      initial={{ opacity: 0, y }}

      // Animation state when element becomes visible
      whileInView={{ opacity: 1, y: 0 }}

      // Configure viewport behavior
      viewport={{ once: true, amount: 0.2 }}

      // Animation timing and easing
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
