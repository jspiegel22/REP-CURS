import { sampleBlogs } from "@/data/sample-blogs";
import { Link } from "wouter";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import Footer from "@/components/footer";

export default function BlogIndex() {
  const categories = Array.from(new Set(sampleBlogs.map(blog => blog.category)));

  return (
    <>
      <SEO
        title="Travel Blog - Cabo Adventures"
        description="Discover insider tips, guides, and stories about Cabo San Lucas. From hidden beaches to luxury experiences, find inspiration for your next adventure."
        canonicalUrl="https://cabo-adventures.com/blog"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Cabo Adventures Blog',
          description: 'Travel guides, tips, and stories about Cabo San Lucas',
          publisher: {
            '@type': 'Organization',
            name: 'Cabo Adventures',
            logo: {
              '@type': 'ImageObject',
              url: 'https://cabo-adventures.com/logo.png'
            }
          }
        }}
      />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-[#2F4F4F] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Cabo Travel Blog</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl">
              Discover insider tips, local secrets, and inspiration for your next Cabo adventure
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex overflow-x-auto gap-4 pb-4 mb-8 hide-scrollbar">
            <button className="flex-none px-4 py-2 rounded-full bg-[#2F4F4F] text-white">
              All Posts
            </button>
            {categories.map((category) => (
              <button 
                key={category}
                className="flex-none px-4 py-2 rounded-full border border-[#2F4F4F] text-[#2F4F4F] hover:bg-[#2F4F4F] hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Link href={`/blog/${sampleBlogs[0].slug}`}>
              <a className="group block">
                <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
                  <img
                    src={sampleBlogs[0].imageUrl}
                    alt={sampleBlogs[0].title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 md:p-8 text-white">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          {sampleBlogs[0].category}
                        </span>
                        <span>{sampleBlogs[0].readTime}</span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-bold mb-2">
                        {sampleBlogs[0].title}
                      </h2>
                      <p className="text-white/80 text-lg max-w-2xl">
                        {sampleBlogs[0].excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleBlogs.slice(1).map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <a className="group block">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{format(new Date(blog.date), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-[#2F4F4F] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">{blog.excerpt}</p>
                    <div className="pt-2 flex items-center gap-2 text-sm">
                      <span className="text-[#2F4F4F] font-medium">{blog.author}</span>
                      <span>in</span>
                      <span className="text-[#2F4F4F] font-medium">{blog.category}</span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
