import { Calendar, Users, Heart, Sun, Map, Shield } from "lucide-react";
import LeadGenTemplate from "@/components/templates/LeadGenTemplate";

export default function FamilyTripsPage() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family-Friendly Activities",
      description: "Curated experiences perfect for all age groups",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Plan activities around your family's needs",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Care",
      description: "Dedicated concierge for your family's needs",
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Beach Activities",
      description: "Safe and fun beach experiences for everyone",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Local Expertise",
      description: "Insider knowledge of family-friendly spots",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "Vetted activities and accommodations",
    },
  ];

  const benefits = [
    "Personalized itinerary tailored to your family's interests",
    "Kid-friendly accommodation recommendations",
    "Private transportation with car seats available",
    "Local guide for family excursions",
    "24/7 concierge support during your stay",
    "Special dietary requirements catered for",
    "Emergency medical contacts and support",
    "Professional photography session included",
  ];

  const testimonials = [
    {
      name: "The Johnson Family",
      text: "Our trip to Cabo was perfect for the whole family. The kids had a blast, and we parents got to relax too!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Sarah M.",
      text: "The attention to detail in planning activities for both our toddler and teenager was impressive.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=2",
    },
  ];

  const stats = [
    { value: "500+", label: "Families Served" },
    { value: "100%", label: "Safe Trips" },
    { value: "50+", label: "Kid-Friendly Activities" },
    { value: "24/7", label: "Support" },
  ];

  const faqs = [
    {
      question: "What's the best time to visit Cabo with family?",
      answer: "The best time for family trips is from October to May when the weather is mild and perfect for outdoor activities. However, we can help you plan a great family trip any time of the year!",
    },
    {
      question: "Are the activities suitable for young children?",
      answer: "Yes! We curate activities based on your children's ages and interests. From gentle beach experiences for toddlers to exciting adventures for teens, we ensure everyone has a great time.",
    },
    {
      question: "How do you handle food allergies and dietary restrictions?",
      answer: "We work closely with our restaurant partners to accommodate all dietary needs. Just let us know your requirements, and we'll ensure safe and delicious meals for everyone.",
    },
    {
      question: "What safety measures are in place?",
      answer: "All our activities and partners are thoroughly vetted for safety. We provide 24/7 support, emergency contacts, and ensure all equipment meets international safety standards.",
    },
  ];

  return (
    <LeadGenTemplate
      title="Family Adventures in Cabo"
      subtitle="Create unforgettable memories with a perfectly planned family getaway"
      description="Experience the magic of Cabo San Lucas with your loved ones. Our family packages combine fun activities, safe adventures, and relaxation for all ages. From toddler-friendly beach days to exciting teen adventures, we create the perfect balance for an unforgettable family vacation."
      imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3"
      features={features}
      benefits={benefits}
      testimonials={testimonials}
      stats={stats}
      faqs={faqs}
    />
  );
}
