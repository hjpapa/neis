
import React from 'react';
import { BehaviorParams } from '../types';
import { STRENGTH_KEYWORDS, NEEDS_KEYWORDS } from '../constants';

interface BehaviorFormProps {
  params: BehaviorParams;
  setParams: (p: BehaviorParams) => void;
}

const BehaviorForm: React.FC<BehaviorFormProps> = ({ params, setParams }) => {
  const toggleKeyword = (listKey: 'strengths' | 'needs', word: string) => {
    const list = [...params[listKey]];
    if (list.includes(word)) {
      setParams({ ...params, [listKey]: list.filter(w => w !== word) });
    } else {
      setParams({ ...params, [listKey]: [...list, word] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">인지적(학습) {params.cognitive}</label>
          <input type="range" min="1" max="5" value={params.cognitive} onChange={(e) => setParams({...params, cognitive: parseInt(e.target.value)})} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">정의적(인성) {params.affective}</label>
          <input type="range" min="1" max="5" value={params.affective} onChange={(e) => setParams({...params, affective: parseInt(e.target.value)})} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">행동적(사회성) {params.behavioral}</label>
          <input type="range" min="1" max="5" value={params.behavioral} onChange={(e) => setParams({...params, behavioral: parseInt(e.target.value)})} className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3 text-indigo-700">강점 키워드</label>
        <div className="flex flex-wrap gap-2">
          {STRENGTH_KEYWORDS.map(word => (
            <button
              key={word}
              onClick={() => toggleKeyword('strengths', word)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                params.strengths.includes(word) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3 text-red-700">보완점 키워드</label>
        <div className="flex flex-wrap gap-2">
          {NEEDS_KEYWORDS.map(word => (
            <button
              key={word}
              onClick={() => toggleKeyword('needs', word)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                params.needs.includes(word) ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-300 text-slate-600 hover:border-red-400'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">문장 톤</label>
          <select 
            value={params.tone} 
            onChange={(e) => setParams({...params, tone: e.target.value as any})}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="positive">긍정 중심</option>
            <option value="balanced">균형형 (강점+보완)</option>
            <option value="coaching">성장코칭형</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">길이</label>
          <select 
            value={params.length} 
            onChange={(e) => setParams({...params, length: e.target.value as any})}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="short">짧게 (1~2문장)</option>
            <option value="medium">보통 (2~3문장)</option>
            <option value="long">길게 (3~4문장)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BehaviorForm;
