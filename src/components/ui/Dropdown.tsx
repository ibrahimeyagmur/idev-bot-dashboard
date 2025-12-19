import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  icon?: ReactNode;
}

export function Dropdown({ label, items, icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
      >
        {icon}
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 py-2 bg-[#171821] rounded-xl border border-white/10 shadow-xl shadow-black/20 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
