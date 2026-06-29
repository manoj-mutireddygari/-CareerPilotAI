import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { HeroWorkflow } from '../components/landing/HeroWorkflow';
import {
  DashboardShowcase,
  FeatureCards,
  InteractiveWorkflow,
  LiveAutomationShowcase,
  LogoMarquee,
  ProblemSection,
  StatsSection,
  TerminalConsoleSection,
  TestimonialsAndCta
} from '../components/landing/LandingSections';
import { MagneticButton } from '../components/landing/MagneticButton';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useLenis } from '../hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const scope = useRef<HTMLDivElement>(null);
  useLenis();
  useGsapReveal(scope);

  useGSAP(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>('.hero-char');
      gsap.from(chars, {
        yPercent: 110,
        opacity: 0,
        rotateX: -70,
        stagger: 0.018,
        duration: 0.9,
        ease: 'power4.out'
      });

      gsap.from('.hero-copy, .hero-actions, .hero-nav', {
        y: 28,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        delay: 0.4,
        ease: 'power3.out'
      });

      gsap.to('.aurora', {
        x: 80,
        y: -50,
        scale: 1.14,
        rotate: 8,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.particle', {
        y: 'random(-80, 80)',
        x: 'random(-80, 80)',
        opacity: 'random(0.2, 0.75)',
        duration: 'random(3, 7)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.08
      });

      gsap.to('.workflow-card', {
        y: -14,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.22
      });

      gsap.to('.workflow-path', {
        strokeDashoffset: -260,
        duration: 5,
        repeat: -1,
        ease: 'none'
      });

      gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((counter) => {
        gsap.fromTo(
          counter,
          { y: 40, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: counter, start: 'top 84%' }
          }
        );
      });

      gsap.to('.workflow-step', {
        y: -16,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
        ease: 'sine.inOut'
      });
    },
    { scope }
  );

  const title = 'Meet Your Autonomous AI Career Agent';

  return (
    <main ref={scope} className="min-h-screen overflow-hidden bg-ink text-mist">
      <section className="relative min-h-screen overflow-hidden px-6">
        <div className="aurora absolute -left-24 top-0 h-[620px] w-[820px] opacity-80" />
        <div className="premium-grid absolute inset-0 opacity-60" />
        {Array.from({ length: 44 }).map((_, index) => (
          <span
            key={index}
            className="particle absolute h-1.5 w-1.5 rounded-full bg-white/60"
            style={{ left: `${(index * 23) % 100}%`, top: `${(index * 37) % 100}%` }}
          />
        ))}
        <nav className="hero-nav relative z-20 mx-auto flex max-w-7xl items-center justify-between py-6">
          <Link to="/" className="font-display text-xl font-bold text-white">CareerPilot AI</Link>
          <div className="hidden items-center gap-8 text-sm text-white/62 md:flex">
            <a href="#demo">Demo</a>
            <a href="#features">Features</a>
            <Link to="/login">Login</Link>
          </div>
        </nav>
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-12 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="hero-copy mb-5 inline-flex rounded-[8px] border border-white/15 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-signal backdrop-blur">
              Autonomous career operating system
            </p>
            <h1 className="font-display text-5xl font-bold leading-[0.98] text-white md:text-7xl xl:text-8xl">
              {title.split('').map((char, index) => (
                <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
                  <span className="hero-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
                </span>
              ))}
            </h1>
            <p className="hero-copy mt-8 max-w-2xl text-lg leading-8 text-white/66 md:text-xl">
              Upload your resume once. Your AI continuously discovers opportunities, analyzes job descriptions, optimizes your resume and sends personalized job recommendations automatically.
            </p>
            <div className="hero-actions mt-9 flex flex-col gap-4 sm:flex-row">
              <MagneticButton>Start Automation</MagneticButton>
              <MagneticButton variant="secondary" icon="play">Watch Demo</MagneticButton>
            </div>
          </div>
          <HeroWorkflow />
        </div>
      </section>
      <StatsSection />
      <LogoMarquee />
      <ProblemSection />
      <div id="features">
        <InteractiveWorkflow />
        <FeatureCards />
      </div>
      <DashboardShowcase />
      <LiveAutomationShowcase />
      <TerminalConsoleSection />
      <TestimonialsAndCta />
    </main>
  );
}
