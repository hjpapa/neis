
import React from 'react';
import { CareerParams } from '../types';
import { CAREER_INTERESTS, CAREER_PERSONALITIES, CAREER_STAGES, CAREER_COMPETENCIES } from '../constants';

interface CareerFormProps {
  params: CareerParams;
  setParams: (p: CareerParams) => void;
}

const CareerForm: React.FC<CareerFormProps> = ({ params, setParams }) => {
  const toggleArray = (field: keyof CareerParams, value: string) => {
    const list = params[field] as string[];
    const newList = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
    setParams({ ...params, [field]: newList });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">성격 유형</label>
          <select 
            value={params.personality}
            onChange={(e) => setParams({ ...params, personality: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
          >
            {CAREER_PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">활동 단계</label>
          <select 
            value={params.stage}
            onChange={(e) => setParams({ ...params, stage: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
          >
            {CAREER_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">관심 분야 (최대 3개)</label>
        <div className="flex flex-wrap gap-2">
          {CAREER_INTERESTS.map(interest => (
            <button
              key={interest}
              onClick={() => toggleArray('interests', interest)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                params.interests.includes(interest) ? 'bg-sky-600 border-sky-600 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:border-sky-400'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">강점 진로 역량</label>
        <div className="flex flex-wrap gap-2">
          {CAREER_COMPETENCIES.map(comp => (
            <button
              key={comp}
              onClick={() => toggleArray('competencies', comp)}
              className={`px-3 py-1 text-xs rounded border transition-all ${
                params.competencies.includes(comp) ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white border-slate-300 text-slate-600'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerForm;
