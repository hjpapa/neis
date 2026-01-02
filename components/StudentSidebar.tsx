
import React from 'react';
import { Student } from '../types';

interface StudentSidebarProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  searchTerm,
  setSearchTerm
}) => {
  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.number.toString().includes(searchTerm)
  );

  return (
    <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          학생 목록
          <span className="text-xs font-normal text-slate-500 ml-auto">{selectedIds.length}/{students.length} 선택</span>
        </h2>
        
        <input
          type="text"
          placeholder="이름 또는 번호 검색"
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex gap-2 mt-3">
          <button 
            onClick={onSelectAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            전체 선택
          </button>
          <button 
            onClick={onDeselectAll}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium"
          >
            선택 해제
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredStudents.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">검색 결과가 없습니다.</p>
        ) : (
          filteredStudents.map(student => (
            <div 
              key={student.id}
              onClick={() => onToggleSelect(student.id)}
              className={`flex items-center p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                selectedIds.includes(student.id) ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(student.id)}
                readOnly
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div className="ml-3">
                <p className="text-sm font-semibold">{student.number}번 {student.name}</p>
                <p className="text-xs text-slate-500">{student.grade}학년 {student.class}반 · {student.gender === 'M' ? '남' : '여'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentSidebar;
