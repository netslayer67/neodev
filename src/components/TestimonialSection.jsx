import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Wijaya',
      position: 'Founder, Bella Fashion',
      company: 'Bella Fashion',
      rating: 5,
      text: 'Benerun Pro benar-benar mengubah game social media kami! Dalam 2 bulan, engagement naik 400% dan sales online meningkat drastis. Tim mereka sangat profesional dan kreatif.',
      image: 'Professional businesswoman Sarah Wijaya, founder of fashion company',
      results: '+400% Engagement',
      industry: 'Fashion & Lifestyle'
    },
    {
      id: 2,
      name: 'Ahmad Rizki',
      position: 'Marketing Director',
      company: 'TechStart Indonesia',
      rating: 5,
      text: 'Website yang dibuat Benerun Pro tidak hanya cantik, tapi juga conversion rate-nya luar biasa. Dari 2.1% jadi 12.8%! ROI yang sangat menguntungkan untuk bisnis kami.',
      image: 'Professional marketing director Ahmad Rizki from tech startup',
      results: '+500% Conversion',
      industry: 'Technology'
    },
    {
      id: 3,
      name: 'Maya Sari',
      position: 'Owner',
      company: 'Healthy Bites Cafe',
      rating: 5,
      text: 'Konten video yang dibuat tim Benerun sangat engaging! Reels kami sering viral dan customer baru terus berdatangan. Investasi terbaik untuk marketing kami.',
      image: 'Cafe owner Maya Sari in her healthy food restaurant',
      results: '+300% Reach',
      industry: 'Food & Beverage'
    },
    {
      id: 4,
      name: 'Budi Santoso',
      position: 'CEO',
      company: 'EduTech Solutions',
      rating: 5,
      text: 'Copywriting mereka benar-benar powerful! Email marketing campaign yang mereka buat menghasilkan open rate 45% dan click rate 18%. Angka yang fantastis!',
      image: 'CEO Budi Santoso of educational technology company',
      results: '+600% Email Performance',
      industry: 'Education'
    },
    {
      id: 5,
      name: 'Lisa Permata',
      position: 'Brand Manager',
      company: 'Glow Beauty',
      rating: 5,
      text: 'Strategi konten dari Benerun Pro membuat brand awareness kami melonjak tinggi. Follower naik 250% dalam 3 bulan dan brand recognition meningkat signifikan.',
      image: 'Beauty brand manager Lisa Permata in modern office',
      results: '+250% Followers',
      industry: 'Beauty & Cosmetics'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
            Kata{' '}
            <span className="gradient-text">Klien</span> Kami
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Dengarkan langsung dari klien-klien yang telah merasakan 
            transformasi luar biasa bersama Benerun Pro.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-6xl mx-auto mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass-effect rounded-3xl p-12 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-8 left-8 w-12 h-12 text-blue-400/30" />
              
              <div className="grid md:grid-cols-3 gap-12 items-center">
                {/* Testimonial Content */}
                <div className="md:col-span-2">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-medium">
                    "{testimonials[currentIndex].text}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-blue-300 font-semibold mb-1">
                        {testimonials[currentIndex].position}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentIndex].company}
                      </p>
                    </div>
                    
                    {/* Results Badge */}
                    <div className="text-right">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-lg mb-2">
                        {testimonials[currentIndex].results}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonials[currentIndex].industry}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Image */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative"
                  >
                    <img  
                      className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                      alt={`${testimonials[currentIndex].name} - ${testimonials[currentIndex].position}`}
                     src="https://images.unsplash.com/photo-1644424235476-295f24d503d9" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
                  </motion.div>
                  
                  {/* Floating Company Badge */}
                  <div className="absolute -bottom-4 -right-4 glass-effect rounded-xl p-3 border border-blue-400/30">
                    <div className="text-blue-300 font-semibold text-sm">
                      {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-8 mb-12">
          <Button
            onClick={prevTestimonial}
            variant="outline"
            size="lg"
            className="glass-effect border-blue-400/50 text-white hover:bg-blue-600/20 rounded-full p-4"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-400 w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextTestimonial}
            variant="outline"
            size="lg"
            className="glass-effect border-blue-400/50 text-white hover:bg-blue-600/20 rounded-full p-4"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '150+', label: 'Happy Clients' },
            { number: '4.9/5', label: 'Average Rating' },
            { number: '300%', label: 'Avg. Growth' },
            { number: '98%', label: 'Retention Rate' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center glass-effect rounded-2xl p-6 hover-lift"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;