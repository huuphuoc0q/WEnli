import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, FileJson, PenTool } from 'lucide-react';

interface Props {
  onStart: () => void;
  t: any;
}

const LandingStep: React.FC<Props> = ({ onStart, t }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full mb-8 border border-brand-100 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{t.landing.tag}</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          {t.landing.title1} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
            {t.landing.title2}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
          {t.landing.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          {[
            { icon: BrainCircuit, title: `1. ${t.landing.step1}`, text: t.landing.step1_desc },
            { icon: FileJson, title: `2. ${t.landing.step2}`, text: t.landing.step2_desc },
            { icon: PenTool, title: `3. ${t.landing.step3}`, text: t.landing.step3_desc },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-brand-600 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600"
        >
          <span>{t.landing.cta}</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};

export default LandingStep;