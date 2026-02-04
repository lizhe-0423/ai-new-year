import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollText, Sparkles, Flame } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4 overflow-hidden relative bg-paper-pattern">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 bg-cloud-pattern"></div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-300 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-yellow-200 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-red-400 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 flex flex-col items-center w-full max-w-5xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-16 relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 border-2 border-red-200 rounded-full border-dashed opacity-50"
          />
          <h1 className="text-7xl md:text-9xl font-bold text-red-600 mb-6 tracking-tight drop-shadow-sm font-calligraphy relative z-10">
            AI 年味
          </h1>
          <p className="text-2xl md:text-3xl text-red-800 font-medium tracking-widest font-serif border-t-2 border-b-2 border-red-200 py-2 inline-block">
            用 AI 给年俗加点味儿
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 max-w-6xl">
          {/* Couplet Card */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, translateY: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/couplet')}
            className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-red-50 hover:border-red-300 hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-paper-pattern opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
            
            <div className="bg-red-50 p-6 rounded-2xl mb-6 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300 shadow-inner">
              <ScrollText className="w-10 h-10 text-red-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors font-calligraphy">
              AI 春联大师
            </h2>
            <p className="text-gray-500 font-serif leading-relaxed">
              挥毫泼墨，AI 献瑞<br />定制您的专属祥瑞
            </p>
          </motion.button>

          {/* Fortune Card */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, translateY: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/fortune')}
            className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-yellow-50 hover:border-yellow-300 hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-paper-pattern opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
            
            <div className="bg-yellow-50 p-6 rounded-2xl mb-6 group-hover:bg-yellow-100 group-hover:scale-110 transition-all duration-300 shadow-inner">
              <Sparkles className="w-10 h-10 text-yellow-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-yellow-600 transition-colors font-calligraphy">
              天马测运
            </h2>
            <p className="text-gray-500 font-serif leading-relaxed">
              灵签问卜，马到成功<br />抽取您的新年上上签
            </p>
          </motion.button>

          {/* Firecrackers Card */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, translateY: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/firecrackers')}
            className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-orange-50 hover:border-orange-300 hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-paper-pattern opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>
            
            <div className="bg-orange-50 p-6 rounded-2xl mb-6 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300 shadow-inner">
              <Flame className="w-10 h-10 text-orange-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors font-calligraphy">
              电子爆竹
            </h2>
            <p className="text-gray-500 font-serif leading-relaxed">
              爆竹声中一岁除<br />环保安全听响声
            </p>
          </motion.button>
        </div>
      </motion.div>
      
      <footer className="absolute bottom-6 text-red-800/50 text-sm font-serif">
        © 2026 AI 年味创作赛 · 传承经典 · 科技赋能
      </footer>
    </div>
  );
};

export default Home;
