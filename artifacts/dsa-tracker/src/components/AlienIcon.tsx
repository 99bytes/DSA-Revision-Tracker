import * as React from "react";
import { cn } from "@/lib/utils";

export function AlienIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 11 8" 
      className={cn("fill-current", className)} 
      {...props}
    >
      <path d="M2,0 h1 v1 h-1 z M8,0 h1 v1 h-1 z M3,1 h1 v1 h-1 z M7,1 h1 v1 h-1 z M2,2 h7 v1 h-7 z M1,3 h2 v1 h-2 z M4,3 h3 v1 h-3 z M8,3 h2 v1 h-2 z M0,4 h11 v1 h-11 z M0,5 h1 v1 h-1 z M2,5 h7 v1 h-7 z M10,5 h1 v1 h-1 z M0,6 h1 v1 h-1 z M2,6 h1 v1 h-1 z M8,6 h1 v1 h-1 z M10,6 h1 v1 h-1 z M3,7 h2 v1 h-2 z M6,7 h2 v1 h-2 z" />
    </svg>
  );
}
