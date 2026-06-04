import { SVGProps } from "react";

export function WizardWandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* Elder wand core stick */}
      <path d="M4 20L20 4" strokeWidth="2.5" />
      
      {/* Nodules/bumps along the wand to make it look like carved wood */}
      <path d="M6 18c-1.5-1.5 1-4 2.5-2.5 M10 14c-1.5-1.5 1-4 2.5-2.5 M14 10c-1.5-1.5 1-4 2.5-2.5" strokeWidth="2" />
      
      {/* Magical starburst/sparkle effect at the tip */}
      <path d="M20 0v3M23 3h-3M17 3h3M20 6V3" strokeWidth="1" className="animate-pulse" />
      <circle cx="20" cy="3" r="1" fill="currentColor" className="animate-pulse" />
    </svg>
  );
}
