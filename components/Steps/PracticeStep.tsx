import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Circle, Highlighter } from 'lucide-react';
import { TestData, UserAnswers } from '../../types';

interface Props {
  data: TestData;
  onComplete: (answers: UserAnswers) => void;
  t: any;
}

type Part = 'part1' | 'part2' | 'part3';

interface HighlightRange {
  start: number;
  end: number;
}

const PracticeStep: React.FC<Props> = ({ data, onComplete, t }) => {
  const [currentPart, setCurrentPart] = useState<Part>('part1');
  // For Part 1, we track current question index
  const [p1Index, setP1Index] = useState(0);

  const [answers, setAnswers] = useState<UserAnswers>({
    part1: {},
    part2: {},
    part3: {}
  });

  const [highlightMode, setHighlightMode] = useState(true);
  const [highlights, setHighlights] = useState<Record<string, HighlightRange[]>>({});
  const textRefMap = useRef<Record<string, HTMLElement | null>>({});

  const handleAnswer = (part: Part, id: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [part]: { ...prev[part], [id]: value }
    }));
  };

  const handleTextSelection = (textId: string) => {
    if (!highlightMode) return;

    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;

    const element = textRefMap.current[textId];
    if (!element) return;

    try {
      // Get the selected text
      const selectedText = selection.toString();
      const elementText = element.innerText || element.textContent || '';
      
      // Find the exact position of selected text in element
      const start = elementText.indexOf(selectedText);
      if (start === -1) return; // Text not found
      
      const end = start + selectedText.length;

      setHighlights(prev => ({
        ...prev,
        [textId]: [...(prev[textId] || []), { start, end }]
      }));

      selection.removeAllRanges();
    } catch (e) {
      console.error('Error highlighting text:', e);
    }
  };

  const clearHighlights = (textId: string) => {
    setHighlights(prev => ({
      ...prev,
      [textId]: []
    }));
  };

  const renderHighlightedText = (text: string, textId: string) => {
    const textHighlights = highlights[textId] || [];
    
    if (textHighlights.length === 0) {
      return text;
    }

    // Sort and merge overlapping highlights
    const sorted = [...textHighlights].sort((a, b) => a.start - b.start);
    const merged: HighlightRange[] = [];

    sorted.forEach(hl => {
      if (merged.length === 0) {
        merged.push(hl);
      } else {
        const last = merged[merged.length - 1];
        if (hl.start <= last.end) {
          // Overlapping or adjacent - merge them
          last.end = Math.max(last.end, hl.end);
        } else {
          merged.push(hl);
        }
      }
    });

    // Create array to track which parts are highlighted
    const parts: { text: string; highlighted: boolean }[] = [];
    let lastEnd = 0;

    merged.forEach(hl => {
      if (hl.start > lastEnd) {
        parts.push({ text: text.substring(lastEnd, hl.start), highlighted: false });
      }
      parts.push({ text: text.substring(hl.start, hl.end), highlighted: true });
      lastEnd = hl.end;
    });

    if (lastEnd < text.length) {
      parts.push({ text: text.substring(lastEnd), highlighted: false });
    }

    return (
      <span>
        {parts.map((part, idx) =>
          part.highlighted ? (
            <span key={idx} className="bg-yellow-300">
              {part.text}
            </span>
          ) : (
            <span key={idx}>{part.text}</span>
          )
        )}
      </span>
    );
  };

  // Navigation Logic
  const goNext = () => {
    if (currentPart === 'part1') {
      if (p1Index < data.part1.length - 1) {
        setP1Index(p1Index + 1);
      } else {
        setCurrentPart('part2');
      }
    } else if (currentPart === 'part2') {
      setCurrentPart('part3');
    } else {
      onComplete(answers);
    }
  };

  const goBack = () => {
    if (currentPart === 'part3') {
      setCurrentPart('part2');
    } else if (currentPart === 'part2') {
      setCurrentPart('part1');
      setP1Index(data.part1.length - 1);
    } else {
      if (p1Index > 0) setP1Index(p1Index - 1);
    }
  };

  // Progress Calculations
  const totalQuestions = data.part1.length + data.part2.blanks.length + data.part3.questions.length;
  const answeredCount = 
    Object.keys(answers.part1).length + 
    Object.keys(answers.part2).length + 
    Object.keys(answers.part3).length;
  const progress = (answeredCount / totalQuestions) * 100;

  // Renderers
  const renderPart1 = () => {
    const q = data.part1[p1Index];
    const textId = `part1-q${q.id}`;
    return (
      <motion.div 
        key={`p1-${q.id}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="mb-4 text-sm font-bold text-brand-600 uppercase tracking-wider">
          {t.practice.part1_title} ({p1Index + 1}/{data.part1.length})
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-start mb-6 gap-4">
            <h3 
              ref={(el) => { textRefMap.current[textId] = el; }}
              onMouseUp={() => handleTextSelection(textId)}
              className={`text-xl font-medium text-slate-900 leading-relaxed flex-1 ${highlightMode ? 'cursor-text select-text' : ''}`}
            >
              {renderHighlightedText(q.question, textId)}
            </h3>
            {highlightMode && highlights[textId]?.length > 0 && (
              <button
                onClick={() => clearHighlights(textId)}
                className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 whitespace-nowrap mt-1"
              >
                Clear Highlights
              </button>
            )}
          </div>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
               const isSelected = answers.part1[q.id] === opt;
               return (
                <button
                    key={idx}
                    onClick={() => handleAnswer('part1', q.id, opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                    isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-900'
                        : 'border-slate-100 hover:border-brand-200 hover:bg-slate-50 text-slate-600'
                    }`}
                >
                    <span className="font-medium">{opt}</span>
                    {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-brand-600" />
                    ) : (
                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-brand-300" />
                    )}
                </button>
               )
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPart2 = () => {
    // We need to split the passage by markers like [1], [2] etc.
    const parts = data.part2.passage.split(/(\[\d+\])/g);
    const textId = 'part2-passage';
    
    return (
      <motion.div 
        key="part2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="mb-4 text-sm font-bold text-brand-600 uppercase tracking-wider flex justify-between items-center">
          <span>{t.practice.part2_title}</span>
          {highlightMode && (
            <button
              onClick={() => clearHighlights(textId)}
              className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 flex items-center gap-1"
            >
              Clear Highlights
            </button>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div
              ref={(el) => { textRefMap.current[textId] = el; }}
              onMouseUp={() => handleTextSelection(textId)}
              className={`text-lg leading-loose text-slate-800 font-serif ${highlightMode ? 'cursor-text select-text' : ''}`}
            >
                {parts.map((part, index) => {
                    const match = part.match(/\[(\d+)\]/);
                    if (match) {
                        const id = parseInt(match[1]);
                        const blank = data.part2.blanks.find(b => b.id === id);
                        if (!blank) return <span key={index} className="text-red-500">[?]</span>;

                        const val = answers.part2[id] || "";
                        
                        return (
                            <span key={index} className="inline-block mx-1 align-middle">
                                <select 
                                    value={val}
                                    onChange={(e) => handleAnswer('part2', id, e.target.value)}
                                    className={`appearance-none bg-brand-50 border border-brand-200 text-brand-900 py-1 px-3 pr-8 rounded-lg font-sans font-medium text-base focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer hover:bg-brand-100 transition-colors ${!val ? 'text-slate-400' : ''}`}
                                    style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.2rem center`, backgroundSize: `1.5em 1.5em`, backgroundRepeat: 'no-repeat'}}
                                >
                                    <option value="" disabled>{t.practice.select}</option>
                                    {blank.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </span>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </div>
        </div>
      </motion.div>
    );
  };

  const renderPart3 = () => {
    const textId = 'part3-passage';
    return (
      <motion.div 
        key="part3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="lg:h-[calc(100vh-200px)] lg:overflow-y-auto lg:sticky lg:top-8 pr-2 custom-scrollbar">
            <div className="mb-4 text-sm font-bold text-brand-600 uppercase tracking-wider flex justify-between items-center">
              <span>{t.practice.part3_passage}</span>
              {highlightMode && highlights[textId]?.length > 0 && (
                <button
                  onClick={() => clearHighlights(textId)}
                  className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
            <div
              ref={(el) => { textRefMap.current[textId] = el; }}
              onMouseUp={() => handleTextSelection(textId)}
              className={`bg-slate-50 rounded-2xl p-6 border border-slate-200 font-serif text-lg leading-relaxed text-slate-800 ${highlightMode ? 'cursor-text select-text' : ''}`}
            >
                {renderHighlightedText(data.part3.passage, textId)}
            </div>
        </div>
        
        <div className="space-y-8 pb-20">
            <div className="mb-4 text-sm font-bold text-brand-600 uppercase tracking-wider">
             {t.practice.part3_questions}
            </div>
            {data.part3.questions.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">
                        <span className="text-slate-400 mr-2">{idx + 1}.</span>
                        {q.question}
                    </h4>
                    <div className="space-y-2">
                        {q.options.map(opt => {
                            const isSelected = answers.part3[q.id] === opt;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer('part3', q.id, opt)}
                                    className={`w-full text-left p-3 rounded-lg text-sm border transition-colors ${
                                        isSelected 
                                        ? 'bg-brand-50 border-brand-500 text-brand-800 font-medium' 
                                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full pb-24">
      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span className={currentPart === 'part1' ? 'text-brand-600 font-bold' : ''}>Part 1</span>
                <span className="text-slate-300">/</span>
                <span className={currentPart === 'part2' ? 'text-brand-600 font-bold' : ''}>Part 2</span>
                <span className="text-slate-300">/</span>
                <span className={currentPart === 'part3' ? 'text-brand-600 font-bold' : ''}>Part 3</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setHighlightMode(!highlightMode);
                  if (!highlightMode) {
                    setHighlights({});
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  highlightMode 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title="Toggle highlight mode (Drag to select text)"
              >
                <Highlighter size={16} />
                {highlightMode ? 'ON' : 'OFF'}
              </button>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
        </div>
      </div>

      {/* Main Content Area - Padded for header */}
      <div className="pt-24 px-4">
        <AnimatePresence mode="wait">
            {currentPart === 'part1' && renderPart1()}
            {currentPart === 'part2' && renderPart2()}
            {currentPart === 'part3' && renderPart3()}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
                onClick={goBack}
                disabled={currentPart === 'part1' && p1Index === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
                <ArrowLeft size={18} /> {t.practice.prev}
            </button>
            
            <button
                onClick={goNext}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 shadow-lg shadow-brand-500/20"
            >
                {currentPart === 'part3' ? t.practice.finish : t.practice.next} <ArrowRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeStep;