import { useMemo, useState } from 'react'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'kaftaan', label: 'Kaftaan' },
  { id: 'pret', label: 'Ready to Wear' },
  { id: 'unstitched', label: 'Unstitched' },
  { id: 'west', label: 'Western' },
]

// Replace image, imageHover, name, price and href with your real catalog data.
// imageHover is the second photo shown on hover/focus, same as the live site.
const catalog = [
  {
    id: 'p1',
    category: 'kaftaan',
    categoryLabel: 'Kaftaan Dresses',
    name: 'Printed Kaftaan Dress',
    price: 'Rs. 3,290',
    badge: 'Best Seller',
    image: 'https://picsum.photos/seed/dress-01a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-01b/800/1000',
    href: '#',
  },
  {
    id: 'p2',
    category: 'kaftaan',
    categoryLabel: 'Kaftaan Dresses',
    name: 'Embroidered Silk Kaftaan',
    price: 'Rs. 4,150',
    badge: 'Limited',
    image: 'https://picsum.photos/seed/dress-02a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-02b/800/1000',
    href: '#',
  },
  {
    id: 'p3',
    category: 'kaftaan',
    categoryLabel: 'Kaftaan Dresses',
    name: 'Printed Maxi Kaftaan',
    price: 'Rs. 2,990',
    badge: 'New',
    image: 'https://picsum.photos/seed/dress-03a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-03b/800/1000',
    href: '#',
  },
  {
    id: 'p4',
    category: 'pret',
    categoryLabel: 'Summer Essential 3 Pc',
    name: 'Embroidered Kurta Dupatta Trouser',
    price: 'Rs. 3,590',
    badge: 'Trending',
    image: 'https://picsum.photos/seed/dress-04a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-04b/800/1000',
    href: '#',
  },
  {
    id: 'p5',
    category: 'pret',
    categoryLabel: 'Signature Pret',
    name: '3-Piece Lawn Suit',
    price: 'Rs. 4,290',
    badge: 'Fan Favourite',
    image: 'https://picsum.photos/seed/dress-05a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-05b/800/1000',
    href: '#',
  },
  {
    id: 'p6',
    category: 'pret',
    categoryLabel: 'Signature Pret',
    name: 'Chikankari Kurta Set',
    price: 'Rs. 3,890',
    badge: 'Popular',
    image: 'https://picsum.photos/seed/dress-06a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-06b/800/1000',
    href: '#',
  },
  {
    id: 'p7',
    category: 'unstitched',
    categoryLabel: 'Essential Unstitched',
    name: 'Printed Lawn Unstitched — 3 Pc',
    price: 'Rs. 2,690',
    badge: 'New Arrival',
    image: 'https://picsum.photos/seed/dress-07a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-07b/800/1000',
    href: '#',
  },
  {
    id: 'p8',
    category: 'unstitched',
    categoryLabel: 'Luxury Unstitched',
    name: 'Embroidered Cotton Unstitched',
    price: 'Rs. 3,150',
    badge: 'Featured',
    image: 'https://picsum.photos/seed/dress-08a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-08b/800/1000',
    href: '#',
  },
  {
    id: 'p9',
    category: 'unstitched',
    categoryLabel: 'Essential Unstitched',
    name: 'Digital Print Lawn — 2 Pc',
    price: 'Rs. 2,390',
    badge: 'Best Seller',
    image: 'https://picsum.photos/seed/dress-09a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-09b/800/1000',
    href: '#',
  },
  {
    id: 'p10',
    category: 'west',
    categoryLabel: 'Western',
    name: 'Co-Ord Set — Top & Trouser',
    price: 'Rs. 3,490',
    badge: 'Popular',
    image: 'https://picsum.photos/seed/dress-10a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-10b/800/1000',
    href: '#',
  },
  {
    id: 'p11',
    category: 'west',
    categoryLabel: 'Western',
    name: 'Graphic Print T-Shirt',
    price: 'Rs. 1,690',
    badge: 'New',
    image: 'https://picsum.photos/seed/dress-11a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-11b/800/1000',
    href: '#',
  },
  {
    id: 'p12',
    category: 'west',
    categoryLabel: 'Western',
    name: 'Tailored Wide-Leg Trouser',
    price: 'Rs. 2,290',
    badge: 'Trending',
    image: 'https://picsum.photos/seed/dress-12a/800/1000',
    imageHover: 'https://picsum.photos/seed/dress-12b/800/1000',
    href: '#',
  },
]

