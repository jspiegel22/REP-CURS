import axios from 'axios';

/**
 * This script adds the testimonial face images to our image database
 */
async function addTestimonialImages() {
  const baseUrl = 'http://localhost:3000';
  const facesData = [
    {
      name: "Testimonial Face 1",
      image_file: "/images/testimonials/face-2.jpg",
      image_url: "/images/testimonials/face-2.jpg",
      alt_text: "Young woman with blonde hair smiling at event",
      description: "Happy traveler testimonial photo",
      category: "testimonial",
      tags: ["testimonial", "face", "traveler"],
      featured: true
    },
    {
      name: "Testimonial Face 2",
      image_file: "/images/testimonials/face-3.jpg",
      image_url: "/images/testimonials/face-3.jpg",
      alt_text: "Blonde woman with white hat smiling",
      description: "Happy traveler testimonial photo",
      category: "testimonial",
      tags: ["testimonial", "face", "traveler"],
      featured: true
    },
    {
      name: "Testimonial Face 3",
      image_file: "/images/testimonials/face-4.jpg",
      image_url: "/images/testimonials/face-4.jpg",
      alt_text: "Man smiling while giving testimonial",
      description: "Happy traveler testimonial photo",
      category: "testimonial",
      tags: ["testimonial", "face", "traveler"],
      featured: true
    },
    {
      name: "Testimonial Face 4",
      image_file: "/images/testimonials/face-5.jpg",
      image_url: "/images/testimonials/face-5.jpg",
      alt_text: "Man smiling in testimonial photo",
      description: "Happy traveler testimonial photo",
      category: "testimonial",
      tags: ["testimonial", "face", "traveler"],
      featured: true
    }
  ];

  try {
    console.log("Adding testimonial face images to database...");
    
    for (const image of facesData) {
      try {
        const response = await axios.post(`${baseUrl}/api/images`, image);
        console.log(`Added image: ${image.name}`, response.data.image.id);
      } catch (err) {
        console.error(`Failed to add image: ${image.name}`, err.message);
        if (err.response) {
          console.error("Response data:", err.response.data);
        }
      }
    }
    
    console.log("Testimonial face images added successfully!");
  } catch (error) {
    console.error("Error adding testimonial faces:", error.message);
  }
}

// Execute the function
addTestimonialImages().catch(console.error);