import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, Heart, Share2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PortfolioSection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');

  const portfolioItems = [
    {
      id: 1,
      category: 'social-media',
      title: 'Kampanye Viral Brand Fashion',
      description: 'Meningkatkan engagement 450% dalam 30 hari',
      beforeViews: '2.5K',
      afterViews: '125K',
      beforeEngagement: '1.2%',
      afterEngagement: '8.7%',
      image: 'Fashion brand social media campaign with viral content and high engagement',
      type: 'video'
    },
    {
      id: 2,
      category: 'website',
      title: 'Website E-commerce Interaktif',
      description: 'Conversion rate naik 280% setelah redesign',
      beforeViews: '15K',
      afterViews: '89K',
      beforeEngagement: '2.1%',
      afterEngagement: '12.3%',
      image: 'Modern interactive e-commerce website with high conversion design',
      type: 'website'
    },
    {
      id: 3,
      category: 'social-media',
      title: 'Konten Edukasi Viral',
      description: 'Video edukasi mencapai 500K+ views organik',
      beforeViews: '800',
      afterViews: '520K',
      beforeEngagement: '0.8%',
      afterEngagement: '15.2%',
      image: 'Educational viral video content with massive organic reach',
      type: 'video'
    },
    {
      id: 4,
      category: 'copywriting',
      title: 'Campaign Copy yang Mengkonversi',
      description: 'Sales copy meningkatkan penjualan 320%',
      beforeViews: '5.2K',
      afterViews: '67K',
      beforeEngagement: '1.5%',
      afterEngagement: '9.8%',
      image: 'High-converting sales copy and marketing campaign materials',
      type: 'copy'
    },
    {
      id: 5,
      category: 'website',
      title: 'Landing Page High-Convert',
      description: 'Landing page dengan conversion rate 18.5%',
      beforeViews: '8.1K',
      afterViews: '156K',
      beforeEngagement: '2.3%',
      afterEngagement: '18.5%',
      image: 'High-converting landing page with modern design and clear call-to-actions',
      type: 'website'
    },
    {
      id: 6,
      category: 'social-media',
      title: 'Reels Strategy yang Explosive',
      description: 'Strategi reels menghasilkan 2M+ total views',
      beforeViews: '1.2K',
      afterViews: '2.1M',
      beforeEngagement: '0.9%',
      afterEngagement: '11.4%',
      image: 'Explosive Instagram Reels strategy with millions of views',
      type: 'video'
    }
  ];

  const categories = [
    { id: 'all', label: 'Semua Project', icon: TrendingUp },
    { id: 'social-media', label: 'Social Media', icon: Heart },
    { id: 'website', label: 'Website', icon: Eye },
    { id: 'copywriting', label: 'Copywriting', icon: Share2 }
  ];

  const filteredItems = activeTab === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeTab);

  const handleViewProject = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 4000,
    });
  };

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
            Portfolio &{' '}
            <span className="gradient-text">Hasil Nyata</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Lihat bagaimana kami mengubah konten biasa menjadi viral sensation 
            dan website standar menjadi conversion machine yang powerful.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'glass-effect text-gray-300 hover:text-white hover:bg-blue-600/20'
              }`}
            >
              <category.icon className="w-5 h-5" />
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-2xl overflow-hidden hover-lift group"
              >
                <div className="relative">
                  <img  
                    className="w-full h-48 object-cover"
                    alt={item.title}
                   src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Play Button for Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleViewProject}
                        className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-blue-600/80 transition-all duration-300"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </motion.button>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {item.type === 'video' ? 'Video' : item.type === 'website' ? 'Website' : 'Copy'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    {item.description}
                  </p>

                  {/* Before/After Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Sebelum</div>
                      <div className="text-sm font-semibold text-red-300">
                        {item.beforeViews} views
                      </div>
                      <div className="text-xs text-red-300">
                        {item.beforeEngagement} engagement
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Sesudah</div>
                      <div className="text-sm font-semibold text-green-300">
                        {item.afterViews} views
                      </div>
                      <div className="text-xs text-green-300">
                        {item.afterEngagement} engagement
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleViewProject}
                    variant="outline"
                    className="w-full glass-effect border-blue-400/50 text-white hover:bg-blue-600/20 group-hover:border-blue-400 transition-all duration-300"
                  >
                    Lihat Detail Project
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-3xl p-12 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Siap Menjadi{' '}
              <span className="gradient-text">Success Story</span> Berikutnya?
            </h3>
            <p className="text-gray-300 mb-8">
              Bergabunglah dengan ratusan brand yang telah merasakan 
              transformasi digital bersama Benerun Pro.
            </p>
            <Button
              onClick={handleViewProject}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover-lift"
            >
              Mulai Project Anda
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;