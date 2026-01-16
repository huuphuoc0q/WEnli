import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RefreshCw, CheckCircle, XCircle, ChevronDown, ChevronUp, Save, Download } from 'lucide-react';
import { TestData, UserAnswers, SavedTest } from '../../types';
import { calculateScore } from '../../utils';

interface Props {
  data: TestData;
  answers: UserAnswers;
  onRestart: () => void;
  t: any;
}

const ResultStep: React.FC<Props> = ({ data, answers, onRestart, t }) => {
  const [stats, setStats] = useState({ correct: 0, total: 0, percentage: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Save State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const s = calculateScore(data, answers);
    setStats(s);

    if (s.percentage > 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#1d4ed8']
      });
    }
  }, [data, answers]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getGradeColor = (p: number) => {
    if (p >= 80) return 'text-green-600';
    if (p >= 60) return 'text-blue-600';
    if (p >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSaveToLibrary = () => {
      if (!testTitle.trim()) return;

      const stored = localStorage.getItem('linguaCraft_library');
      const library: SavedTest[] = stored ? JSON.parse(stored) : [];

      const newTest: SavedTest = {
          id: Date.now().toString(),
          title: testTitle,
          date: new Date().toLocaleDateString(),
          jsonContent: JSON.stringify(data, null, 2)
      };

      const updated = [newTest, ...library];
      localStorage.setItem('linguaCraft_library', JSON.stringify(updated));

      setSavedSuccess(true);
      setTimeout(() => {
          setSavedSuccess(false);
          setShowSaveModal(false);
      }, 1500);
  };

  const handleDownload = () => {
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
      element.href = URL.createObjectURL(file);
      element.download = "linguacraft-test.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-3xl mx-auto pb-24"
    >
      {/* Score Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center mb-10 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
         
         {/* Action Icons Top Right */}
         <div className="absolute top-4 right-4 flex gap-2">
            <button 
                onClick={handleDownload}
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                title="Download JSON"
            >
                <Download size={20} />
            </button>
            <button 
                onClick={() => setShowSaveModal(true)}
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                title="Save to Library"
            >
                <Save size={20} />
            </button>
         </div>

         <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.results.complete}</h2>
         <div className={`text-6xl font-black mb-2 ${getGradeColor(stats.percentage)}`}>
            {stats.percentage}%
         </div>
         <p className="text-slate-500 font-medium">
             {t.results.score_text.replace('{correct}', stats.correct).replace('{total}', stats.total)}
         </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 ml-2">{t.results.review}</h3>
        
        {/* Part 1 Review */}
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Part 1</h4>
            {data.part1.map(q => {
                const isCorrect = answers.part1[q.id] === q.answer;
                return (
                    <div key={`p1-${q.id}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div 
                            onClick={() => toggleExpand(`p1-${q.id}`)}
                            className="p-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <div className="mt-1">
                                {isCorrect ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">{q.question}</p>
                                <p className="text-sm mt-1 text-slate-500">
                                    Your answer: <span className={isCorrect ? 'font-semibold text-green-600' : 'font-semibold text-red-500 line-through'}>{answers.part1[q.id]}</span>
                                    {!isCorrect && <span className="ml-2 font-semibold text-green-600">Correct: {q.answer}</span>}
                                </p>
                            </div>
                            {expandedId === `p1-${q.id}` ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                        </div>
                        {expandedId === `p1-${q.id}` && (
                            <div className="bg-slate-50 p-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                                <span className="font-semibold text-brand-600">Explanation:</span> {q.explanation}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* Part 2 Review */}
        <div className="space-y-4 pt-4">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Part 2</h4>
             <div className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="leading-relaxed text-slate-700">
                    {data.part2.passage.split(/(\[\d+\])/g).map((part, i) => {
                         const match = part.match(/\[(\d+)\]/);
                         if (match) {
                             const id = parseInt(match[1]);
                             const blank = data.part2.blanks.find(b => b.id === id);
                             const isCorrect = answers.part2[id] === blank?.answer;
                             return (
                                 <span key={i} className={`inline-block mx-1 px-2 py-0.5 rounded text-sm font-bold border ${isCorrect ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                    {answers.part2[id] || '---'} 
                                    {!isCorrect && <span className="text-xs text-green-700 ml-1">({blank?.answer})</span>}
                                 </span>
                             )
                         }
                         return <span key={i}>{part}</span>
                    })}
                </p>
             </div>
        </div>

         {/* Part 3 Review */}
        <div className="space-y-4 pt-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Part 3</h4>
            {data.part3.questions.map(q => {
                const isCorrect = answers.part3[q.id] === q.answer;
                return (
                    <div key={`p3-${q.id}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div 
                            onClick={() => toggleExpand(`p3-${q.id}`)}
                            className="p-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <div className="mt-1">
                                {isCorrect ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">{q.question}</p>
                                <p className="text-sm mt-1 text-slate-500">
                                    Your answer: <span className={isCorrect ? 'font-semibold text-green-600' : 'font-semibold text-red-500 line-through'}>{answers.part3[q.id]}</span>
                                    {!isCorrect && <span className="ml-2 font-semibold text-green-600">Correct: {q.answer}</span>}
                                </p>
                            </div>
                            {expandedId === `p3-${q.id}` ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                        </div>
                        {expandedId === `p3-${q.id}` && (
                            <div className="bg-slate-50 p-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                                <span className="font-semibold text-brand-600">Explanation:</span> {q.explanation}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-50">
          <div className="max-w-3xl mx-auto">
            <button
                onClick={onRestart}
                className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                <RefreshCw className="w-5 h-5" /> {t.results.create_another}
            </button>
          </div>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
                onClick={() => setShowSaveModal(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{t.json.save_modal_title}</h3>
                    {!savedSuccess ? (
                        <>
                            <p className="text-slate-500 text-sm mb-4">
                                {t.json.save_placeholder}
                            </p>
                            <input 
                                type="text"
                                autoFocus
                                value={testTitle}
                                onChange={e => setTestTitle(e.target.value)}
                                placeholder="E.g. Travel Vocabulary B1"
                                className="w-full p-3 border border-slate-300 rounded-xl mb-6 focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowSaveModal(false)}
                                    className="flex-1 py-3 font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                                >
                                    {t.json.cancel}
                                </button>
                                <button 
                                    onClick={handleSaveToLibrary}
                                    className="flex-1 py-3 font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700"
                                >
                                    {t.json.save}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-8 text-center text-green-600">
                            <CheckCircle size={48} className="mx-auto mb-4" />
                            <p className="text-lg font-bold">{t.results.save_success}</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultStep;