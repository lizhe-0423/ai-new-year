import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

// Sound synthesis helper
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const playBang = () => {
  try {
    if (!AudioContext) return;
    const ctx = getAudioContext();
    const t = ctx.currentTime;

    // Noise (Explosion)
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 1000;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);

    // Crackle (High pitch snap)
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
    
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);

  } catch (e) {
    console.error('Audio play failed', e);
  }
};

const Firecrackers: React.FC = () => {
  const navigate = useNavigate();
  const { settings, toggleSound } = useAppStore();
  const [exploding, setExploding] = useState<number[]>([]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);

  // Generate firecrackers
  const firecrackers = Array.from({ length: 12 }, (_, i) => i);

  const handleExplode = (index: number, x: number, y: number) => {
    if (exploding.includes(index)) return;

    setExploding(prev => [...prev, index]);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (settings.soundEnabled) {
      playBang();
    }

    // Add particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 50,
      y: y + (Math.random() - 0.5) * 50
    }));
    setParticles(prev => [...prev, ...newParticles]);

    // Cleanup particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 500);

    // Reset firecracker after delay
    setTimeout(() => {
      setExploding(prev => prev.filter(i => i !== index));
    }, 2000);
  };

  const handleAutoFire = async () => {
    for (let i = firecrackers.length - 1; i >= 0; i--) {
      const el = document.getElementById(`fc-${i}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        handleExplode(i, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      await new Promise(r => setTimeout(r, 200));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 relative overflow-hidden flex flex-col items-center">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
      >
        <ArrowLeft className="text-red-600" />
      </button>

      {/* Sound Toggle */}
      <button 
        onClick={toggleSound}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
      >
        {settings.soundEnabled ? <Volume2 className="text-red-600" /> : <VolumeX className="text-gray-400" />}
      </button>

      <div className="pt-16 pb-8 flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 flex items-center gap-2">
          <Flame className="text-red-500" /> 电子爆竹
        </h1>

        <div className="relative flex flex-col items-center">
          {/* Main String */}
          <div className="absolute top-0 bottom-0 w-1 bg-yellow-600 z-0"></div>

          {/* Firecrackers */}
          <div className="flex flex-col gap-2 z-10">
            {firecrackers.map((i) => {
              const isExploding = exploding.includes(i);
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  id={`fc-${i}`}
                  key={i}
                  className={`relative w-16 h-6 cursor-pointer ${isLeft ? '-translate-x-6' : 'translate-x-6'}`}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={isExploding ? { opacity: 0, scale: 1.5 } : { opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleExplode(i, rect.left + rect.width/2, rect.top + rect.height/2);
                  }}
                >
                  <div className={`w-full h-full bg-red-600 rounded-sm border border-yellow-400 flex items-center justify-center ${isLeft ? 'origin-right rotate-12' : 'origin-left -rotate-12'}`}>
                    <span className="text-yellow-300 text-[8px] font-bold">福</span>
                  </div>
                  {/* Fuse */}
                  <div className={`absolute top-1/2 w-4 h-0.5 bg-gray-400 ${isLeft ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'}`}></div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Pendant */}
          <div className="mt-4 z-10">
            <div className="w-20 h-20 bg-red-600 rounded-lg rotate-45 border-4 border-yellow-400 flex items-center justify-center shadow-lg">
              <span className="text-4xl text-yellow-400 font-bold -rotate-45">福</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleAutoFire}
          className="mt-12 px-8 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <Flame /> 一键燃放
        </button>

        {/* Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 2, x: p.x + (Math.random()-0.5)*100, y: p.y + (Math.random()-0.5)*100 }}
            transition={{ duration: 0.5 }}
            className="fixed w-2 h-2 bg-yellow-400 rounded-full pointer-events-none z-50"
          />
        ))}
      </div>
    </div>
  );
};

export default Firecrackers;
