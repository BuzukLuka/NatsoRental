"use client";
import { useId, useState, useRef, useEffect } from "react";

type TabItem = { value: string; label: string; icon?: React.ReactNode };

export function Tabs({
  tabs,
  value,
  onChange,
  className = "",
}: {
  tabs: TabItem[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [barStyle, setBarStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLButtonElement>(
      `button[data-value="${value}"]`
    );
    if (!active) return;
    const parent = listRef.current!.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    setBarStyle({ left: rect.left - parent.left, width: rect.width });
  }, [value, tabs]);

  // keyboard nav (← →)
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = tabs.findIndex((t) => t.value === value);
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % tabs.length;
      onChange(tabs[next].value);
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + tabs.length) % tabs.length;
      onChange(tabs[prev].value);
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Profile sections"
        onKeyDown={onKeyDown}
        ref={listRef}
        className="relative flex gap-2 overflow-x-auto rounded-xl border border-black/10 bg-white p-1"
      >
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              role="tab"
              id={`${id}-${t.value}`}
              aria-selected={active}
              aria-controls={`${id}-${t.value}-panel`}
              data-value={t.value}
              onClick={() => onChange(t.value)}
              className={`relative z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition
                ${active ? "text-black" : "text-black/60 hover:text-black"}`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}

        {/* sliding indicator */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1 top-1 rounded-lg bg-brand-yellow transition-all"
          style={{ left: barStyle.left, width: barStyle.width }}
        />
      </div>
    </div>
  );
}

export function TabPanel({
  value,
  activeValue,
  children,
  labelledBy,
}: {
  value: string;
  activeValue: string;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const hidden = value !== activeValue;
  return (
    <div
      role="tabpanel"
      id={`${labelledBy}-panel`}
      aria-labelledby={labelledBy}
      hidden={hidden}
      className={`transition-opacity ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      {!hidden && children}
    </div>
  );
}
