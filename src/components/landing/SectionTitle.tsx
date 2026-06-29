interface SectionTitleProps {
  kicker: string;
  title: string;
  copy: string;
}

export function SectionTitle({ kicker, title, copy }: SectionTitleProps) {
  return (
    <div data-reveal className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-signal">{kicker}</p>
      <h2 className="font-display text-4xl font-bold leading-tight text-mist md:text-6xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/62 md:text-lg">{copy}</p>
    </div>
  );
}
