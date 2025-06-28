import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  PenTool, 
  Globe, 
  Megaphone, 
  Sparkles, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ServicesSection = () => {
  const { toast } = useToast();

  const services = [
    {
      icon: Video,
      title: 'Social Media Content Creation',
      description: 'Konten visual yang engaging dan viral-ready untuk semua platform media sosial',
      features: [
        'Video editing profesional dengan motion graphics',
        'Desain feed Instagram yang konsisten',
        'Reels & TikTok yang trending',
        'Stories template yang menarik',
        'Content calendar & scheduling'
      ],
      price: 'Mulai dari 2.5jt',
      popular: true,
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: PenTool,
      title: 'Video Editing Profesional',
      description: 'Transformasi footage mentah menjadi video berkualitas broadcast yang memukau',
      features: [
        'Color grading & audio mastering',
        'Motion graphics & visual effects',
        'Subtitle & caption styling',
        'Multi-platform optimization',
        'Revisi unlimited hingga perfect'
      ],
      price: 'Mulai dari 1.8jt',
      popular: false,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Megaphone,
      title: 'Copywriting & Caption Strategis',
      description: 'Copy yang mengkonversi dan caption yang membangun engagement tinggi',
      features: [
        'Hook yang powerful & attention-grabbing',
        'CTA yang mengkonversi tinggi',
        'Storytelling yang emotional',
        'SEO-optimized captions',
        'A/B testing untuk performa optimal'
      ],
      price: 'Mulai dari 1.2jt',
      popular: false,
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Globe,
      title: 'Web Design Interaktif & Terjangkau',
      description: 'Website modern yang responsive, fast-loading, dan conversion-focused',
      features: [
        'Design UI/UX yang modern & intuitive',
        'Mobile-first responsive design',
        'SEO optimization & fast loading',
        'CMS integration & easy management',
        'Analytics & conversion tracking'
      ],
      price: 'Mulai dari 3.5jt',
      popular: false,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const handleGetQuote = (serviceName) => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀",
      duration: 4000,
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
            Layanan{' '}
            <span className="gradient-text">Premium</span> Kami
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Solusi lengkap untuk transformasi digital brand Anda. 
            Dari konten viral hingga website yang mengkonversi.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative glass-effect rounded-3xl p-8 hover-lift group ${
                service.popular ? 'ring-2 ring-blue-400/50' : ''
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${service.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Yang Anda Dapatkan:</h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold gradient-text">
                        {service.price}
                      </div>
                      <div className="text-sm text-gray-400">
                        *Harga dapat disesuaikan
                      </div>
                    </div>
                    <Button
                      onClick={() => handleGetQuote(service.title)}
                      className={`bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold group-hover:scale-105 transition-all duration-300 flex items-center gap-2`}
                    >
                      Get Quote
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-effect rounded-3xl p-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Proses Kerja yang{' '}
            <span className="gradient-text">Terstruktur</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Konsultasi & Brief',
                description: 'Diskusi mendalam tentang goals, target audience, dan ekspektasi project'
              },
              {
                step: '02',
                title: 'Strategy & Planning',
                description: 'Pembuatan strategi konten dan timeline yang detail sesuai kebutuhan'
              },
              {
                step: '03',
                title: 'Execution & Creation',
                description: 'Proses kreatif dengan update berkala dan feedback loop yang aktif'
              },
              {
                step: '04',
                title: 'Delivery & Optimization',
                description: 'Penyerahan hasil final dengan panduan dan optimasi berkelanjutan'
              }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold text-white">{process.step}</span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600/50 to-transparent" />
                  )}
                </div>
                <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {process.title}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;