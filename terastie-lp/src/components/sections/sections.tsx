import Image from "next/image";
import { about, completeSet, cta, products, routine, site } from "@/content/site";
import { ButtonLink, Container, Eyebrow, Lines, SectionHeading, cn } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* ------------------------- サービス紹介 ------------------------- */
export function AboutSection() {
  return (
    <section id="about" className="bg-paper py-28 md:py-40">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <Reveal>
            <SectionHeading eyebrow={about.eyebrow} title={about.title} />
            <div className="mt-10 space-y-5 text-[15px] leading-[2.2] tracking-[0.05em] text-ink-soft">
              {about.lead.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
            <Image
              src={completeSet.image}
              alt="TERASTIE の3本（リジェンセラム、トーンアップエッセンス、リッチクリーム）"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
        <ul className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
          {about.points.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="bg-paper p-8 md:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">{p.en}</p>
              <h3 className="mt-3 font-serif text-lg tracking-[0.08em] text-ink">{p.title}</h3>
              <p className="mt-3 text-[13px] leading-[2] text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function LineupSection() {
  return (
    <section id="lineup" className="bg-mist py-28 md:py-40">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Lineup" title="ラインナップ" align="center" />
        </Reveal>
        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08} className="flex flex-col overflow-hidden rounded-2xl bg-white">
              <div className="relative aspect-square">
                <Image src={p.image} alt={`TERASTIE ${p.name}`} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-contain" />
                <span className="absolute left-5 top-4 font-serif text-3xl text-ink/80">{p.step}</span>
              </div>
              <div className="flex flex-1 flex-col border-t border-line p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">{p.en}</p>
                <h3 className="mt-2 font-serif text-[15px] tracking-[0.04em] text-ink xl:text-lg">{p.name}</h3>
                <p className="mt-1 text-xs tracking-[0.08em] text-muted">
                  {p.kind}・{p.volume}
                </p>
                <p className="mt-auto pt-5 font-serif text-2xl tracking-[0.04em] text-ink">
                  {p.price}
                  <span className="ml-1 font-sans text-[11px] text-muted">（税込）</span>
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.24} className="flex flex-col overflow-hidden rounded-2xl bg-ink text-paper">
            <div className="relative aspect-square">
              <Image src={completeSet.image} alt="TERASTIE コンプリートセット" fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/60">{completeSet.en}</p>
              <h3 className="mt-2 font-serif text-lg tracking-[0.08em]">{completeSet.name}</h3>
              <ul className="mt-2 space-y-0.5 text-xs leading-[1.9] text-paper/70">
                {completeSet.contents.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="mt-auto pt-5 font-serif text-2xl tracking-[0.04em]">
                {completeSet.price}
                <span className="ml-1 font-sans text-[11px] text-paper/60">（税込）</span>
              </p>
            </div>
          </Reveal>
        </ul>
        <p className="mt-8 text-center text-xs leading-[2] text-muted">
          価格は公式通販「ヒルズオンライン」の掲載価格です。最新の価格・在庫はショップでご確認ください。
          <br className="hidden sm:block" />
          初めてご購入の方は、ご注文後にオンライン問診へのご回答が必要です。
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href={site.shopUrl} target="_blank" rel="noopener noreferrer">
            ヒルズオンラインで見る
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------- 機能 ------------------------- */
export function FeaturesSection() {
  return (
    <section id="features" className="bg-paper py-28 md:py-40">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Features" title={"それぞれの役割をもつ、\n3つのアイテム。"} align="center" />
        </Reveal>
        <div className="mt-20 space-y-24 md:space-y-32">
          {products.map((p, i) => (
            <article key={p.id} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <Reveal className={cn("relative aspect-square overflow-hidden rounded-2xl bg-white", i % 2 === 1 && "md:order-2")}>
                <Image src={p.image} alt={`TERASTIE ${p.name}`} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-contain" />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                  Step {p.step} — {p.en}
                </p>
                <h3 className="mt-3 font-serif text-[clamp(1.4rem,2.6vw,2rem)] tracking-[0.08em] text-ink">{p.name}</h3>
                <p className="mt-5 text-[15px] leading-[2.1] text-ink-soft">{p.summary}</p>
                <p className="mt-8 text-[11px] tracking-[0.2em] text-muted">おもな配合成分</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.ingredients.map((g) => (
                    <li key={g} className="rounded-full border border-line px-3.5 py-1.5 text-[12px] tracking-[0.04em] text-ink">
                      {g}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-line pt-6">
                  <p className="text-[11px] tracking-[0.2em] text-muted">使い方</p>
                  <p className="mt-2 text-[13px] leading-[2] text-ink-soft">{p.usage}</p>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function RoutineSection() {
  const nameOf = (step: string) => products.find((p) => p.step === step)?.name ?? "";
  return (
    <section id="routine" className="bg-ink py-28 text-paper md:py-40">
      <Container>
        <Reveal>
          <Eyebrow className="text-silver">{routine.eyebrow}</Eyebrow>
          <h2 className="jp-balance mt-3 font-serif text-[clamp(1.45rem,3.2vw,2.5rem)] leading-[1.6] tracking-[0.06em]">
            <Lines text={routine.title} />
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {routine.basic.map((r, i) => (
            <Reveal key={r.time} delay={i * 0.1} className="rounded-2xl border border-paper/15 p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-silver">{r.time}</p>
              <p className="mt-1 font-serif text-2xl tracking-[0.1em]">
                {r.label}・{r.steps.length}ステップ
              </p>
              <ol className="mt-6 flex flex-wrap items-center gap-3">
                {r.steps.map((s, k) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="flex items-center gap-3 rounded-full bg-paper/10 py-2 pl-2 pr-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper font-serif text-ink">{s}</span>
                      <span className="text-[13px] tracking-[0.06em]">{nameOf(s)}</span>
                    </span>
                    {k < r.steps.length - 1 && <span aria-hidden className="text-silver">→</span>}
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-5 rounded-2xl bg-paper/5 p-8">
          <h3 className="font-serif text-lg tracking-[0.08em]">{routine.sensitive.title}</h3>
          <p className="mt-3 text-[13px] leading-[2] text-paper/75">{routine.sensitive.body}</p>
          <p className="mt-4 text-[12px] leading-[1.9] text-paper/55">※ {routine.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------- CTA ------------------------- */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-stage py-32 md:py-44">
      <div aria-hidden className="absolute inset-0 bg-[url('/frames/frame_0100.jpg')] bg-cover bg-center opacity-40" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-stage/70 via-stage/40 to-stage/80" />
      <Container narrow className="relative text-center">
        <Reveal>
          <Eyebrow>{cta.eyebrow}</Eyebrow>
          <h2 className="jp-balance mt-4 font-serif text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.6] tracking-[0.06em] text-ink">
            <Lines text={cta.title} />
          </h2>
          <p className="mt-6 text-sm leading-[2] tracking-[0.06em] text-ink-soft">{cta.body}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={cta.primary.href} size="lg" target="_blank" rel="noopener noreferrer">
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink href={cta.secondary.href} size="lg" variant="outline" target="_blank" rel="noopener noreferrer">
              {cta.secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink px-4 py-14 text-center text-xs leading-[2] text-paper/60">
      <p className="font-serif text-lg tracking-[0.3em] text-paper">TERASTIE</p>
      <p className="mt-2 tracking-[0.12em]">
        {site.clinic}（{site.clinicArea}）
      </p>
      <p className="mt-4">
        {site.maker}
        <br />
        {site.seller}
      </p>
      <p className="mx-auto mt-6 max-w-2xl">
        ※ ヒーローの映像は商品をもとにしたイメージCGです。※ 効果には個人差があります。
        <br />
        ※ 掲載内容は公式通販の情報をもとに作成した制作用の案です。公開前に、価格・表記を公式情報および医療広告ガイドライン・薬機法の観点でご確認ください。
      </p>
      <p className="mt-6 tracking-[0.12em]">© {site.clinic}</p>
    </footer>
  );
}