const discoverHref = '#'

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return catalog
    return catalog.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  const activeCategoryLabel =
    categories.find((cat) => cat.id === activeCategory)?.label ?? 'Women'

  return (
    <section className="wp" aria-labelledby="wp-heading">
      <div className="wp__header">
        <span className="wp__eyebrow">Women</span>
        <h2 className="wp__heading" id="wp-heading">
          Shop Women's Dresses
        </h2>
        <p className="wp__subtitle">
          Fresh silhouettes, easy fabrics, made for everyday wear.
        </p>
      </div>

      <div className="wp__tabs" role="tablist" aria-label="Filter by collection">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            className={`wp__tab${activeCategory === cat.id ? ' wp__tab--active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="wp__grid">
        {filteredProducts.map((product) => (
          <article className="wp-card" key={product.id}>
            <a href={product.href} className="wp-card__link">
              <span className="wp-card__media">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="wp-card__image wp-card__image--primary"
                />
                <img
                  src={product.imageHover}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="wp-card__image wp-card__image--secondary"
                />
                {product.badge && (
                  <span className="wp-card__badge">{product.badge}</span>
                )}
                <span className="wp-card__quick-view">View product</span>
              </span>
              <span className="wp-card__details">
                <span className="wp-card__category">{product.categoryLabel}</span>
                <h3 className="wp-card__name">{product.name}</h3>
                <span className="wp-card__price">{product.price}</span>
              </span>
            </a>
          </article>
        ))}

        <a className="wp-discover" href={discoverHref}>
          <span className="wp-discover__icon" aria-hidden="true">
            →
          </span>
          <span className="wp-discover__label">Discover More</span>
          <span className="wp-discover__sub">
            Explore the full {activeCategoryLabel} collection
          </span>
        </a>
      </div>

      <style>{`
        .wp {
          width: 100%;
          padding: 64px 6vw;
          background: #fbf7f2;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #171310;
          box-sizing: border-box;
        }

        .wp__header {
          max-width: 640px;
          margin: 0 0 28px;
        }

        .wp__eyebrow {
          display: inline-block;
          font-size: 0.85rem;
          color: #6e2a3a;
          margin-bottom: 0.5rem;
        }

        .wp__heading {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-size: clamp(1.7rem, 2.6vw, 2.3rem);
          line-height: 1.2;
          margin: 0 0 0.5rem;
          font-weight: 600;
        }

        .wp__subtitle {
          font-size: 0.98rem;
          line-height: 1.6;
          color: rgba(23, 19, 16, 0.7);
          margin: 0;
        }

        .wp__tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0 0 32px;
          border-bottom: 1px solid rgba(23, 19, 16, 0.12);
          padding-bottom: 14px;
        }

        .wp__tab {
          border: none;
          background: transparent;
          padding: 8px 16px;
          font-size: 0.88rem;
          font-weight: 500;
          color: rgba(23, 19, 16, 0.6);
          border-radius: 999px;
          cursor: pointer;
          transition: background 200ms ease, color 200ms ease;
        }

        .wp__tab:hover {
          color: #171310;
          background: rgba(23, 19, 16, 0.05);
        }

        .wp__tab--active {
          background: #171310;
          color: #fbf7f2;
        }

        .wp__tab:focus-visible {
          outline: 2px solid #6e2a3a;
          outline-offset: 2px;
        }

        .wp__grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 42px 18px;
        }

        .wp-card {
          min-width: 0;
        }

        .wp-card__link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .wp-card__media {
          position: relative;
          display: block;
          aspect-ratio: 3 / 4;
          border-radius: 0;
          overflow: hidden;
          background: #eee9e3;
        }

        .wp-card__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 500ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wp-card__link:hover .wp-card__image,
        .wp-card__link:focus-visible .wp-card__image {
          transform: scale(1.03);
        }

        .wp-card__image--primary {
          opacity: 1;
        }

        /* Hover/focus swaps to the second product photo, same as the
           reference site's product tiles. */
        .wp-card__link:hover .wp-card__image--primary,
        .wp-card__link:focus-visible .wp-card__image--primary {
          opacity: 0;
        }

        .wp-card__link:hover .wp-card__image--secondary,
        .wp-card__link:focus-visible .wp-card__image--secondary {
          opacity: 1;
        }

        .wp-card__badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #fbf7f2;
          color: #171310;
          font-size: 0.68rem;
          padding: 6px 9px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          z-index: 1;
        }

        .wp-card__quick-view {
          position: absolute;
          right: 12px;
          bottom: 12px;
          left: 12px;
          padding: 11px 12px;
          background: rgba(251, 247, 242, 0.95);
          color: #171310;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-align: center;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 220ms ease, transform 220ms ease;
        }

        .wp-card__link:hover .wp-card__quick-view,
        .wp-card__link:focus-visible .wp-card__quick-view {
          opacity: 1;
          transform: translateY(0);
        }

        .wp-card__details {
          display: block;
          padding-top: 13px;
        }

        .wp-card__name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #171310;
          margin: 4px 0 7px;
          line-height: 1.35;
        }

        .wp-card__category {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: rgba(23, 19, 16, 0.55);
          margin: 0;
          text-transform: uppercase;
        }

        .wp-card__price {
          display: block;
          font-size: 0.86rem;
          font-weight: 500;
          color: #171310;
          margin: 0;
        }

        .wp-card__link:focus-visible {
          outline: 2px solid #6e2a3a;
          outline-offset: 3px;
          border-radius: 0;
        }

        .wp-discover {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          aspect-ratio: 3 / 4;
          border-radius: 6px;
          border: 1px dashed rgba(23, 19, 16, 0.25);
          text-decoration: none;
          color: #171310;
          padding: 20px;
          transition: border-color 200ms ease, background 200ms ease;
        }

        .wp-discover:hover {
          border-color: #6e2a3a;
          background: rgba(110, 42, 58, 0.04);
        }

        .wp-discover__icon {
          font-size: 1.4rem;
          margin-bottom: 10px;
        }

        .wp-discover__label {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .wp-discover__sub {
          font-size: 0.8rem;
          color: rgba(23, 19, 16, 0.6);
        }

        @media (max-width: 640px) {
          .wp {
            padding: 48px 5vw;
          }
          .wp__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 30px 12px;
          }
        }

        @media (max-width: 960px) and (min-width: 641px) {
          .wp__grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wp-card__image,
          .wp-card__quick-view,
          .wp__tab,
          .wp-discover {
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}

export default Products