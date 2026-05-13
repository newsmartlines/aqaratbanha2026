import React from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const [, navigate] = useLocation();

  const all = [{ label: "الرئيسية", href: "/" }, ...items];

  return (
    <div className="flex items-center gap-1 text-xs font-medium whitespace-nowrap overflow-x-auto scrollbar-none py-2">
      {all.map((item, i) => {
        const isLast = i === all.length - 1;
        return (
          <React.Fragment key={i}>
            {i === 0 ? (
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 text-gray-400 hover:text-[#123C79] transition-colors flex-shrink-0"
              >
                <Home className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            ) : isLast ? (
              <span className="text-[#123C79] font-bold flex-shrink-0 truncate max-w-[160px]">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => item.href && navigate(item.href)}
                className="text-gray-400 hover:text-[#123C79] transition-colors flex-shrink-0"
              >
                {item.label}
              </button>
            )}
            {!isLast && <ChevronLeft className="w-3 h-3 text-gray-300 flex-shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
