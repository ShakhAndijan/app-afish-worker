import { C } from './theme';
import { DEFAULT_SPECS, DEFAULT_SERVICES, DEFAULT_TIMES, DEFAULT_CERTS, DEFAULT_REVIEWS, DEFAULT_WORKS, ratingBarsFor } from './data';

/** Usta ma'lumotini (yoki standart qiymatlarni) ekran uchun tayyor ko'rinishga keltiradi. */
export function getUstaDetailView(usta, { selectedSpec, reviewFilter }) {
  const initial = usta?.initial || 'A';
  const name = usta?.name || 'Alisher Usmonov';
  const trade = usta?.trade || usta?.profession || 'Santexnik';
  const rawRating = usta?.rating;
  const rating =
    typeof rawRating === 'number' ? rawRating.toFixed(1) : rawRating || '4.9';
  const jobs = String(usta?.jobs || '184');
  const bgColor = usta?.bgColor || usta?.color || C.orange;
  const location = usta?.location || 'Chilonzor';
  const experience = usta?.experience || '7 yil';
  const repeatRate = usta?.repeatRate || '98%';
  const reviewCount = usta?.reviewCount || jobs;
  const startingPrice = usta?.startingPrice || '30 000';
  const reviews = usta?.reviews || DEFAULT_REVIEWS;
  const works = usta?.works || DEFAULT_WORKS;
  const specs = usta?.specializations || DEFAULT_SPECS;
  const services = usta?.services || DEFAULT_SERVICES;
  const times = usta?.availableTimes || DEFAULT_TIMES;
  const certs = usta?.certificates || DEFAULT_CERTS;

  const bySpec = (item) => !selectedSpec || item.spec === selectedSpec;
  const specServices = services.filter(bySpec);
  const specTimes = times.filter(bySpec);
  const specCerts = certs.filter(bySpec);
  const specWorks = works.filter(bySpec);
  const specReviews = reviews.filter(bySpec);

  const bars = usta?.ratingBars || ratingBarsFor(specReviews);
  const ratingValue = specReviews.length
    ? (
        specReviews.reduce((sum, r) => sum + r.rating, 0) / specReviews.length
      ).toFixed(1)
    : rating;
  const ratingCount = selectedSpec ? specReviews.length : reviewCount;

  const shownReviews =
    reviewFilter === 'photo'
      ? specReviews.filter((r) => r.hasPhoto)
      : specReviews;

  return {
    initial,
    name,
    trade,
    rating,
    jobs,
    bgColor,
    location,
    experience,
    repeatRate,
    reviewCount,
    startingPrice,
    specs,
    specServices,
    specTimes,
    specCerts,
    specWorks,
    bars,
    ratingValue,
    ratingCount,
    shownReviews,
  };
}
