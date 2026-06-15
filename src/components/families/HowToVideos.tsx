import { useTranslations } from 'next-intl';

type VideoKey = 'oxygen' | 'medications' | 'suction' | 'nebulizer';

// Caregiver training videos recorded by the Eminent team (sourced from the
// existing eminenthospice.com "How to Videos (Korean)" page). The `start`
// offsets match the live site's embeds, skipping pre-roll dead air.
const VIDEOS: { key: VideoKey; youtubeId: string; start: number }[] = [
  { key: 'oxygen',      youtubeId: 'Vq5rIpelzhk', start: 67 },
  { key: 'medications', youtubeId: 'Rv1Cbnb4QDA', start: 0 },
  { key: 'suction',     youtubeId: '9g98EDnOAUI', start: 0 },
  { key: 'nebulizer',   youtubeId: 'edmwae3Iglk', start: 5 },
];

export function HowToVideos() {
  const t = useTranslations('forFamilies.sections.videos');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {VIDEOS.map(({ key, youtubeId, start }) => {
        const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0${start > 0 ? `&start=${start}` : ''}`;
        return (
          <div key={key} className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="aspect-video">
              <iframe
                src={src}
                title={t(`items.${key}.koreanTitle`)}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold text-text-primary mb-1">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm text-text-secondary" lang="ko">
                {t(`items.${key}.koreanTitle`)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
