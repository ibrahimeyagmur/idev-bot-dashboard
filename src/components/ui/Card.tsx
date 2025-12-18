import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div
      className={`
        bg-[#171821] rounded-xl border border-white/10 p-6
        ${hover ? 'transition-all duration-300 hover:border-[#675de6]/50 hover:shadow-lg hover:shadow-[#675de6]/10' : ''}
        ${glow ? 'shadow-lg shadow-[#675de6]/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
