import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, PlayCircle, ClipboardPaste, Save, Trash2, BookOpen, Upload } from 'lucide-react';
import { TestData, SavedTest } from '../../types';
import { cleanJsonInput, SAMPLE_TESTS } from '../../utils';

interface Props {
  onDataLoaded: (data: TestData) => void;
  onBack: () => void;
  t: any;
}

const JsonStep: React.FC<Props> = ({ onDataLoaded, onBack, t }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Library State
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState('');

  // Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('linguaCraft_library');
    if (stored) {
      setSavedTests(JSON.parse(stored));
    } else {
      // Add multiple sample tests if library is empty
      const defaults = SAMPLE_TESTS.map((t, i) => ({
        id: `sample-${i}`,
        title: t.title,
        date: new Date().toLocaleDateString(),
        jsonContent: t.content
      }));
      setSavedTests(defaults);
      localStorage.setItem('linguaCraft_library', JSON.stringify(defaults));
    }
  }, []);

  const handlePaste = async () => {
      try {
          const text = await navigator.clipboard.readText();
          setInput(text);
          setError(null);
      } catch (err) {
          console.error("Failed to read clipboard:", err);
      }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
            // Validate JSON roughly
            cleanJsonInput(text);
            setInput(text);
            setError(null);
        } catch (err) {
            setError(t.json.error_invalid);
        }
    };
    reader.readAsText(file);
    // Reset value so same file can be selected again
    event.target.value = '';
  };

  const handleSaveTest = () => {
    if (!input.trim()) return;
    if (!newTestTitle.trim()) {
        alert("Please enter a title.");
        return;
    }

    try {
        // Validate before saving
        const cleaned = cleanJsonInput(input);
        JSON.parse(cleaned); // Check valid JSON

        const newTest: SavedTest = {
            id: Date.now().toString(),
            title: newTestTitle,
            date: new Date().toLocaleDateString(),
            jsonContent: cleaned
        };

        const updated = [newTest, ...savedTests];
        setSavedTests(updated);
        localStorage.setItem('linguaCraft_library', JSON.stringify(updated));
        
        setShowSaveInput(false);
        setNewTestTitle('');
        setError(null);
    } catch (e) {
        setError(`${t.json.error_invalid} (Save)`);
    }
  };

  const handleDeleteTest = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updated = savedTests.filter(t => t.id !== id);
      setSavedTests(updated);
      localStorage.setItem('linguaCraft_library', JSON.stringify(updated));
  };

  const handleLoadTest = (test: SavedTest) => {
      setInput(test.jsonContent);
      setError(null);
  };

  const validateAndParse = () => {
    if (!input.trim()) {
      setError(t.json.error_empty);
      return;
    }

    try {
      const cleaned = cleanJsonInput(input);
      const data = JSON.parse(cleaned);

      // Basic Schema Validation
      if (!data.part1 || !Array.isArray(data.part1)) throw new Error("Missing 'part1' array in JSON.");
      if (!data.part2 || !data.part2.blanks) throw new Error("Missing 'part2' structure in JSON.");
      if (!data.part3 || !data.part3.questions) throw new Error("Missing 'part3' structure in JSON.");

      onDataLoaded(data as TestData);
    } catch (e: any) {
      setError(`${t.json.error_invalid}: ${e.message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* LEFT COLUMN: Editor & Main Actions */}
      <div className="lg:col-span-2 order-2 lg:order-1">
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">{t.json.title}</h2>
            <p className="text-slate-500 mt-2">
            {t.json.subtitle}
            </p>
        </div>

        <div className="relative mb-6 group">
            <div className="absolute top-3 right-3 z-10 flex gap-2">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".json" 
                    className="hidden" 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                    title={t.json.import}
                >
                    <Upload size={14} /> {t.json.import}
                </button>
                <button 
                    onClick={() => setShowSaveInput(true)}
                    className="text-xs flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 text-slate-600 transition-colors shadow-sm"
                    title={t.json.save}
                >
                    <Save size={14} /> {t.json.save}
                </button>
                <button 
                    onClick={handlePaste}
                    className="text-xs flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                >
                    <ClipboardPaste size={14} /> {t.json.paste}
                </button>
            </div>
            
            <textarea
            value={input}
            onChange={(e) => {
                setInput(e.target.value);
                setError(null);
            }}
            placeholder='{ "part1": [ ... ] }'
            className={`w-full h-[500px] p-4 rounded-xl border-2 font-mono text-xs md:text-sm resize-none focus:ring-4 outline-none transition-all ${
                error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-900' 
                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100 bg-white text-slate-800'
            }`}
            />
            {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
            </div>
            )}

            {/* Save Overlay */}
            <AnimatePresence>
                {showSaveInput && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-b border-slate-200 rounded-t-xl z-20 flex flex-col gap-3 shadow-sm"
                    >
                        <label className="text-sm font-semibold text-slate-700">{t.json.save_modal_title}</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newTestTitle}
                                onChange={(e) => setNewTestTitle(e.target.value)}
                                placeholder={t.json.save_placeholder}
                                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                autoFocus
                            />
                            <button 
                                onClick={handleSaveTest}
                                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
                            >
                                {t.json.confirm}
                            </button>
                            <button 
                                onClick={() => setShowSaveInput(false)}
                                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200"
                            >
                                {t.json.cancel}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="flex gap-4">
            <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
            {t.prompt.btn_back}
            </button>
            <button
            onClick={validateAndParse}
            disabled={!input.trim()}
            className="flex-1 py-3 px-6 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <PlayCircle className="w-5 h-5" /> {t.json.render}
            </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Library */}
      <div className="lg:col-span-1 order-1 lg:order-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full max-h-[600px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <BookOpen className="w-5 h-5 text-brand-600" />
                    <h3>{t.json.library}</h3>
                </div>
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {savedTests.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {savedTests.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <div className="mb-2 opacity-50"><BookOpen size={40} className="mx-auto" /></div>
                        <p className="text-sm">{t.json.library_empty}</p>
                        <p className="text-xs mt-1">{t.json.library_tip}</p>
                    </div>
                ) : (
                    savedTests.map((test) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={test.id}
                            onClick={() => handleLoadTest(test)}
                            className="group relative bg-white border border-slate-100 p-3 rounded-xl hover:border-brand-300 hover:shadow-md transition-all cursor-pointer text-left"
                        >
                            <h4 className="font-medium text-slate-800 text-sm line-clamp-1 pr-6">{test.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{test.date}</p>
                            
                            <button
                                onClick={(e) => handleDeleteTest(test.id, e)}
                                className="absolute right-2 top-2 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Test"
                            >
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                 <p className="text-xs text-slate-400">
                    {t.json.pro_tip}
                 </p>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JsonStep;