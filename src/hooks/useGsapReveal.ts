import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 48, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%'
            }
          }
        );
      });
    },
    { scope }
  );
}
