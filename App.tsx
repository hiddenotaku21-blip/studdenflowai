import React, { useState } from 'react';
import { QuestionState, SolutionData, AppStatus } from './types';
import { solveQuestion } from './services/geminiService';
import InputSection from './components/InputSection';
import SolutionDisplay from './components/SolutionDisplay';
import Mascot from './components/Mascot';
import LiveVoice from './components/LiveVoice';
import ChatInterface from './components/ChatInterface';
import { Terminal, MessageSquare, Mic, PenTool } from 'lucide-react';

type Tab = 'solver' | 'chat' | 'voice';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('solver');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [questionState, setQuestionState] = useState<QuestionState>({
    text: '',
    image: null,
    imagePreview: null
  });
  const [solutionData, setSolutionData] = useState<SolutionData | null>(null);

  const handleSubmit = async () => {
    if (!questionState.text && !questionState.image) return;

    setStatus(AppStatus.LOADING);
    setSolutionData(null);

    try {
      const data = await solveQuestion(questionState.text, questionState.image);
      setSolutionData(data);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-anime-pink selection:text-white">
      {/* Header */}
      <header className="bg-anime-dark/90 backdrop-blur border-b border-anime-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-anime-pink to-anime-purple p-2 rounded-lg shadow-lg rotate-3 hover:rotate-0 transition-transform">
              <Terminal className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-anime font-bold text-transparent bg-clip-text bg-gradient-to-r from-anime-cyan to-anime-pink">
              StudenFlow
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-gray-900/50 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab('solver')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'solver' ? 'bg-anime-cyan text-anime-dark' : 'text-gray-400 hover:text-white'}`}
             >
                <PenTool size={16} /> Solver
             </button>
             <button 
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-anime-pink text-white' : 'text-gray-400 hover:text-white'}`}
             >
                <MessageSquare size={16} /> Chat
             </button>
             <button 
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'voice' ? 'bg-anime-purple text-white' : 'text-gray-400 hover:text-white'}`}
             >
                <Mic size={16} /> Live
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        
        {activeTab === 'solver' && (
            <>
                {/* Intro / Mascot Area */}
                <section className="text-center mb-8 w-full">
                    <Mascot status={status} />
                    {status === AppStatus.IDLE && (
                        <h2 className="text-3xl md:text-5xl font-anime font-bold text-white mt-6 mb-2 drop-shadow-[0_0_10px_rgba(122,162,247,0.5)]">
                            Stuck on a Bug?
                        </h2>
                    )}
                </section>

                {/* Input */}
                <InputSection 
                state={questionState}
                setState={setQuestionState}
                onSubmit={handleSubmit}
                status={status}
                />

                {/* Results */}
                {solutionData && status === AppStatus.SUCCESS && (
                <SolutionDisplay 
                    data={solutionData} 
                    originalQuestion={questionState.text || "Image Question"}
                />
                )}
            </>
        )}

        {activeTab === 'chat' && (
            <div className="w-full animate-fade-in-up">
                <Mascot status={AppStatus.IDLE} />
                <ChatInterface />
            </div>
        )}

        {activeTab === 'voice' && (
            <div className="w-full mt-10">
                <LiveVoice />
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-anime-card border-t border-anime-dark mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Powered by Google Gemini 2.5 Flash, Flash-Lite & 3.0 Pro ⚡</p>
          <p className="mt-1 opacity-50">Designed for Computer Science Students</p>
        </div>
      </footer>
    </div>
  );
};

export default App;