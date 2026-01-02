
import React, { useState } from 'react';
import { Student, GenerationResult } from '../types';

interface ResultCardProps {
  student: Student;
  result: GenerationResult;
  onUpdateText: (newText: string) => void;
  onRegenerate: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ student, result, onUpdateText, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4 hover:shadow-md transition-shadow">
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <span className="font-semibold text-sm">{student.number}번 {student.name}</span>
        <div className="flex gap-2">
          {result.isDuplicate && (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">중복 위험</span>
          )}
          <button 
            onClick={onRegenerate}
            className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500"
            title="재생성"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
      </div>
      <div className="p-4">
        <textarea
          value={result.text}
          onChange={(e) => onUpdateText(e.target.value)}
          className="w-full h-24 text-sm text-slate-700 leading-relaxed focus:outline-none resize-none border-none p-0"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default ResultCard;
