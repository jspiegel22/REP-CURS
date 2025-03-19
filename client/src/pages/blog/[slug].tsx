import { useParams } from "wouter";
import { sampleBlogs } from "@/data/sample-blogs";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Share2 } from "lucide-react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import Footer from "@/components/footer";

export default function BlogPost() {
  const { slug } = useParams();
  const blog = sampleBlogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog" className="inline-block">
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
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      label: "Share on Twitter",
    },
    {
      icon: FaFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      label: "Share on Facebook",
    },
    {
      icon: FaLinkedinIn,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`,
      label: "Share on LinkedIn",
    },
    {
      icon: FaWhatsapp,
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
        {/* Hero Section - Reduced height */}
        <div className="w-full h-[40vh] relative">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-8">
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
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Social Share Buttons - Moved up */}
              <div className="mb-8 flex items-center gap-4">
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

              <p className="text-xl text-gray-600 mb-8">{blog.excerpt}</p>

              {/* Blog Content */}
              <div className="mt-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

              {/* Category-specific CTA - Made more prominent */}
              {blog.category && (
                <div className="my-12 bg-[#2F4F4F] text-white p-8 rounded-xl shadow-lg">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-4">Download Your Free {blog.category} Guide</h3>
                      <p className="text-white/90 text-lg mb-6">
                        Get our exclusive insider's guide for {blog.category.toLowerCase()} in Cabo San Lucas.
                        Unlock local secrets and expert tips!
                      </p>
                      <Button className="w-full md:w-auto bg-white text-[#2F4F4F] hover:bg-white/90">
                        Download Free Guide
                      </Button>
                    </div>
                    <div className="w-full md:w-1/3">
                      <img
                        src={blog.imageUrl}
                        alt={`${blog.category} Guide`}
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`} className="group block">
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