import { ArrowRight, Play } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: string;
  variant?: 'primary' | 'secondary';
  icon?: 'arrow' | 'play';
}

export function MagneticButton({ children, variant = 'primary', icon = 'arrow' }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    gsap.to(el, {
      x: (event.clientX - box.left - box.width / 2) * 0.18,
      y: (event.clientY - box.top - box.height / 2) * 0.18,
      duration: 0.35,
      ease: 'power3.out'
    });
  };

  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.35)' });
  const Icon = icon === 'play' ? Play : ArrowRight;

  return (
    <a
      ref={ref}
      href={variant === 'primary' ? '/login' : '#demo'}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`group inline-flex min-h-14 items-center justify-center gap-3 rounded-[8px] px-6 text-sm font-bold transition ${
        variant === 'primary'
          ? 'bg-mist text-ink shadow-glow hover:bg-white'
          : 'border border-white/15 bg-white/8 text-mist backdrop-blur-xl hover:bg-white/12'
      }`}
    >
      {children}
      <Icon className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}
