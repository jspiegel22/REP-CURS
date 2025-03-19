import { useParams } from "wouter";
import { sampleBlogs } from "@/data/sample-blogs";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { VillaCard } from "@/components/villa-card";
import { Link } from "wouter";
import { ChevronRight, Share2 } from "lucide-react";
import {
  SiTwitter,
  SiFacebook,
  SiLinkedin,
  SiWhatsapp,
} from "react-icons/si";
import Footer from "@/components/footer";

export default function BlogPost() {
  const { slug } = useParams();
  const blog = sampleBlogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = `https://cabo-adventures.com/blog/${blog.slug}`;
  const shareText = `Check out "${blog.title}" on Cabo Adventures`;

  const shareLinks = [
    {
      icon: SiTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      label: "Share on Twitter",
    },
    {
      icon: SiFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      label: "Share on Facebook",
    },
    {
      icon: SiLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`,
      label: "Share on LinkedIn",
    },
    {
      icon: SiWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      label: "Share on WhatsApp",
    },
  ];

  // Related blogs (excluding current)
  const relatedBlogs = sampleBlogs
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);

  return (
    <>
      <SEO
        title={`${blog.title} | Cabo Adventures Blog`}
        description={blog.excerpt}
        canonicalUrl={`https://cabo-adventures.com/blog/${blog.slug}`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blog.title,
          image: blog.imageUrl,
          datePublished: blog.date,
          author: {
            '@type': 'Person',
            name: 'Isabella',
            url: 'https://cabo-adventures.com/about/isabella'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Cabo Adventures',
            logo: {
              '@type': 'ImageObject',
              url: 'https://cabo-adventures.com/logo.png'
            }
          }
        }}
        openGraph={{
          title: blog.title,
          description: blog.excerpt,
          image: blog.imageUrl,
          url: `https://cabo-adventures.com/blog/${blog.slug}`,
          type: 'article',
          article: {
            publishedTime: blog.date,
            author: 'Isabella',
            tags: [blog.category]
          }
        }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="w-full h-[50vh] md:h-[60vh] relative">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-8 md:pb-12">
              <div className="max-w-3xl">
                <div className="text-white/80 mb-4">
                  {format(new Date(blog.date), 'MMMM d, yyyy')} • {blog.readTime}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {blog.title}
                </h1>
                <div className="flex items-center gap-4 text-white">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                    alt="Isabella"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <div className="font-medium">Isabella</div>
                    <div className="text-sm text-white/80">Travel Expert & Local Guide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8">{blog.excerpt}</p>
                
                {/* Sample blog content - replace with actual content */}
                <h2>Discovering Hidden Gems</h2>
                <p>
                  Cabo San Lucas is home to some of the most breathtaking beaches in the world.
                  From secluded coves to expansive stretches of golden sand, each beach has its
                  own unique character and charm.
                </p>

                <h2>Best Time to Visit</h2>
                <p>
                  The best time to visit these hidden beaches is during the early morning hours
                  when the temperatures are mild and the crowds are thin. This is also when
                  you'll catch the most spectacular sunrises over the Sea of Cortez.
                </p>

                {/* Social Share Buttons */}
                <div className="border-t border-b py-6 my-8">
                  <div className="flex items-center gap-4">
                    <Share2 className="h-5 w-5 text-gray-600" />
                    <div className="flex gap-4">
                      {shareLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#2F4F4F] transition-colors"
                          aria-label={link.label}
                        >
                          <link.icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">About the Author</h3>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                    alt="Isabella"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="font-medium">Isabella</div>
                    <div className="text-sm text-gray-600">Travel Expert & Local Guide</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  With over a decade of experience in Cabo San Lucas, Isabella brings insider knowledge
                  and a passion for helping travelers discover the true magic of this destination.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Featured Adventure</h3>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1605281317010-fe5ffe798166"
                    alt="Luxury Yacht Tour"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                    <div className="text-white">
                      <h4 className="font-semibold mb-1">Luxury Yacht Tour</h4>
                      <p className="text-sm">Experience Cabo from the sea</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`}>
                  <a className="group block">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                      <img
                        src={relatedBlog.imageUrl}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-[#2F4F4F] transition-colors">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">{relatedBlog.excerpt}</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
