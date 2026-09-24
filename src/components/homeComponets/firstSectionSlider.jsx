import React, { useCallback, useEffect, useState } from 'react'

// Replace these slides with your real collections, images and copy.
// image: use a 1600x900 (or larger) landscape image for best results.
const slides = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/fss-newin/1600/900',
    kicker: 'New In',
    heading: 'Fresh Styles, Every Week',
    description:
      'Discover pieces made for the way you actually live — versatile, comfortable, effortlessly stylish.',
    ctaLabel: 'Shop New Arrivals',
    ctaHref: '#',
    trust: '★★★★★ 4.8 · 70,000+ happy customers',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/fss-western/1600/900',
    kicker: 'Just Dropped',
    heading: 'Western Fits, Reimagined',
    description:
      'Tops and bottoms designed to mix, match and move with you all day long.',
    ctaLabel: 'Explore Western Wear',
    ctaHref: '#',
    trust: 'Our most re-ordered western edit yet',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/fss-unstitched/1600/900',
    kicker: 'Fabric First',
    heading: 'Pure Cotton, Every Metre',
    description:
      'Breathable fabric and fresh prints — your next favourite outfit starts here.',
    ctaLabel: 'Shop Unstitched',
    ctaHref: '#',
    trust: '4.9/5 rated by our customers',
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/fss-occasion/1600/900',
    kicker: 'Occasion Ready',
    heading: 'Grace In Every Detail',
    description:
      'Intricate embroidery and rich fabric for the moments that matter most.',
    ctaLabel: 'Shop the Collection',
    ctaHref: '#',
    trust: '★★★★★ 4.9 · 20,000+ happy customers',
  },
  {
    id: 5,
    image: 'https://picsum.photos/seed/fss-luxury/1600/900',
    kicker: 'Elevated Essentials',
    heading: 'Luxury You Can Feel',
    description:
      'Premium embroidery and considered tailoring — ready-to-wear that feels timeless.',
    ctaLabel: 'Discover Luxury Pret',
    ctaHref: '#',
    trust: '★★★★★ 4.8 · 30,500+ shoppers',
  },
  {
    id: 6,
    image: 'https://picsum.photos/seed/fss-menswear/1600/900',
    kicker: 'For Him',
    heading: 'Classic Looks, Modern Comfort',
    description:
      'Premium fabric and clean cuts that move easily from home to event.',
    ctaLabel: 'Shop Menswear',
    ctaHref: '#',
    trust: '★★★★★ 4.8 · 100,000+ satisfied customers',
  },
]

const AUTOPLAY_DELAY = 3000

const firstSectionSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = useCallback((index) => {
    setActiveIndex((index + slides.length) % slides.length)
  }, [])

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }, [])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(goToNext, AUTOPLAY_DELAY)
    return () => clearInterval(timer)
  }, [goToNext])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') goToNext()
    if (event.key === 'ArrowLeft') goToPrev()
  }

  const activeSlide = slides[activeIndex]

  return (
    <section
      className="fss"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onKeyDown={handleKeyDown}
    >
      <div
        className="fss__track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`fss__slide${
              index === activeIndex ? ' fss__slide--active' : ''
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={index !== activeIndex}
          >
            <div className="fss__overlay" />
            <div className="fss__content">
              <span className="fss__kicker">{slide.kicker}</span>
              <h2 className="fss__heading">{slide.heading}</h2>
              <p className="fss__description">{slide.description}</p>
              <a className="fss__cta" href={slide.ctaHref}>
                {slide.ctaLabel}
              </a>
              <p className="fss__trust">{slide.trust}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="fss__arrow fss__arrow--prev"
        aria-label="Previous slide"
        onClick={goToPrev}
      >
        ‹
      </button>
      <button
        type="button"
        className="fss__arrow fss__arrow--next"
        aria-label="Next slide"
        onClick={goToNext}
      >
        ›
      </button>

      <div className="fss__dots" role="tablist" aria-label="Slide navigation">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            className={`fss__dot${
              index === activeIndex ? ' fss__dot--active' : ''
            }`}
            aria-selected={index === activeIndex}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <span className="fss__sr-live" aria-live="polite">
        {`Showing slide ${activeIndex + 1} of ${slides.length}: ${activeSlide.heading}`}
      </span>

      <style>{`
        .fss {
          position: relative;
          width: 100%;
          height: 640px;
          max-height: 86vh;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          isolation: isolate;
        }

        .fss__track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 900ms ease;
          will-change: transform;
        }

        .fss__slide {
          position: relative;
          flex: 0 0 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
        }

        .fss__slide--active {
          z-index: 1;
        }

        .fss__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(12, 10, 9, 0.72) 0%,
            rgba(12, 10, 9, 0.38) 45%,
            rgba(12, 10, 9, 0.05) 75%
          );
        }

        .fss__content {
          position: relative;
          z-index: 2;
          max-width: 520px;
          padding: 0 6vw;
          color: #fbf7f2;
        }

        .fss__kicker {
          display: inline-block;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          color: #d9b98a;
          margin-bottom: 0.9rem;
        }

        .fss__heading {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.15;
          margin: 0 0 0.9rem;
          font-weight: 600;
        }

        .fss__description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(251, 247, 242, 0.86);
          margin: 0 0 1.6rem;
          max-width: 420px;
        }

        .fss__cta {
          display: inline-block;
          padding: 0.85rem 2rem;
          background: #fbf7f2;
          color: #171310;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          border-radius: 2px;
          transition: background 200ms ease, color 200ms ease, transform 200ms ease;
        }

        .fss__cta:hover {
          background: #6e2a3a;
          color: #fbf7f2;
          transform: translateY(-1px);
        }

        .fss__cta:focus-visible {
          outline: 2px solid #d9b98a;
          outline-offset: 3px;
        }

        .fss__trust {
          margin: 1.6rem 0 0;
          font-size: 0.85rem;
          color: rgba(251, 247, 242, 0.75);
        }

        .fss__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(251, 247, 242, 0.4);
          background: rgba(12, 10, 9, 0.25);
          color: #fbf7f2;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 200ms ease, border-color 200ms ease;
        }

        .fss__arrow:hover {
          background: rgba(12, 10, 9, 0.5);
          border-color: rgba(251, 247, 242, 0.8);
        }

        .fss__arrow:focus-visible {
          outline: 2px solid #d9b98a;
          outline-offset: 2px;
        }

        .fss__arrow--prev {
          left: 24px;
        }

        .fss__arrow--next {
          right: 24px;
        }

        .fss__dots {
          position: absolute;
          bottom: 26px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 10px;
        }

        .fss__dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          border: 1px solid rgba(251, 247, 242, 0.6);
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: background 200ms ease, width 200ms ease;
        }

        .fss__dot--active {
          background: #fbf7f2;
          width: 22px;
          border-radius: 5px;
        }

        .fss__dot:focus-visible {
          outline: 2px solid #d9b98a;
          outline-offset: 2px;
        }

        .fss__sr-live {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .fss {
            height: 520px;
          }
          .fss__content {
            max-width: 100%;
          }
          .fss__arrow {
            width: 36px;
            height: 36px;
            font-size: 1.2rem;
          }
          .fss__arrow--prev {
            left: 12px;
          }
          .fss__arrow--next {
            right: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fss__track,
          .fss__cta,
          .fss__arrow,
          .fss__dot {
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}

export default firstSectionSlider