import { about, clinicPoints, cta, ingredients, products, roles, site } from "@/content/site";
import { ButtonLink, Container, Eyebrow, Lines, SectionHeading, cn } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* ------------------------- サービス紹介 ------------------------- */
export function AboutSection() {
  return (
    <section id="about" className="bg-ivory py-28 md:py-40">
      <Container narrow>
        <Reveal>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 space-y-5 text-[15px] leading-[2.2] tracking-[0.05em] text-ink-soft md:text-base">
            {about.lead.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function LineupSection() {
  return (
    <section id="lineup" className="bg-cream py-28 md:py-40">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Lineup" title="ラインナップ" align="center" />
        </Reveal>
        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
          {products.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              delay={i * 0.08}
              className={cn(
                "flex flex-col rounded-2xl border p-7",
                p.featured ? "border-ink bg-ink text-ivory" : "border-line bg-ivory",
              )}
            >
              <span className={cn("font-mono text-[11px] uppercase tracking-[0.25em]", p.featured ? "text-gold" : "text-gold-deep")}>
                {p.kind}
              </span>
              <h3 className="jp-balance mt-4 font-serif text-lg leading-[1.7] tracking-[0.06em]">
                <Lines text={p.name} />
              </h3>
              <p className={cn("mt-4 flex-1 text-[13px] leading-[2]", p.featured ? "text-ivory/80" : "text-ink-soft")}>
                {p.description}
              </p>
              {p.note && (
                <p className={cn("mt-4 border-t pt-4 text-[12px] leading-[1.9]", p.featured ? "border-ivory/20 text-ivory/70" : "border-line text-taupe")}>
                  {p.note}
                </p>
              )}
              <p className="mt-6 font-serif text-2xl tracking-[0.04em]">{p.price}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs leading-[2] text-taupe">
          価格は公式オンラインショップの掲載価格です。最新の価格・在庫はショップでご確認ください。
          <br className="hidden sm:block" />
          一部の商品は、購入前にオンライン問診（無料）が必要です。
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href={site.shopUrl} target="_blank" rel="noopener noreferrer">
            オンラインショップで見る
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------- 機能 ------------------------- */
export function FeaturesSection() {
  return (
    <section id="features" className="bg-ivory py-28 md:py-40">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Features" title={"3つの役割で、\n毎日のケアを組み立てる。"} align="center" />
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
          {roles.map((r, i) => (
            <Reveal key={r.no} delay={i * 0.1} className="bg-ivory p-8 md:p-10">
              <span className="font-serif text-4xl italic text-gold">{r.no}</span>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-taupe">{r.en}</p>
              <h3 className="mt-2 font-serif text-xl tracking-[0.1em] text-ink">{r.title}</h3>
              <p className="mt-4 text-sm leading-[2] text-ink-soft">{r.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid items-start gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <Reveal>
            <Eyebrow>Ingredients</Eyebrow>
            <h3 className="jp-balance mt-3 font-serif text-2xl leading-[1.7] tracking-[0.06em] text-ink">
              TERASTIE 1 の
              <br />
              おもな配合成分
            </h3>
            <p className="mt-5 text-sm leading-[2] text-ink-soft">
              シリーズの土台となるトーンアップエッセンス。高濃度のトラネキサム酸を核に、肌をいたわる成分を組み合わせています。
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="border-t border-line">
              {ingredients.map((g) => (
                <li key={g.name} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-5">
                  <span className="font-serif text-lg tracking-[0.08em] text-ink">{g.name}</span>
                  {g.note && <span className="text-xs tracking-[0.06em] text-taupe">{g.note}</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-5 md:grid-cols-3">
          {clinicPoints.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1} className="rounded-2xl bg-cream p-8">
              <span className="block h-px w-10 bg-gold" />
              <h3 className="mt-6 font-serif text-lg tracking-[0.08em] text-ink">{c.title}</h3>
              <p className="mt-3 text-[13px] leading-[2] text-ink-soft">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------- CTA ------------------------- */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-32 text-ivory md:py-44">
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/frames/frame_0100.jpg')] bg-cover bg-center opacity-[0.18] mix-blend-luminosity"
      />
      <Container narrow className="relative text-center">
        <Reveal>
          <Eyebrow className="text-gold">{cta.eyebrow}</Eyebrow>
          <h2 className="jp-balance mt-4 font-serif text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.6] tracking-[0.06em]">
            <Lines text={cta.title} />
          </h2>
          <p className="mt-6 text-sm leading-[2] tracking-[0.06em] text-ivory/75">{cta.body}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-ivory px-10 text-[15px] font-medium tracking-[0.14em] text-ink transition hover:-translate-y-0.5 hover:bg-cream"
            >
              {cta.primary.label}
            </a>
            <a
              href={cta.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-ivory/40 px-10 text-[15px] tracking-[0.14em] text-ivory transition hover:-translate-y-0.5 hover:border-ivory"
            >
              {cta.secondary.label}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#1d1813] px-4 py-14 text-center text-xs leading-[2] text-ivory/60">
      <p className="font-serif text-lg tracking-[0.3em] text-ivory">TERASTIE</p>
      <p className="mt-2 tracking-[0.12em]">
        {site.clinic}（{site.clinicArea}）
      </p>
      <p className="mx-auto mt-6 max-w-2xl">
        ※ ヒーローの映像はイメージCGで、実際のパッケージとは異なります。
        <br />
        ※ 掲載内容は公開情報をもとに作成した制作用の案です。公開前に、価格・表記を公式情報および医療広告ガイドライン・薬機法の観点でご確認ください。
      </p>
      <p className="mt-6 tracking-[0.12em]">© {site.clinic}</p>
    </footer>
  );
}
