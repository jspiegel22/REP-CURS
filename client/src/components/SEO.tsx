import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  schema?: {
    '@context': string;
    '@type': string;
    [key: string]: any;
  };
  openGraph?: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
  keywords?: string[];
  robots?: string;
  language?: string;
  alternateLanguages?: { [key: string]: string };
}

export default function SEO({
  title,
  description,
  canonicalUrl,
  schema,
  openGraph,
  keywords = ['Cabo San Lucas', 'Los Cabos', 'Mexico', 'travel', 'tourism'],
  robots = 'index, follow',
  language = 'en',
  alternateLanguages = {}
}: SEOProps) {
  const siteName = '@cabo';
  const defaultImage = 'https://cabo.is/og-image.jpg';
  const siteUrl = 'https://cabo.is';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={robots} />
      <meta name="language" content={language} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={openGraph?.title || title} />
      <meta property="og:description" content={openGraph?.description || description} />
      <meta property="og:image" content={openGraph?.image || defaultImage} />
      <meta property="og:url" content={openGraph?.url || canonicalUrl || siteUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cabo" />
      <meta name="twitter:creator" content="@cabo" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={openGraph?.image || defaultImage} />

      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#2F4F4F" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      {/* Alternate Language Links */}
      {Object.entries(alternateLanguages).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl || siteUrl} />

      {/* Schema.org Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

// Schema Generator Functions
function generateVillaSchema(villa: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: villa.name,
    description: villa.description,
    image: villa.imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: villa.location,
      addressRegion: 'Baja California Sur',
      addressCountry: 'MX'
    },
    numberOfRooms: villa.bedrooms,
    numberOfBathroomsTotal: villa.bathrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: villa.maxGuests
    },
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Ocean View',
        value: villa.isOceanfront,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Beach Access',
        value: villa.isBeachfront,
      }
    ]
  };
}

function generateGuideSchema(guide: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    image: guide.image,
    author: {
      '@type': 'Organization',
      name: 'Cabo Adventures',
      url: 'https://cabo-adventures.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cabo Adventures',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cabo-adventures.com/logo.png'
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString()
  };
}

function generateAdventureSchema(adventure: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: adventure.name,
    description: adventure.description,
    image: adventure.imageUrl,
    location: {
      '@type': 'Place',
      name: adventure.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cabo San Lucas',
        addressRegion: 'Baja California Sur',
        addressCountry: 'MX'
      }
    },
    offers: {
      '@type': 'Offer',
      price: adventure.price,
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: adventure.rating,
      reviewCount: adventure.reviewCount
    }
  };
}

function generateRestaurantSchema(restaurant: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.location,
      addressRegion: 'Baja California Sur',
      addressCountry: 'MX',
      postalCode: '23454'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.latitude,
      longitude: restaurant.longitude
    },
    telephone: restaurant.phone,
    priceRange: restaurant.priceRange,
    servesCuisine: restaurant.cuisine,
    openingHoursSpecification: restaurant.hours?.map((hour: any) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hour.day,
      opens: hour.opens,
      closes: hour.closes
    })) || [],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating,
      reviewCount: restaurant.reviewCount
    }
  };
}

function generateResortSchema(resort: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: resort.name,
    description: resort.description,
    image: resort.imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: resort.location,
      addressRegion: 'Baja California Sur',
      addressCountry: 'MX'
    },
    priceRange: resort.priceLevel,
    amenityFeature: resort.amenities?.map((amenity: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true
    })) || [],
    numberOfRooms: resort.rooms,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: resort.rating,
      reviewCount: resort.reviewCount
    }
  };
}

// Export all schema generators
export {
  generateVillaSchema,
  generateGuideSchema,
  generateAdventureSchema,
  generateRestaurantSchema,
  generateResortSchema,
};