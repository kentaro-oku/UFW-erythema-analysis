"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { frameSequence, heroBeats, type Beat } from "@/content/site";
import { ButtonLink, Eyebrow, Lines, cn } from "@/components/ui/primitives";

const { count: FRAME_COUNT, path: framePath, background: BG } = frameSequence;
const PORTRAIT_FILM_RATIO = 0.6; // share of the viewport height the film takes on portrait screens

export function FrameSequenceHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  const draw = useCallback(() => {
    rafRef.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // nearest frame that is ready
    const idx = currentRef.current;
    let img: HTMLImageElement | undefined;
    for (let d = 0; d < FRAME_COUNT && !img; d++) {
      for (const j of [idx - d, idx + d]) {
        const c = imagesRef.current[j];
        if (c && c.complete && c.naturalWidth) { img = c; break; }
      }
    }
    if (!img) return;

    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);

    if (cw / ch < 0.9) {
      // portrait: film in the upper part, copy sits below it
      const areaH = ch * PORTRAIT_FILM_RATIO;
      const s = Math.max(cw / iw, areaH / ih);
      const w = iw * s, h = ih * s;
      const y = Math.min(0, areaH - h);
      ctx.drawImage(img, (cw - w) / 2, y, w, h);
      const fadeTop = y + h * 0.72;
      const g = ctx.createLinearGradient(0, fadeTop, 0, y + h);
      g.addColorStop(0, "rgba(228,216,194,0)");
      g.addColorStop(1, BG);
      ctx.fillStyle = g;
      ctx.fillRect(0, fadeTop, cw, y + h - fadeTop + 1);
    } else {
      const s = Math.max(cw / iw, ch / ih);
      const w = iw * s, h = ih * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
  }, []);

  const requestDraw = useCallback(() => {
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useMotionValueEvent(frameIndex, "change", (v) => {
    const next = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(v)));
    if (next !== currentRef.current) {
      currentRef.current = next;
      requestDraw();
    }
  });

  // Retina-aware canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      requestDraw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [requestDraw]);

  // Preload: first frame first, then the rest
  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          if (cancelled) return resolve();
          done++;
          setLoaded(done);
          if (Math.abs(i - currentRef.current) < 2) requestDraw();
          resolve();
        };
        img.src = framePath(i);
        imagesRef.current[i] = img;
      });
    load(0).then(() => {
      for (let i = 1; i < FRAME_COUNT; i++) void load(i);
    });
    return () => {
      cancelled = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null; // otherwise requestDraw() would never schedule again
    };
  }, [requestDraw]);

  const progress = loaded / FRAME_COUNT;

  return (
    <section ref={sectionRef} id="top" aria-label="TERASTIE の紹介" className="relative h-[500vh] bg-sand">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        {/* soft light veil to keep copy legible */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(120,95,65,0.18)_100%)]"
        />

        {/* loading bar */}
        <div
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-sand transition-opacity duration-700",
            progress >= 0.35 && "pointer-events-none opacity-0",
          )}
          role="status"
          aria-live="polite"
        >
          <span className="font-serif text-2xl tracking-[0.3em] text-ink">TERASTIE</span>
          <span className="h-px w-48 overflow-hidden bg-ink/15">
            <span className="block h-full bg-gold transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
          </span>
          <span className="font-mono text-xs tracking-[0.2em] text-taupe">{Math.round(progress * 100)}%</span>
        </div>

        {heroBeats.map((b) => (
          <HeroBeat key={b.id} beat={b} progress={scrollYProgress} />
        ))}

        <ScrollCue progress={scrollYProgress} />

        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-ink/10" aria-hidden>
          <motion.div className="h-full origin-left bg-gold" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

function HeroBeat({ beat, progress }: { beat: Beat; progress: MotionValue<number> }) {
  const [s, e] = beat.range;
  const f = 0.04;
  const first = s <= 0;
  const last = e >= 1;
  // keyframe offsets must stay inside 0..1 and be strictly increasing
  // (framer-motion may hand this to a scroll-driven WAAPI animation)
  const [input, output] = first
    ? [[0, e - f, e], [1, 1, 0]]
    : last
      ? [[s, s + f, 1], [0, 1, 1]]
      : [[s, s + f, e - f, e], [0, 1, 1, 0]];
  const opacity = useTransform(progress, input, output);
  const y = useTransform(opacity, [0, 1], [24, 0]);
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"));

  const placement = {
    left: "md:left-[5vw] md:top-[22%] md:w-[min(38rem,46vw)] md:text-left",
    right: "md:left-auto md:right-[5vw] md:top-[22%] md:w-[min(38rem,46vw)] md:text-right",
    top: "md:left-0 md:right-0 md:top-[13%] md:mx-auto md:w-[min(44rem,90vw)] md:text-center",
  }[beat.placement];

  const Title = beat.id === "intro" ? "h1" : "h2";

  return (
    <motion.div
      style={{ opacity, y, visibility }}
      className={cn(
        // mobile: copy sits in the area below the film
        "absolute inset-x-4 bottom-[max(2.5rem,5svh)] text-left",
        "md:inset-x-auto md:bottom-auto",
        placement,
      )}
    >
      <div
        className={cn(
          "md:rounded-2xl md:p-8",
          beat.placement !== "top" && "md:bg-ivory/55 md:shadow-[0_20px_60px_-30px_rgba(60,40,20,0.35)] md:backdrop-blur-md",
        )}
      >
        <Eyebrow>{beat.eyebrow}</Eyebrow>
        <Title className="jp-balance mt-3 font-serif text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.5] tracking-[0.06em] text-ink">
          <Lines text={beat.title} />
        </Title>
        {beat.body && <p className="mt-4 text-sm leading-[2] tracking-[0.08em] text-ink-soft md:text-[15px]">{beat.body}</p>}
        {beat.cta && (
          <div className={cn("mt-6 flex flex-wrap gap-3", beat.placement === "right" ? "md:justify-end" : beat.placement === "top" && "md:justify-center")}>
            <ButtonLink href="#lineup">ラインナップを見る</ButtonLink>
            <ButtonLink href="#faq" variant="outline">
              よくある質問
            </ButtonLink>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.06], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      aria-hidden
      className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-taupe">Scroll</span>
      <motion.span
        className="block h-10 w-px origin-top bg-taupe"
        animate={{ scaleY: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
