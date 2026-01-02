
export enum RecordType {
  BEHAVIOR = 'BEHAVIOR',
  CREATIVE = 'CREATIVE',
  CAREER = 'CAREER',
  SUBJECT = 'SUBJECT'
}

export interface Student {
  id: string;
  number: number;
  name: string;
  grade: number;
  class: number;
  gender: 'M' | 'F';
  memo?: string;
  params: {
    [RecordType.BEHAVIOR]: BehaviorParams;
    [RecordType.CREATIVE]: CreativeParams;
    [RecordType.CAREER]: CareerParams;
    [RecordType.SUBJECT]: SubjectParams;
  };
}

export interface GenerationResult {
  studentId: string;
  type: RecordType;
  text: string;
  isDuplicate?: boolean;
}

export interface BehaviorParams {
  cognitive: number; // 1-5
  affective: number; // 1-5
  behavioral: number; // 1-5
  strengths: string[];
  needs: string[];
  tone: 'positive' | 'balanced' | 'coaching';
  length: 'short' | 'medium' | 'long';
}

export interface CreativeParams {
  themes: string[];
  forms: string[];
  role: string;
  output: string[];
}

export interface CareerParams {
  interests: string[];
  personality: string;
  stage: string;
  competencies: string[];
}

export interface SubjectParams {
  grade: number;
  semester: number;
  subject: string;
  keywords: string;
  perspective: 'process' | 'achievement' | 'growth';
}
