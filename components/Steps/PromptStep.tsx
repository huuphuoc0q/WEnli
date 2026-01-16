import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { TestConfig, Language } from '../../types';
import { generatePrompt } from '../../utils';

interface Props {
  config: TestConfig;
  onNext: () => void;
  onBack: () => void;
  t: any;
  lang: Language;
}

const PromptStep: React.FC<Props> = ({ config, onNext, onBack, t, lang }) => {
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPrompt(generatePrompt(config, lang));
  }, [config, lang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">{t.prompt.title}</h2>
        <p className="text-slate-500 mt-2">
          {t.prompt.subtitle}
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-1 shadow-2xl overflow-hidden mb-8 relative group">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copied 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" /> {t.prompt.copied}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> {t.prompt.copy}
              </>
            )}
          </button>
        </div>
        
        {/* Code/Prompt Display */}
        <div className="bg-slate-950 p-6 pt-14 rounded-xl overflow-x-auto max-h-[50vh] custom-scrollbar">
          <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {prompt}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
         <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
               <ExternalLink size={20} />
            </div>
            <div>
               <h4 className="font-semibold text-slate-800">{t.prompt.use_ai}</h4>
               <p className="text-xs text-slate-500 mt-1">{t.prompt.use_ai_desc}</p>
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
               <ArrowRight size={20} />
            </div>
            <div>
               <h4 className="font-semibold text-slate-800">{t.prompt.next}</h4>
               <p className="text-xs text-slate-500 mt-1">{t.prompt.next_desc}</p>
            </div>
         </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
        >
          {t.prompt.btn_back}
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 px-6 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
        >
          {t.prompt.btn_next} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default PromptStep;