import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2, Copy, RefreshCw } from 'lucide-react';
import { generateCouplet } from '../services/ai';
import { useAppStore } from '../store/useAppStore';
import { CoupletResponse } from '../types';

const Couplet: React.FC = () => {
  const navigate = useNavigate();
  const addCoupletHistory = useAppStore((state) => state.addCoupletHistory);
  
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoupletResponse | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateCouplet({ theme });
      setResult(data);
      addCoupletHistory(data);
    } catch (err: any) {
      setError(err.message || '生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 relative overflow-y-auto bg-paper-pattern">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
      >
        <ArrowLeft className="text-red-600" />
      </button>

      <div className="max-w-4xl mx-auto pt-16 pb-8 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-8 flex items-center gap-4 font-calligraphy tracking-wide drop-shadow-sm">
          <span className="text-6xl animate-bounce">🧧</span> AI 春联大师
        </h1>

        {/* Input Section */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12 border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400"></div>
          
          <div className="flex flex-col gap-5">
            <label className="text-gray-700 font-bold font-serif text-lg text-center">🏮 祈愿主题 🏮</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例如：程序员、暴富、猫咪..."
                className="flex-1 px-5 py-3 rounded-xl border-2 border-red-100 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-serif bg-red-50/30"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !theme.trim()}
                className="bg-red-600 text-yellow-50 px-6 py-3 rounded-xl hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-bold shadow-lg shadow-red-200 hover:shadow-red-300 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? '撰写中' : '生成'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center font-serif">{error}</p>}
          </div>
        </div>

        {/* Result Display */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full flex flex-col items-center gap-10"
            >
              {/* Couplet Display Area */}
              <div className="relative p-8 rounded-2xl bg-red-50/50">
                
                {/* Horizontal Scroll (Hengpi) */}
                <div className="flex justify-center mb-8">
                  <div className="bg-[#D40000] text-[#FFD700] px-10 py-4 rounded shadow-2xl border-2 border-[#FFD700] relative overflow-hidden transform hover:scale-105 transition-transform duration-500">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20"></div>
                     <div className="absolute inset-0 border border-[#B00000] rounded opacity-50 m-1"></div>
                     <span className="text-4xl md:text-5xl font-bold tracking-[0.4em] font-calligraphy drop-shadow-md">{result.horizontal}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-8 md:gap-20 w-full">
                  {/* Upper Scroll (Shanglian) */}
                  <div className="bg-[#D40000] text-[#FFD700] w-24 md:w-32 py-10 rounded shadow-2xl border-2 border-[#FFD700] flex flex-col items-center relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20"></div>
                    <div className="absolute inset-0 border border-[#B00000] rounded opacity-50 m-1"></div>
                    {result.upper.split('').map((char, i) => (
                      <span key={i} className="text-5xl md:text-6xl font-bold font-calligraphy py-2 block drop-shadow-md">
                        {char}
                      </span>
                    ))}
                  </div>

                  {/* Lower Scroll (Xialian) */}
                  <div className="bg-[#D40000] text-[#FFD700] w-24 md:w-32 py-10 rounded shadow-2xl border-2 border-[#FFD700] flex flex-col items-center relative overflow-hidden transform hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20"></div>
                    <div className="absolute inset-0 border border-[#B00000] rounded opacity-50 m-1"></div>
                    {result.lower.split('').map((char, i) => (
                      <span key={i} className="text-5xl md:text-6xl font-bold font-calligraphy py-2 block drop-shadow-md">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Explanation & Actions */}
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl max-w-2xl text-center shadow-xl border border-red-50">
                <div className="inline-block px-4 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold mb-4 font-serif">寓意解读</div>
                <p className="text-gray-700 leading-loose mb-8 font-serif text-lg">{result.explanation}</p>
                
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => {
                      const text = `上联：${result.upper}\n下联：${result.lower}\n横批：${result.horizontal}`;
                      navigator.clipboard.writeText(text);
                    }}
                    className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-200 hover:border-red-200 font-medium"
                  >
                    <Copy size={18} /> 复制文案
                  </button>
                  <button 
                    onClick={() => handleGenerate()}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 hover:shadow-red-200 transition-all font-medium active:scale-95"
                  >
                    <RefreshCw size={18} /> 再来一副
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Couplet;
