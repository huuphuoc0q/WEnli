import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { TestConfig, CEFRLevel, Language } from '../../types';
import { LEVELS, GRAMMAR_CATEGORIES } from '../../constants';

interface Props {
  config: TestConfig;
  updateConfig: (updates: Partial<TestConfig>) => void;
  onNext: () => void;
  t: any;
  lang: Language;
}

const ConfigStep: React.FC<Props> = ({ config, updateConfig, onNext, t, lang }) => {
  // Collapse state for grammar categories
  const [openCategories, setOpenCategories] = useState<string[]>(['12 Tenses']);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleTopic = (topic: string) => {
    const isSelected = config.grammarTopics.includes(topic);
    const newTopics = isSelected
      ? config.grammarTopics.filter(t => t !== topic)
      : [...config.grammarTopics, topic];
    updateConfig({ grammarTopics: newTopics });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto w-full pb-24"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">{t.config.title}</h2>
        <p className="text-slate-500 mt-2">{t.config.subtitle}</p>
      </div>

      <div className="space-y-8">
        {/* Level Selection */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-slate-800">{t.config.level_label}</h3>
            <div className="group relative">
              <Info className="w-4 h-4 text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {t.config.level_tooltip}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => updateConfig({ level: level.id })}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                  config.level === level.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-100 hover:border-brand-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl font-bold">{level.id}</span>
                <span className="text-xs mt-1">{level.label}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-4 bg-slate-50 py-2 rounded-lg">
            {t.config.current}: <span className="font-semibold text-brand-600">
              {lang === 'vi' ? LEVELS.find(l => l.id === config.level)?.descVi : LEVELS.find(l => l.id === config.level)?.descEn}
            </span>
          </p>
        </section>

        {/* Grammar Topics - Categorized */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-slate-800">{t.config.grammar_label}</h3>
             <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {config.grammarTopics.length} {t.config.selected}
             </span>
          </div>
          
          <div className="space-y-3">
            {GRAMMAR_CATEGORIES.map((group) => {
              const isOpen = openCategories.includes(group.category);
              const selectedInGroup = group.topics.filter(t => config.grammarTopics.includes(t)).length;
              const displayCategory = lang === 'vi' && group.labelVi ? group.labelVi : group.category;
              
              return (
                <div key={group.category} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => toggleCategory(group.category)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 text-sm">{displayCategory}</span>
                      {selectedInGroup > 0 && (
                        <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {selectedInGroup}
                        </span>
                      )}
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }} 
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white flex flex-wrap gap-2">
                          {group.topics.map(topic => {
                             const isSelected = config.grammarTopics.includes(topic);
                             return (
                                <button
                                  key={topic}
                                  onClick={() => toggleTopic(topic)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border text-left ${
                                    isSelected
                                      ? 'bg-brand-600 text-white border-brand-600'
                                      : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                                  }`}
                                >
                                  {topic}
                                </button>
                             );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {config.grammarTopics.length === 0 && (
            <p className="text-xs text-slate-400 mt-4 italic text-center">
              {t.config.no_topics} {config.level}.
            </p>
          )}
        </section>

        {/* Vocabulary */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{t.config.vocab_label}</h3>
          <p className="text-sm text-slate-500 mb-3">
            {t.config.vocab_desc}
          </p>
          <textarea
            value={config.vocabulary}
            onChange={(e) => updateConfig({ vocabulary: e.target.value })}
            placeholder={t.config.vocab_placeholder}
            className="w-full h-32 p-3 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none bg-slate-50 text-slate-700 placeholder-slate-400 text-sm"
          />
        </section>

        {/* Question Counts */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.config.structure_label}</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">{t.config.part1_label}</label>
                <span className="text-sm font-bold text-brand-600">{config.part1Count}</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={config.part1Count}
                onChange={(e) => updateConfig({ part1Count: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">{t.config.part2_label}</label>
                <span className="text-sm font-bold text-brand-600">{config.part2Count}</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={config.part2Count}
                onChange={(e) => updateConfig({ part2Count: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm font-medium text-slate-600">{t.config.part3_label}</span>
              <span className="text-sm font-semibold text-slate-400">{t.config.part3_fixed}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onNext}
            className="w-full bg-brand-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
          >
            {t.config.cta}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfigStep;