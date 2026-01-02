
import React from 'react';
import { SubjectParams } from '../types';
import { SUBJECTS, SUBJECT_PERSPECTIVES } from '../constants';

interface SubjectFormProps {
  params: SubjectParams;
  setParams: (p: SubjectParams) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ params, setParams }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">교과 선택</label>
          <select 
            value={params.subject}
            onChange={(e) => setParams({ ...params, subject: e.target.value })}
            className="w-full p-2 border border-slate-300 rounded-md text-sm font-semibold text-indigo-700"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">학기</label>
          <div className="flex bg-slate-100 p-1 rounded-md">
            {[1, 2].map(s => (
              <button
                key={s}
                onClick={() => setParams({ ...params, semester: s })}
                className={`flex-1 py-1 text-xs rounded transition-all ${
                  params.semester === s ? 'bg-white shadow-sm font-bold' : 'text-slate-500'
                }`}
              >
                {s}학기
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">평가 관점</label>
        <div className="grid grid-cols-1 gap-2">
          {SUBJECT_PERSPECTIVES.map(p => (
            <button
              key={p.id}
              onClick={() => setParams({ ...params, perspective: p.id as any })}
              className={`text-left px-4 py-2 text-xs rounded-lg border transition-all ${
                params.perspective === p.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">단원/프로젝트 키워드</label>
        <textarea
          value={params.keywords}
          onChange={(e) => setParams({ ...params, keywords: e.target.value })}
          placeholder="예: 나눗셈의 원리 이해, 생태계 프로젝트 참여, 바른 자세로 낭독하기"
          className="w-full h-24 p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <p className="text-[10px] text-slate-400 mt-2">활동 내용을 구체적으로 적을수록 생생한 문장이 생성됩니다.</p>
      </div>
    </div>
  );
};

export default SubjectForm;
