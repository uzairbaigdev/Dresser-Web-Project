import React, { useCallback, useEffect, useRef, useState } from 'react'

// Replace image, eyebrow, heading, description, ctaLabel and ctaHref
// with your real feature content. image should be a tall portrait photo.
const slides = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/tss-chikankari/900/1100',
    eyebrow: 'Limited Edit',
    heading: "The Chikankari Edit Everyone's Talking About",
    description:
      "Hand-finished embroidery on breathable cotton — pieces are moving fast this season.",
    ctaLabel: 'Shop now',
    ctaHref: '#',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/tss-lawn/900/1100',
    eyebrow: 'Fresh Fabric',
    heading: 'Lawn That Feels Like Summer',
    description:
      'Lightweight prints designed to keep you cool without losing the details you love.',
    ctaLabel: 'Shop now',
    ctaHref: '#',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/tss-embroidery/900/1100',
    eyebrow: 'Made To Last',
    heading: 'Embroidery Built for Every Wash',
    description:
      "Colour-fast threads and reinforced stitching, tested the way you'll actually wear it.",
    ctaLabel: 'Shop now',
    ctaHref: '#',
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/tss-restock/900/1100',
    eyebrow: 'Just Restocked',
    heading: 'Your Favourite Silhouette Is Back',
    description:
      "The style you kept asking about is back in stock — while sizes last.",
    ctaLabel: 'Shop now',
    ctaHref: '#',
  },
]

const AUTOPLAY_DELAY = 3000
const SWIPE_THRESHOLD = 50 // px, minimum drag distance to trigger a slide change

const ThirdSectionSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartXRef = useRef(null)
  const dragDeltaRef = useRef(0)

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

  // Touch / mouse swipe support on the image panel.
  const handlePointerDown = (event) => {
    dragStartXRef.current = event.clientX
    dragDeltaRef.current = 0
    setIsDragging(true)
  }

  const handlePointerMove = (event) => {
    if (dragStartXRef.current === null) return
    dragDeltaRef.current = event.clientX - dragStartXRef.current
  }

  const endDrag = () => {
    if (dragStartXRef.current === null) return
    if (dragDeltaRef.current > SWIPE_THRESHOLD) {
      goToPrev()
    } else if (dragDeltaRef.current < -SWIPE_THRESHOLD) {
      goToNext()
    }
    dragStartXRef.current = null
    dragDeltaRef.current = 0
    setIsDragging(false)
  }

  const activeSlide = slides[activeIndex]

  return (
    <section
      className="tss"
      aria-roledescription="carousel"
      aria-label="Featured collection"
      onKeyDown={handleKeyDown}
    >
      <div className="tss__inner">
        <div
          className="tss__media"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <div
            className="tss__track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`tss__slide${
                  index === activeIndex ? ' tss__slide--active' : ''
                }`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
                aria-hidden={index !== activeIndex}
              >
                <div
                  className="tss__bg"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    animationPlayState: isDragging ? 'paused' : 'running',
                  }}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="tss__arrow tss__arrow--prev"
            aria-label="Previous slide"
            onClick={goToPrev}
          >
            ‹
          </button>
          <button
            type="button"
            className="tss__arrow tss__arrow--next"
            aria-label="Next slide"
            onClick={goToNext}
          >
            ›
          </button>
        </div>

        <div className="tss__content">
          {/* key={activeSlide.id} remounts this block on every slide change,
              which restarts the fade-up entrance animation below. */}
          <div className="tss__panel" key={activeSlide.id}>
            <span className="tss__eyebrow">{activeSlide.eyebrow}</span>
            <h2 className="tss__heading">{activeSlide.heading}</h2>
            <p className="tss__description">{activeSlide.description}</p>
            <a className="tss__cta" href={activeSlide.ctaHref}>
              {activeSlide.ctaLabel}
            </a>
          </div>

          <div className="tss__dots" role="tablist" aria-label="Slide navigation">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                className={`tss__dot${
                  index === activeIndex ? ' tss__dot--active' : ''
                }`}
                aria-selected={index === activeIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <span className="tss__sr-live" aria-live="polite">
        {`Showing slide ${activeIndex + 1} of ${slides.length}: ${activeSlide.heading}`}
      </span>

      <style>{`
        .tss {
          width: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          touch-action: pan-y;
        }

        .tss__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 640px;
          max-height: 90vh;
        }

        .tss__media {
          position: relative;
          overflow: hidden;
          background: rgba(23, 19, 16, 0.06);
        }

        .tss__track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 900ms cubic-bezier(0.45, 0, 0.2, 1);
          will-change: transform;
        }

        .tss__slide {
          position: relative;
          flex: 0 0 100%;
        }

        .tss__slide--active {
          z-index: 1;
        }

        .tss__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          will-change: transform;
        }

        /* Slow zoom on the active image only, so it feels alive rather
           than static while it's on screen. */
        .tss__slide--active .tss__bg {
          animation: tss-kenburns 6500ms ease-out forwards;
        }

        @keyframes tss-kenburns {
          from {
            transform: scale(1.07);
          }
          to {
            transform: scale(1);
          }
        }

        .tss__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(251, 247, 242, 0.5);
          background: rgba(12, 10, 9, 0.25);
          color: #fbf7f2;
          font-size: 1.4rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 200ms ease, border-color 200ms ease;
        }

        .tss__arrow:hover {
          background: rgba(12, 10, 9, 0.5);
          border-color: rgba(251, 247, 242, 0.9);
        }

        .tss__arrow:focus-visible {
          outline: 2px solid #d9b98a;
          outline-offset: 2px;
        }

        .tss__arrow--prev {
          left: 20px;
        }

        .tss__arrow--next {
          right: 20px;
        }

        .tss__content {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #fbf7f2;
          padding: 48px 7vw;
        }

        .tss__panel {
          max-width: 440px;
          animation: tss-fade-up 650ms cubic-bezier(0.25, 0.8, 0.25, 1) both;
        }

        @keyframes tss-fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tss__eyebrow {
          display: block;
          font-size: 0.85rem;
          color: rgba(23, 19, 16, 0.55);
          margin-bottom: 0.9rem;
        }

        .tss__heading {
          font-size: clamp(1.7rem, 2.8vw, 2.4rem);
          line-height: 1.25;
          font-weight: 700;
          color: #171310;
          margin: 0 0 0.9rem;
        }

        .tss__description {
          font-size: 0.98rem;
          line-height: 1.65;
          color: rgba(23, 19, 16, 0.68);
          margin: 0 0 1.7rem;
        }

        .tss__cta {
          display: inline-block;
          background: #171310;
          color: #fbf7f2;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.85rem 2rem;
          border-radius: 2px;
          transition: background 200ms ease, transform 200ms ease;
        }

        .tss__cta:hover {
          background: #6e2a3a;
          transform: translateY(-1px);
        }

        .tss__cta:focus-visible {
          outline: 2px solid #6e2a3a;
          outline-offset: 3px;
        }

        .tss__dots {
          display: flex;
          gap: 10px;
          margin-top: 40px;
        }

        .tss__dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          border: 1px solid rgba(23, 19, 16, 0.35);
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: background 250ms ease, width 250ms ease, border-color 250ms ease;
        }

        .tss__dot--active {
          background: #171310;
          border-color: #171310;
          width: 22px;
          border-radius: 5px;
        }

        .tss__dot:focus-visible {
          outline: 2px solid #6e2a3a;
          outline-offset: 2px;
        }

        .tss__sr-live {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .tss__inner {
            grid-template-columns: 1fr;
            min-height: 0;
            max-height: none;
          }
          .tss__media {
            height: 60vh;
            min-height: 360px;
          }
          .tss__content {
            padding: 40px 6vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tss__track,
          .tss__cta,
          .tss__arrow,
          .tss__dot {
            transition: none;
          }
          .tss__bg {
            animation: none !important;
          }
          .tss__panel {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

export default ThirdSectionSlider