import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectBoxProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
  className?: string;
}

const SelectBox = ({ value, onChange, options, className }: SelectBoxProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className={cn('relative w-40', className)} ref={ref}>
      {/* 셀렉트 박스 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-input-background px-3 py-2 text-sm text-left whitespace-nowrap',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'h-9 transition-colors',
        )}
      >
        <span className={cn(!selectedLabel && 'text-muted-foreground')}>{selectedLabel || 'Select...'}</span>
        <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {/* 드롭 다운 */}
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
          )}
        >
          <ul className="max-h-60 flex flex-col overflow-y-auto p-1 gap-1">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  className={cn(
                    'relative flex w-full items-center justify-between gap-2 px-2 py-1.5 text-sm rounded-sm',
                    'hover:bg-accent hover:text-accent-foreground transition-colors',
                    value === opt.value && 'bg-accent/60 text-accent-foreground',
                  )}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                  {value === opt.value && <Check className="size-4 text-muted-foreground absolute right-2" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectBox;
