import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children, narrow }: { className?: string; children: ReactNode; narrow?: boolean }) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6", narrow ? "max-w-3xl" : "max-w-6xl", className)}>{children}</div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-serif text-sm italic tracking-[0.18em] text-silver-deep", className)}>{children}</p>
  );
}

/** Renders "\n" in copy as line breaks. */
export function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="jp-balance mt-3 font-serif text-[clamp(1.45rem,3.2vw,2.5rem)] leading-[1.6] tracking-[0.06em] text-ink">
        <Lines text={title} />
      </h2>
    </div>
  );
}

type ButtonProps = ComponentPropsWithoutRef<"a"> & { variant?: "solid" | "outline"; size?: "md" | "lg" };

export function ButtonLink({ variant = "solid", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-medium tracking-[0.14em] transition duration-300 ease-out-soft hover:-translate-y-0.5",
        size === "lg" ? "min-h-14 px-10 text-[15px]" : "min-h-12 px-7 text-sm",
        variant === "solid"
          ? "border-ink bg-ink text-paper hover:bg-ink-soft"
          : "border-ink/30 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
