import Head from 'next/head';

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
  const siteName = 'Cabo Adventures';
  const defaultImage = 'https://cabo-adventures.com/og-image.jpg';
  const siteUrl = 'https://cabo-adventures.com';

  return (
    <Head>
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
      <meta name="twitter:site" content="@cabo_adventures" />
      <meta name="twitter:creator" content="@cabo_adventures" />
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

      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Schema.org Markup */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}

// Helper function to generate restaurant schema
export function generateRestaurantSchema(restaurant: any) {
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
    openingHoursSpecification: Object.entries(restaurant.hours || {}).map(([day, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day,
      opens: hours.split(' - ')[0],
      closes: hours.split(' - ')[1]
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating,
      reviewCount: restaurant.reviewCount
    }
  };
}

// Helper function to generate villa schema
export function generateVillaSchema(villa: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'House',
    name: villa.name,
    description: villa.description,
    image: villa.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: villa.address,
      addressLocality: villa.location,
      addressRegion: 'Baja California Sur',
      addressCountry: 'MX',
      postalCode: '23454'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: villa.latitude,
      longitude: villa.longitude
    },
    numberOfRooms: villa.bedrooms,
    numberOfBathroomsTotal: villa.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: villa.squareFootage,
      unitCode: 'FTK'
    },
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: villa.price,
      priceCurrency: 'USD'
    },
    amenityFeature: villa.amenities.map((amenity: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity
    }))
  };
}

// Helper function to generate adventure schema
export function generateAdventureSchema(adventure: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: adventure.name,
    description: adventure.description,
    image: adventure.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: adventure.address,
      addressLocality: adventure.location,
      addressRegion: 'Baja California Sur',
      addressCountry: 'MX',
      postalCode: '23454'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: adventure.latitude,
      longitude: adventure.longitude
    },
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: adventure.price,
      priceCurrency: 'USD'
    },
    duration: adventure.duration,
    tourBookingPage: adventure.bookingUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: adventure.rating,
      reviewCount: adventure.reviewCount
    }
  };
} 