import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Step, TestConfig, TestData, UserAnswers, Language } from './types';
import { INITIAL_CONFIG, TRANSLATIONS } from './constants';

// Steps
import LandingStep from './components/Steps/LandingStep';
import ConfigStep from './components/Steps/ConfigStep';
import PromptStep from './components/Steps/PromptStep';
import JsonStep from './components/Steps/JsonStep';
import PracticeStep from './components/Steps/PracticeStep';
import ResultStep from './components/Steps/ResultStep';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [config, setConfig] = useState<TestConfig>(INITIAL_CONFIG);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers | null>(null);

  const t = TRANSLATIONS[lang];

  const updateConfig = (updates: Partial<TestConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleJsonLoaded = (data: TestData) => {
    setTestData(data);
    setStep('practice');
  };

  const handleTestComplete = (answers: UserAnswers) => {
    setUserAnswers(answers);
    setStep('results');
  };

  const handleRestart = () => {
    setStep('config');
    setTestData(null);
    setUserAnswers(null);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'vi' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div 
             className="flex items-center gap-2 font-bold text-xl cursor-pointer" 
             onClick={() => setStep('landing')}
          >
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
               <span className="text-lg">L</span>
            </div>
            <span className="text-slate-800">Lingua<span className="text-brand-600">Craft</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            {step !== 'landing' && (
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide hidden sm:block">
                  {t.steps[step]}
              </div>
            )}
            
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
            >
              <Globe size={16} />
              <span className="uppercase">{lang}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <LandingStep key="landing" t={t} onStart={() => setStep('config')} />
          )}
          
          {step === 'config' && (
            <ConfigStep 
              key="config"
              t={t}
              lang={lang}
              config={config} 
              updateConfig={updateConfig} 
              onNext={() => setStep('prompt')} 
            />
          )}

          {step === 'prompt' && (
            <PromptStep 
              key="prompt"
              t={t}
              lang={lang}
              config={config} 
              onBack={() => setStep('config')}
              onNext={() => setStep('json')} 
            />
          )}

          {step === 'json' && (
            <JsonStep 
              key="json"
              t={t}
              onBack={() => setStep('prompt')}
              onDataLoaded={handleJsonLoaded} 
            />
          )}

          {step === 'practice' && testData && (
            <PracticeStep 
              key="practice"
              t={t}
              data={testData}
              onComplete={handleTestComplete}
            />
          )}

          {step === 'results' && testData && userAnswers && (
            <ResultStep 
              key="results"
              t={t}
              data={testData}
              answers={userAnswers}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;