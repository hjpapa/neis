
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Student, RecordType, GenerationResult, BehaviorParams, CreativeParams, CareerParams, SubjectParams } from './types';
import StudentSidebar from './components/StudentSidebar';
import BehaviorForm from './components/BehaviorForm';
import CreativeForm from './components/CreativeForm';
import CareerForm from './components/CareerForm';
import SubjectForm from './components/SubjectForm';
import ResultCard from './components/ResultCard';
import SetupView from './components/SetupView';
import { generateRecord } from './services/geminiService';

const DEFAULT_PARAMS = {
  [RecordType.BEHAVIOR]: { cognitive: 3, affective: 3, behavioral: 3, strengths: [], needs: [], tone: 'balanced', length: 'medium' } as BehaviorParams,
  [RecordType.CREATIVE]: { themes: [], forms: [], role: '참여자', output: [] } as CreativeParams,
  [RecordType.CAREER]: { interests: [], personality: '사교형', stage: '직업탐색', competencies: [] } as CareerParams,
  [RecordType.SUBJECT]: { grade: 1, semester: 1, subject: '국어', keywords: '', perspective: 'growth' } as SubjectParams,
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<RecordType>(RecordType.BEHAVIOR);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);

  // Batch parameters used to initialize or bulk apply
  const [batchParams, setBatchParams] = useState(DEFAULT_PARAMS);

  const handleInitialSetup = (grade: number, count: number) => {
    const newStudents: Student[] = Array.from({ length: count }, (_, i) => ({
      id: (i + 1).toString(),
      number: i + 1,
      name: `학생 ${i + 1}`,
      grade: grade,
      class: 1,
      gender: i % 2 === 0 ? 'M' : 'F',
      params: JSON.parse(JSON.stringify({ ...DEFAULT_PARAMS, [RecordType.SUBJECT]: { ...DEFAULT_PARAMS[RecordType.SUBJECT], grade } }))
    }));
    setStudents(newStudents);
    setFocusedId(newStudents[0]?.id || null);
    // Sync batch subject grade
    setBatchParams(prev => ({ 
      ...prev, 
      [RecordType.SUBJECT]: { ...prev[RecordType.SUBJECT], grade } 
    }));
  };

  const handleReset = () => {
    if (confirm("현재 명단을 초기화하고 다시 설정하시겠습니까?")) {
      setStudents([]);
      setResults([]);
      setSelectedIds([]);
      setFocusedId(null);
    }
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    setFocusedId(id);
  }, []);

  const handleSelectAll = () => setSelectedIds(students.map(s => s.id));
  const handleDeselectAll = () => setSelectedIds([]);

  // Get parameters for the focused student or fallback to batch
  // Fix: Added useMemo to the react import at the top of the file
  const currentParams = useMemo(() => {
    const student = students.find(s => s.id === focusedId);
    return student ? student.params[activeTab] : batchParams[activeTab];
  }, [students, focusedId, activeTab, batchParams]);

  const updateCurrentParams = (newParams: any) => {
    if (focusedId) {
      setStudents(prev => prev.map(s => s.id === focusedId 
        ? { ...s, params: { ...s.params, [activeTab]: newParams } } 
        : s
      ));
    } else {
      setBatchParams(prev => ({ ...prev, [activeTab]: newParams }));
    }
  };

  const applyBatchToSelected = () => {
    if (selectedIds.length === 0) return;
    const p = batchParams[activeTab];
    setStudents(prev => prev.map(s => selectedIds.includes(s.id)
      ? { ...s, params: { ...s.params, [activeTab]: JSON.parse(JSON.stringify(p)) } }
      : s
    ));
    alert(`${selectedIds.length}명의 학생에게 현재 설정을 적용했습니다.`);
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0) {
      alert("학생을 선택해주세요.");
      return;
    }
    
    setIsLoading(true);
    const newResults: GenerationResult[] = [...results.filter(r => r.type !== activeTab || !selectedIds.includes(r.studentId))];

    for (const id of selectedIds) {
      const student = students.find(s => s.id === id);
      if (!student) continue;

      const styleId = Math.floor(Math.random() * 12) + 1;
      const text = await generateRecord(student, activeTab, student.params[activeTab], styleId);
      
      newResults.push({
        studentId: id,
        type: activeTab,
        text,
        isDuplicate: false 
      });
    }

    setResults(newResults);
    setIsLoading(false);
  };

  const updateResultText = (studentId: string, newText: string) => {
    setResults(prev => prev.map(r => r.studentId === studentId && r.type === activeTab ? { ...r, text: newText } : r));
  };

  const regenerateSingle = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setIsLoading(true);
    const styleId = Math.floor(Math.random() * 12) + 1;
    const text = await generateRecord(student, activeTab, student.params[activeTab], styleId);
    
    setResults(prev => prev.map(r => r.studentId === studentId && r.type === activeTab ? { ...r, text } : r));
    setIsLoading(false);
  };

  const handleCopyAll = () => {
    const currentResults = results.filter(r => r.type === activeTab && selectedIds.includes(r.studentId));
    if (currentResults.length === 0) return;

    const allText = currentResults.map(r => {
      const s = students.find(st => st.id === r.studentId);
      return `${s?.name}: ${r.text}`;
    }).join('\n\n');
    navigator.clipboard.writeText(allText);
    alert("현재 선택된 학생들의 결과가 복사되었습니다.");
  };

  if (students.length === 0) {
    return <SetupView onGenerate={handleInitialSetup} />;
  }

  const focusedStudent = students.find(s => s.id === focusedId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      <StudentSidebar 
        students={students}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">NEIS Record AI</h1>
              <p className="text-xs text-slate-500">{students[0].grade}학년 명단 {students.length}명 관리 중</p>
            </div>
            <button 
              onClick={handleReset}
              className="ml-2 p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-red-500"
              title="명단 재설정"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all">라이브러리</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md">내보내기</button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Controls Panel */}
          <div className="w-[450px] border-r border-slate-200 bg-white overflow-y-auto shadow-xl z-0">
            <div className="p-1 bg-slate-100 m-6 mb-4 rounded-xl flex gap-1">
              {(Object.keys(RecordType) as Array<keyof typeof RecordType>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(RecordType[key])}
                  className={`flex-1 py-2.5 text-[11px] font-bold rounded-lg transition-all ${
                    activeTab === RecordType[key] ? 'bg-white text-indigo-700 shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {RecordType[key] === 'BEHAVIOR' ? '행발' : RecordType[key] === 'CREATIVE' ? '창체' : RecordType[key] === 'CAREER' ? '진로' : '교과'}
                </button>
              ))}
            </div>

            <div className="px-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                  {focusedStudent ? `${focusedStudent.number}번 ${focusedStudent.name} 설정` : '전체 공통 설정'}
                </h2>
                {!focusedStudent && (
                   <button 
                    onClick={applyBatchToSelected}
                    className="text-[10px] bg-slate-100 px-2 py-1 rounded border border-slate-200 hover:bg-slate-200"
                  >
                    일괄 적용
                  </button>
                )}
              </div>

              {activeTab === RecordType.BEHAVIOR && <BehaviorForm params={currentParams as BehaviorParams} setParams={updateCurrentParams} />}
              {activeTab === RecordType.CREATIVE && <CreativeForm params={currentParams as CreativeParams} setParams={updateCurrentParams} />}
              {activeTab === RecordType.CAREER && <CareerForm params={currentParams as CareerParams} setParams={updateCurrentParams} />}
              {activeTab === RecordType.SUBJECT && <SubjectForm params={currentParams as SubjectParams} setParams={updateCurrentParams} />}

              <div className="mt-10 sticky bottom-0 bg-white pt-4 pb-2">
                <button
                  disabled={isLoading || selectedIds.length === 0}
                  onClick={handleGenerate}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
                    isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200 hover:shadow-indigo-300'
                  }`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {selectedIds.length}명 문장 생성하기
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                  학생별 개별 설정값이 문장 생성에 반영됩니다.<br/>
                  중복을 방지하기 위해 생성 시마다 구조가 다르게 적용됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="flex-1 overflow-y-auto p-10">
            <div className="max-w-3xl mx-auto">
              {results.some(r => r.type === activeTab && selectedIds.includes(r.studentId)) ? (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">생성 결과</h3>
                      <p className="text-sm text-slate-500 mt-1">총 {results.filter(r => r.type === activeTab && selectedIds.includes(r.studentId)).length}건의 기록</p>
                    </div>
                    <button 
                      onClick={handleCopyAll}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                    >
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      선택 학생 일괄 복사
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {results
                      .filter(r => r.type === activeTab && selectedIds.includes(r.studentId))
                      .sort((a, b) => {
                        const sA = students.find(s => s.id === a.studentId);
                        const sB = students.find(s => s.id === b.studentId);
                        return (sA?.number || 0) - (sB?.number || 0);
                      })
                      .map(result => {
                        const student = students.find(s => s.id === result.studentId)!;
                        return (
                          <ResultCard
                            key={`${result.studentId}-${result.type}`}
                            student={student}
                            result={result}
                            onUpdateText={(text) => updateResultText(result.studentId, text)}
                            onRegenerate={() => regenerateSingle(result.studentId)}
                          />
                        );
                      })}
                  </div>
                </>
              ) : (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 mb-6 bg-white border border-slate-200 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
                    <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-400">생성된 기록이 없습니다.</h4>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
                    학생을 선택하고 파라미터를 조정한 뒤<br/>'문장 생성하기' 버튼을 클릭해주세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
