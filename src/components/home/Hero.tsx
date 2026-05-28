import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { Badge } from '@/components/ui/primitives/Badge';
import { Button } from '@/components/ui/primitives/Button';
import { Reveal } from '@/components/motion/Reveal';
import { EditorialFigure } from '@/components/ui/EditorialFigure';

function EditorialHeadline({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, lineIndex) => {
        const words = line.trim().split(/\s+/);
        const first = words[0] ?? '';
        const rest = words.slice(1).join(' ');
        return (
          <span key={lineIndex} className={lineIndex > 0 ? 'block' : undefined}>
            <span className="italic">{first}</span>
            {rest ? ` ${rest}` : ''}
          </span>
        );
      })}
    </>
  );
}

export function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const eyebrow = locale === 'ko' ? '로스앤젤레스 호스피스 케어' : 'Hospice Care · Los Angeles County';

  return (
    <SectionContainer
      bg="warm"
      ariaLabelledBy="hero-heading"
      className="relative overflow-hidden bg-surface-paper"
      innerClassName="!py-14 md:!py-20 lg:!py-24"
    >
      <div className="relative grid grid-cols-1 min-w-0 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
        <Reveal immediate className="min-w-0 lg:relative lg:z-10 xl:-mr-8">
          <Badge variant="warm" className="mb-6">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-warm-500" aria-hidden="true" />
            {eyebrow}
          </Badge>

          <h1
            id="hero-heading"
            className="font-heading text-display-xl sm:text-display-2xl lg:text-display-3xl text-ink-900 mb-6 whitespace-pre-line max-w-full"
          >
            <EditorialHeadline text={t('heading')} />
          </h1>

          <p className="font-prose text-lead text-ink-700 max-w-prose-narrow mb-8">
            {t('subtext')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button asChild variant="cta" size="lg">
              <Link href="/understanding-hospice">
                {t('ctaPrimary')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-primary-700">
              <Link href="/contact">
                <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                {t('ctaSecondary')}
              </Link>
            </Button>
          </div>
        </Reveal>

        <Reveal immediate delay={0.08} className="relative">
          <EditorialFigure
            slot="homeHero"
            aspect="3/4"
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <p className="mt-4 pt-3 border-t border-line-soft text-marginalia uppercase tracking-[0.14em] text-ink-500">
            {t('caption')}
          </p>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
