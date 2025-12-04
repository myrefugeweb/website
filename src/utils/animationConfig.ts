// Optimized animation configuration for smooth scroll animations
export const smoothScrollAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth animation
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  },
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  },
};

export const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-50px' },
  transition: {
    staggerChildren: 0.1,
    duration: 0.3,
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  },
};


