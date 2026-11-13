
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div
   

    
className="
rounded-2xl
border-2 border-gray-200
bg-white
p-4 sm:p-6
shadow-sm
transition-all duration-300 ease-in-out

hover:-translate-y-1
hover:border-blue-800
hover:shadow-xl

active:scale-[0.98]
active:border-blue-800

dark:border-gray-700
dark:bg-gray-900
dark:shadow-lg
dark:hover:border-blue-500
dark:hover:shadow-blue-900/30
dark:active:border-blue-500
"

  
    >
      {children}
    </div>
  );
}
