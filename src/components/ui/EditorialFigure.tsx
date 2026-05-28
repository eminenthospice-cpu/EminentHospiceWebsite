import Image from 'next/image';
import { useLocale } from 'next-intl';
import { imageSlots, type ImageSlotKey } from '@/lib/imageSlots';
import { cn } from '@/lib/cn';

const ASPECT_CLASS: Record<'3/4' | '4/5' | '4/3' | '5/6', string> = {
  '3/4': 'aspect-[3/4]',
  '4/5': 'aspect-[4/5]',
  '4/3': 'aspect-[4/3]',
  '5/6': 'aspect-[5/6]',
};

const BLEED_CLASS: Record<'none' | 'left' | 'right', string> = {
  none: '',
  left: 'xl:-ml-8',
  right: 'xl:-mr-8',
};

export interface EditorialFigureProps {
  slot: ImageSlotKey;
  aspect: '3/4' | '4/5' | '4/3' | '5/6';
  caption?: string;
  bleed?: 'none' | 'left' | 'right';
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}

export function EditorialFigure({
  slot: slotKey,
  aspect,
  caption,
  bleed = 'none',
  priority = false,
  sizes = '(min-width: 1024px) 42vw, 100vw',
  className,
  imageClassName,
}: EditorialFigureProps) {
  const locale = useLocale();
  const slot = imageSlots[slotKey];
  const alt = locale === 'ko' ? slot.alt.ko : slot.alt.en;

  return (
    <figure className={cn(BLEED_CLASS[bleed], className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-organic bg-neutral-100 shadow-soft',
          ASPECT_CLASS[aspect],
        )}
      >
        <Image
          src={slot.src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={slot.blurDataURL}
          className={cn('object-cover', imageClassName)}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 pt-3 border-t border-line-soft">
          <p className="text-marginalia uppercase tracking-[0.14em] text-ink-500 font-body">
            {caption}
          </p>
          {slot.credit ? (
            <p className="mt-1 text-marginalia text-ink-300">{slot.credit}</p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
