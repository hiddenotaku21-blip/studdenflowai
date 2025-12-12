import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SolutionData } from '../types';
import { Download, BookOpen, Star, Terminal, Copy, Check, Share2 } from 'lucide-react';
import { generatePDF } from '../services/pdfService';

interface SolutionDisplayProps {
  data: SolutionData;
  originalQuestion: string;
}

const CodeBlock = ({ children, className }: any) => {
  const [copied, setCopied] = React.useState(false);
  // Extract language from className (format: language-js)
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'code';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-700 shadow-2xl bg-[#0d0d0d] font-mono text-sm">
      {/* Terminal Header */}
      <div className="bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
        </div>
        <div className="flex items-center gap-4">
           {language && <span className="text-gray-500 text-xs uppercase tracking-wider select-none hidden sm:inline-block">{language}</span>}
           <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
           </button>
        </div>
      </div>
      
      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <code className={`block ${className} text-gray-200`}>
          {children}
        </code>
      </div>
    </div>
  );
};

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ data, originalQuestion }) => {
  const [shared, setShared] = React.useState(false);
  
  const handleDownload = () => {
    generatePDF(originalQuestion, data.solution);
  };

  const handleShare = () => {
    const textToShare = data.rawMarkdown || `${data.solution}\n\n${data.explanation}`;
    navigator.clipboard.writeText(textToShare);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-10 pb-20 animate-fade-in-up">
      
      {/* Formal Solution Card */}
      <div className="bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden anime-border">
        <div className="bg-gray-100 p-4 border-b border-gray-300 flex justify-between items-center flex-wrap gap-2">
            <h2 className="flex items-center gap-2 font-bold text-xl text-gray-800">
                <BookOpen className="text-blue-600" />
                Academic Solution
            </h2>
            <div className="flex gap-2">
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow transition-colors text-sm font-bold"
                >
                    {shared ? <Check size={16} /> : <Share2 size={16} />}
                    {shared ? "Copied!" : "Share"}
                </button>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors text-sm font-bold"
                >
                    <Download size={16} />
                    Download PDF
                </button>
            </div>
        </div>
        <div className="p-6 prose prose-slate max-w-none">
            <ReactMarkdown 
              components={{
                code({node, inline, className, children, ...props}: any) {
                  if (!inline && (className?.includes('language') || String(children).includes('\n'))) {
                    return <CodeBlock className={className}>{children}</CodeBlock>;
                  }
                  return <code className="bg-gray-200 px-1 py-0.5 rounded text-red-600 font-mono text-sm" {...props}>{children}</code>;
                }
              }}
            >
              {data.solution}
            </ReactMarkdown>
        </div>
      </div>

      {/* Anime Explanation Card */}
      <div className="relative bg-anime-dark border-4 border-anime-pink rounded-2xl p-1 shadow-[0_0_20px_rgba(255,121,198,0.3)]">
        {/* Decorative corners */}
        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-anime-cyan rounded-tl-lg"></div>
        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-anime-cyan rounded-br-lg"></div>

        <div className="bg-anime-card rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-anime-pink to-purple-600 p-4 flex items-center gap-3">
                <Star className="text-yellow-300 fill-current animate-spin-slow" />
                <h2 className="font-anime text-2xl text-white font-bold tracking-wider uppercase italic">
                    Sensei's Corner!
                </h2>
            </div>
            <div className="p-8 text-gray-100 text-lg leading-relaxed font-body">
                 <ReactMarkdown 
                    components={{
                        strong: ({node, ...props}) => <span className="text-anime-pink font-bold" {...props} />,
                        em: ({node, ...props}) => <span className="text-anime-cyan italic" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-anime-accent text-xl font-bold mt-4 mb-2" {...props} />,
                         code({node, inline, className, children, ...props}: any) {
                             if (!inline) return <CodeBlock className={className}>{children}</CodeBlock>;
                             return <code className="bg-gray-700 px-1 py-0.5 rounded text-anime-accent font-mono text-sm" {...props}>{children}</code>;
                         }
                    }}
                 >
                    {data.explanation}
                 </ReactMarkdown>
            </div>
        </div>
      </div>

    </div>
  );
};

export default SolutionDisplay;