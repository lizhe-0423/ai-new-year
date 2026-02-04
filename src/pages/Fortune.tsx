import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, BookOpen, X, RefreshCw, Share2 } from 'lucide-react';
import { generateFortune } from '../services/ai';
import { useAppStore } from '../store/useAppStore';
import { FortuneCard } from '../types';

// Trigram symbol mapping
const TRIGRAM_SYMBOLS: Record<string, string> = {
  '乾': '☰',
  '坤': '☷',
  '震': '☳',
  '巽': '☴',
  '坎': '☵',
  '离': '☲',
  '艮': '☶',
  '兑': '☱'
};

const Fortune: React.FC = () => {
  const navigate = useNavigate();
  const addFortuneHistory = useAppStore((state) => state.addFortuneHistory);
  
  // Game States: 'selection' | 'drawing' | 'revealed' | 'interpretation'
  const [gameState, setGameState] = useState<'selection' | 'drawing' | 'revealed' | 'interpretation'>('selection');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [fortune, setFortune] = useState<FortuneCard | null>(null);
  const [error, setError] = useState('');

  // 8 Cards for the grid
  const cards = Array.from({ length: 8 }, (_, i) => i);

  const handleCardSelect = async (index: number) => {
    if (gameState !== 'selection') return;
    
    setSelectedCardIndex(index);
    setGameState('drawing');
    setError('');

    try {
      // Minimum loading time for effect
      const [data] = await Promise.all([
        generateFortune(),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      setFortune(data);
      addFortuneHistory(data);
      setGameState('revealed');
    } catch (err: any) {
      setError(err.message || '求签失败，请心诚则灵(重试)');
      setGameState('selection');
      setSelectedCardIndex(null);
    }
  };

  const resetFortune = () => {
    setGameState('selection');
    setFortune(null);
    setSelectedCardIndex(null);
    setError('');
  };

  const handleShare = () => {
    if (!fortune) return;
    
    const text = `【天马测运】2026丙午马年
----------------
卦象：上${fortune.upper_trigram || ''}下${fortune.lower_trigram || ''}
----------------
${fortune.title}
----------------
${fortune.content}
----------------
解曰：${fortune.blessing}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('运势已复制到剪贴板，快去分享给好友吧！');
    }).catch(() => {
      alert('复制失败，请截图分享');
    });
  };

  return (
    <div className="min-h-screen bg-paper-pattern p-4 relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-red-50/90 pointer-events-none"></div>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-colors z-20"
      >
        <ArrowLeft className="text-red-600" />
      </button>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center h-full pt-16 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-2 flex items-center gap-3 font-calligraphy drop-shadow-sm">
          <Sparkles className="text-yellow-500 w-8 h-8" /> 天马测运
        </h1>
        <p className="text-red-800/70 mb-8 font-serif tracking-widest">
          {gameState === 'selection' ? '请凭直觉选取一张灵签' : 
           gameState === 'drawing' ? '正在诚心祈福...' : 
           '丙午马年 · 运势详解'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STATE: SELECTION & DRAWING */}
          {(gameState === 'selection' || gameState === 'drawing') && (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl px-4"
            >
              {cards.map((index) => (
                <motion.div
                  key={index}
                  layoutId={`card-${index}`}
                  onClick={() => handleCardSelect(index)}
                  className={`
                    aspect-[2/3] rounded-xl cursor-pointer relative transform transition-all duration-300
                    ${gameState === 'drawing' && selectedCardIndex !== index ? 'opacity-0 scale-90' : ''}
                    ${gameState === 'drawing' && selectedCardIndex === index ? 'scale-105 z-20' : 'hover:scale-105 hover:-translate-y-2'}
                  `}
                >
                  {/* Card Back */}
                  <div className="absolute inset-0 bg-[#D40000] rounded-xl shadow-lg border-2 border-[#FFD700] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-paper-pattern opacity-20"></div>
                    <div className="w-16 h-16 border-2 border-[#FFD700]/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-[#FFD700]">🐴</span>
                    </div>
                  </div>
                  
                  {/* Loading State Overlay */}
                  {gameState === 'drawing' && selectedCardIndex === index && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-sm z-30">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* STATE: REVEALED */}
          {gameState === 'revealed' && fortune && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative w-full max-w-md perspective-1000 px-4"
            >
              <div className="w-full bg-[#FFFBF0] rounded-3xl shadow-2xl border-4 border-red-200 p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden min-h-[500px]">
                {/* Texture */}
                <div className="absolute inset-0 bg-paper-pattern opacity-40 pointer-events-none"></div>
                
                {/* Content */}
                <div className="relative z-10 w-full flex flex-col h-full">
                  {/* Header: Trigrams */}
                  <div className="flex justify-between items-center mb-6 px-4 py-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 mb-1">上卦</span>
                      <span className="text-3xl font-serif text-red-800">{TRIGRAM_SYMBOLS[fortune.upper_trigram || ''] || '☰'}</span>
                      <span className="text-lg font-calligraphy text-red-600">{fortune.upper_trigram || '乾'}</span>
                    </div>
                    <div className="h-10 w-px bg-red-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 mb-1">下卦</span>
                      <span className="text-3xl font-serif text-red-800">{TRIGRAM_SYMBOLS[fortune.lower_trigram || ''] || '☷'}</span>
                      <span className="text-lg font-calligraphy text-red-600">{fortune.lower_trigram || '坤'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-5xl font-bold text-red-600 mb-6 font-calligraphy tracking-widest drop-shadow-sm">
                    {fortune.title}
                  </h2>

                  {/* Poem / Sign */}
                  <div className="flex-1 flex items-center justify-center mb-8">
                    <div className="text-xl md:text-2xl font-serif font-bold text-gray-800 leading-loose whitespace-pre-wrap writing-vertical-rl md:writing-horizontal-tb border-y-2 border-red-100 py-4 px-8">
                      {fortune.content}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-4 justify-center">
                    <button
                      onClick={() => setGameState('interpretation')}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 hover:scale-105 transition-all font-medium text-lg"
                    >
                      <BookOpen size={20} /> 解签
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all border border-red-200"
                      title="分享"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={resetFortune}
                      className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all border border-gray-200"
                      title="重抽"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATE: INTERPRETATION MODAL */}
        <AnimatePresence>
          {gameState === 'interpretation' && fortune && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setGameState('revealed')}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#FFFBF0] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                {/* Modal Header */}
                <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold font-calligraphy flex items-center gap-2">
                    <BookOpen size={20} /> 大师解签
                  </h3>
                  <button onClick={() => setGameState('revealed')} className="hover:bg-red-700 p-1 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="mb-6 text-center">
                    <span className="text-4xl mb-2 block">{
                      fortune.type === 'love' ? '❤️' : 
                      fortune.type === 'wealth' ? '💰' : 
                      fortune.type === 'career' ? '💼' : '🍎'
                    }</span>
                    <h4 className="text-2xl font-bold text-red-800 font-calligraphy">{fortune.title}</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <h5 className="font-bold text-red-700 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                        签文
                      </h5>
                      <p className="text-gray-700 font-serif font-medium whitespace-pre-wrap">{fortune.content}</p>
                    </div>

                    <div className="prose prose-red max-w-none">
                      <h5 className="font-bold text-red-700 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                        详解
                      </h5>
                      <p className="text-gray-700 font-serif leading-relaxed text-justify whitespace-pre-wrap">
                        {fortune.blessing}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <button 
                    onClick={() => setGameState('revealed')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    我知道了
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Fortune;
