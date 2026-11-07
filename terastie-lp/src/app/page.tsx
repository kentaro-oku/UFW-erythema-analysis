import { FrameSequenceHero } from "@/components/hero/frame-sequence-hero";
import { SiteHeader } from "@/components/layout/site-header";
import { FaqSection } from "@/components/sections/faq-section";
import { AboutSection, CtaSection, FeaturesSection, LineupSection, SiteFooter } from "@/components/sections/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* ヒーロー（public/frames の100枚をスクロールでコマ送り） */}
        <FrameSequenceHero />
        {/* サービス紹介 */}
        <AboutSection />
        <LineupSection />
        {/* 機能 */}
        <FeaturesSection />
        {/* FAQ */}
        <FaqSection />
        {/* CTA */}
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
