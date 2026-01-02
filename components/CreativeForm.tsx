
import React from 'react';
import { CreativeParams } from '../types';
import { CREATIVE_THEMES, CREATIVE_FORMS, CREATIVE_OUTPUTS } from '../constants';

interface CreativeFormProps {
  params: CreativeParams;
  setParams: (p: CreativeParams) => void;
}

const CreativeForm: React.FC<CreativeFormProps> = ({ params, setParams }) => {
  const toggleArray = (field: keyof CreativeParams, value: string) => {
    const list = params[field] as string[];
    const newList = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
    setParams({ ...params, [field]: newList });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">범교과 주제 (다중 선택)</label>
        <div className="flex flex-wrap gap-2">
          {CREATIVE_THEMES.map(theme => (
            <button
              key={theme}
              onClick={() => toggleArray('themes', theme)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                params.themes.includes(theme) ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">활동 형태</label>
          <div className="flex flex-wrap gap-2">
            {CREATIVE_FORMS.map(form => (
              <button
                key={form}
                onClick={() => toggleArray('forms', form)}
                className={`px-3 py-1 text-xs rounded border transition-all ${
                  params.forms.includes(form) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-600'
                }`}
              >
                {form}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">주요 역할</label>
          <select 
            value={params.role}
            onChange={(e) => setParams({ ...params, role: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="참여자">참여자</option>
            <option value="발표자">발표자</option>
            <option value="기록자">기록자</option>
            <option value="리더/반장">리더/반장</option>
            <option value="도우미">도우미</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">주요 산출물</label>
        <div className="flex flex-wrap gap-2">
          {CREATIVE_OUTPUTS.map(output => (
            <button
              key={output}
              onClick={() => toggleArray('output', output)}
              className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                params.output.includes(output) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300 text-slate-600'
              }`}
            >
              {output}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeForm;
