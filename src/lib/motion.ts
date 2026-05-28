export const spring = {
  gentle: { type: 'spring' as const, stiffness: 160, damping: 24, mass: 0.9 },
  snap: { type: 'spring' as const, stiffness: 380, damping: 30 },
  crisp: { type: 'spring' as const, stiffness: 240, damping: 26 },
};

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
};
