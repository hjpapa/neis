
import { GoogleGenAI } from "@google/genai";
import { RecordType, BehaviorParams, CreativeParams, CareerParams, SubjectParams, Student } from "../types";

// Always use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
당신은 초등학교 교사입니다. 나이스(NEIS) 학교생활기록부를 작성하고 있습니다.
다음 규칙을 엄격히 준수하십시오:
1. 문체: 관찰 기반의 객관적이고 구체적인 문장으로 작성하십시오. (~함, ~보임, ~하였음 등 평어체 혹은 간결한 문체 사용)
2. 초등학생 수준에 맞는 표현을 사용하십시오.
3. 중복 방지: 동일한 문장 구조나 표현을 반복하지 마십시오. 학생마다 개성이 드러나야 합니다.
4. 개인정보 금지: 이름 외의 주민번호, 집주소 등 민감 정보는 포함하지 마십시오.
5. 금지 표현: 과도한 칭찬이나 단정적인 표현("천재적임", "최고임"), 의학적 진단("ADHD 증상이 있음")은 피하십시오.
6. 출력 형식: 마크업(Markdown)이나 따옴표 없이 순수 텍스트만 출력하십시오.
`;

export async function generateRecord(
  student: Student,
  type: RecordType,
  params: any,
  styleId: number
): Promise<string> {
  // Complex Text Tasks like record generation with reasoning should use the pro model
  const model = 'gemini-3-pro-preview';
  let prompt = `학생 이름: ${student.name}, 학년: ${student.grade}, 스타일 ID: ${styleId}\n`;

  if (type === RecordType.BEHAVIOR) {
    const p = params as BehaviorParams;
    prompt += `항목: 행동발달 및 종합의견
입력 데이터:
- 인지(${p.cognitive ?? 3}/5), 정의(${p.affective ?? 3}/5), 행동(${p.behavioral ?? 3}/5)
- 강점 키워드: ${(p.strengths || []).join(", ")}
- 보완점 키워드: ${(p.needs || []).join(", ")}
- 톤: ${p.tone ?? 'balanced'}, 길이: ${p.length ?? 'medium'}
작성 요청: 해당 지표와 키워드를 바탕으로 관찰 기반의 종합 의견을 작성하십시오.`;
  } else if (type === RecordType.CREATIVE) {
    const p = params as CreativeParams;
    prompt += `항목: 창의적 체험활동
입력 데이터:
- 주제: ${(p.themes || []).join(", ")}
- 활동 형태: ${(p.forms || []).join(", ")}
- 역할: ${p.role ?? '참여자'}
- 산출물: ${(p.output || []).join(", ")}
작성 요청: 활동 참여 동기, 구체적인 활동 내용, 학생의 역할과 성장을 포함하여 작성하십시오.`;
  } else if (type === RecordType.CAREER) {
    const p = params as CareerParams;
    prompt += `항목: 진로활동
입력 데이터:
- 관심분야: ${(p.interests || []).join(", ")}
- 성격유형: ${p.personality ?? '사교형'}
- 활동단계: ${p.stage ?? '탐색'}
- 역량: ${(p.competencies || []).join(", ")}
작성 요청: 자기 이해와 진로 탐색 과정을 중심으로 미래 역량이 잘 드러나게 작성하십시오.`;
  } else if (type === RecordType.SUBJECT) {
    const p = params as SubjectParams;
    prompt += `항목: 교과발달상황 (${p.subject ?? '국어'})
입력 데이터:
- 학기: ${p.semester ?? 1}학기
- 주요 키워드: ${p.keywords ?? ''}
- 평가 관점: ${p.perspective ?? 'growth'}
작성 요청: ${p.grade ?? 1}학년 수준에 맞게 해당 교과의 성취도와 학습 태도, 발전 가능성을 상세히 작성하십시오.`;
  }

  try {
    // Correct way to call generateContent with both model name and prompt
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    // Directly access the .text property (not a method call)
    return response.text?.trim() || "생성 실패";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 응답 생성 중 오류가 발생했습니다.";
  }
}
