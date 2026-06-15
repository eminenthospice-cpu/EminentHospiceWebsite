---
name: motion-framer
description: Modern animation library for React. Create production-ready animations with motion components, variants, gestures, layout animations, AnimatePresence, spring physics, and scroll-based effects. Use when building interactive UI, micro-interactions, page transitions, or animation sequences.
metadata:
  source: https://github.com/freshtechbro/claudedesignskills
---

# Motion (Framer Motion)

Production-ready animation library for React. Declarative `motion` components, gesture recognition, layout/exit animations, spring physics.

## Core concepts

### Motion components
Prefix any HTML/SVG with `motion.`:
```jsx
<motion.div animate={{ x: 100 }} />
<motion.button whileHover={{ scale: 1.05 }} />
```

### Initial / animate / transition
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
/>
```

### Transition types
- `tween` (default, duration + ease)
- `spring` (`stiffness`, `damping`, `mass`)
- `inertia` (drag deceleration)

### Variants

```jsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

<motion.ul variants={container} initial="hidden" whileInView="visible">
  {items.map((it) => <motion.li key={it.id} variants={item} />)}
</motion.ul>
```

## Common patterns

### Hover / tap
```jsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
```

### Exit animations
```jsx
<AnimatePresence>
  {open && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

Direct child of `<AnimatePresence>`. Unique `key`. `exit` prop required.

### Scroll-triggered reveals
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '0px 0px -80px 0px' }}
  transition={{ duration: 0.4 }}
/>
```

### Layout animations
```jsx
<motion.div layout transition={{ layout: { duration: 0.3 } }} />
```

`layoutId` connects elements across components (tab underline, modal opening from thumbnail).

### Spring presets
- Gentle: `stiffness: 100, damping: 20`
- Wobbly: `stiffness: 200, damping: 10`
- Stiff: `stiffness: 400, damping: 30`

## Hooks
- `useAnimate()` — imperative scoped animations
- `useSpring(value, config)` — spring-tracked motion value
- `useInView(ref, options)` — viewport detection
- `useScroll() / useTransform()` — scroll-driven values
- `useReducedMotion()` — returns true if user prefers reduced motion

## Accessibility — REQUIRED for hospice context

Always gate motion on `useReducedMotion()`:
```jsx
const prefersReducedMotion = useReducedMotion();
if (prefersReducedMotion) return <div>{children}</div>;
return <motion.div animate={{ opacity: 1 }}>{children}</motion.div>;
```

## Performance

1. **Transform only** — `x`, `y`, `scale`, `rotate`, `opacity` are GPU-accelerated. Avoid animating `width`, `height`, `top`, `left`.
2. Individual transform props in `style={{ x, y, scale }}` are supported.
3. `layout` animations are expensive — use `layout="position"` if you only need position.
4. `LazyMotion` + `domAnimation` cuts bundle to ~4.6kb if you don't need all features.

## Pitfalls

- Forgetting `<AnimatePresence>` for exit animations.
- Missing `key` props in lists.
- Animating non-transform properties (causes layout thrash).
- Overusing layout animations (one per page is fine; 100 is not).
- Putting `transition` outside `whileHover` and expecting it to apply to the hover.

## Bundle optimization

```jsx
import { LazyMotion, domAnimation, m } from 'framer-motion';

<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

Replace `motion` with `m` for the smaller `LazyMotion` runtime.
