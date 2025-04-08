import Link from 'next/link';

const categories = [
  {
    title: 'Luxury Villas',
    description: 'Exclusive beachfront properties',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
    href: '/stays/villas'
  },
  {
    title: 'Water Activities',
    description: 'Snorkeling, diving & more',
    image: 'https://images.unsplash.com/photo-1564543331-0b5aa2eda2ce',
    href: '/adventures/water'
  },
  {
    title: 'Land Adventures',
    description: 'ATV tours & desert expeditions',
    image: 'https://images.unsplash.com/photo-1525186402429-b4ff38bedec6',
    href: '/adventures/land'
  },
  {
    title: 'Fine Dining',
    description: 'World-class restaurants',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    href: '/eats/restaurants'
  },
  {
    title: 'Nightlife',
    description: 'Bars, clubs & entertainment',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2',
    href: '/eats/bars'
  },
  {
    title: 'Beach Clubs',
    description: 'Day clubs & beach parties',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
    href: '/eats/beach-clubs'
  }
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link 
          key={category.title}
          href={category.href}
          className="group relative overflow-hidden rounded-lg aspect-[4/3]"
        >
          <img
            src={category.image}
            alt={category.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <h3 className="text-xl font-semibold mb-1">{category.title}</h3>
            <p className="text-sm text-white/90">{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}