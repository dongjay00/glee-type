import { useState } from 'react';
import { QUESTIONS } from '../data/questions';

export type AnswerScore = 1 | 2 | 3 | 4;
export type Answers = Record<number, AnswerScore>;

interface Props {
  onComplete: (answers: Answers) => void;
}

const AXIS_LABEL: Record<string, string> = {
  HL: '음역',
  AB: '자리',
  RF: '방식',
  PI: '준비',
  VS: '에너지',
};

const DOT_LABELS = ['확실히', '대체로', '대체로', '확실히'];
const SCORES: AnswerScore[] = [1, 2, 3, 4];
const DOT_PCT = [0, 33.33, 66.67, 100];

const DOT_VISUAL = 20; // 시각적 도트 크기 (px)
const DOT_HIT   = 48; // 터치 타겟 크기 (px) — 모바일 44px 권장 초과

export default function QuizScreen({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<AnswerScore | null>(null);
  const [animating, setAnimating] = useState(false);

  const question = QUESTIONS[current];
  const total = QUESTIONS.length;
  const progress = (current / total) * 100;

  function handleSelect(score: AnswerScore) {
    if (animating) return;
    setSelected(score);
    setAnimating(true);
    setTimeout(() => {
      const next = { ...answers, [question.id]: score };
      setAnswers(next);
      if (current + 1 >= total) {
        onComplete(next);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setAnimating(false);
      }
    }, 380);
  }

  function handleBack() {
    if (current === 0 || animating) return;
    setCurrent((c) => c - 1);
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg space-y-8 sm:space-y-10">

        {/* 진행 바 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">{AXIS_LABEL[question.axis]}</span>
            <span className="text-xs text-slate-400">{current + 1} / {total}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <p className="text-white text-lg sm:text-xl font-semibold leading-relaxed text-center px-2">
          {question.q}
        </p>

        {/* 스펙트럼 바 */}
        <div className="space-y-4 sm:space-y-6">

          {/* 양 끝 레이블 */}
          <div className="flex justify-between gap-3 sm:gap-4">
            <span className={`text-sm font-semibold leading-snug w-[44%] text-left transition-colors duration-200 ${
              selected !== null && selected <= 2 ? 'text-white' : 'text-slate-400'
            }`}>
              {question.first}
            </span>
            <span className={`text-sm font-semibold leading-snug w-[44%] text-right transition-colors duration-200 ${
              selected !== null && selected >= 3 ? 'text-white' : 'text-slate-400'
            }`}>
              {question.second}
            </span>
          </div>

          {/* 선 + 도트 — 선이 도트 중앙을 관통 */}
          <div className="relative" style={{ height: DOT_HIT }}>

            {/* 배경 선 (도트 시각 중앙 높이) */}
            <div
              className="absolute left-0 right-0 h-px bg-white/20 pointer-events-none"
              style={{ top: DOT_HIT / 2 }}
            />

            {/* 활성 선 — A쪽 */}
            {selected !== null && selected <= 2 && (
              <div
                className="absolute h-px bg-white/65 pointer-events-none transition-all duration-300"
                style={{ top: DOT_HIT / 2, left: 0, width: `${DOT_PCT[selected - 1]}%` }}
              />
            )}

            {/* 활성 선 — B쪽 */}
            {selected !== null && selected >= 3 && (
              <div
                className="absolute h-px bg-white/65 pointer-events-none transition-all duration-300"
                style={{ top: DOT_HIT / 2, right: 0, width: `${100 - DOT_PCT[selected - 1]}%` }}
              />
            )}

            {/* 도트 — 터치 타겟(DOT_HIT)이 시각 크기(DOT_VISUAL)보다 크고, 선 위에 z-10 */}
            <div className="absolute inset-0 flex justify-between items-center">
              {SCORES.map((score) => {
                const isSelected = selected === score;
                return (
                  <button
                    key={score}
                    onClick={() => handleSelect(score)}
                    disabled={animating}
                    className="relative z-10 flex items-center justify-center"
                    style={{ width: DOT_HIT, height: DOT_HIT }}
                    aria-label={`${score <= 2 ? question.first : question.second} ${DOT_LABELS[score - 1]}`}
                  >
                    <div
                      className={`rounded-full border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-white scale-125 shadow-[0_0_14px_rgba(255,255,255,0.55)]'
                          : 'border-white/35 hover:border-white/70 hover:scale-110 active:scale-95'
                      }`}
                      style={{
                        width: DOT_VISUAL,
                        height: DOT_VISUAL,
                        backgroundColor: isSelected ? 'white' : '#1a2035',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 도트 레이블 */}
          <div className="flex justify-between px-3">
            {DOT_LABELS.map((label, i) => (
              <span
                key={i}
                className={`text-xs text-center transition-colors duration-200 ${
                  selected === SCORES[i] ? 'text-white font-semibold' : 'text-slate-600'
                }`}
                style={{ width: DOT_HIT }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* 뒤로 가기 */}
        {current > 0 && (
          <button
            onClick={handleBack}
            className="w-full py-3 text-slate-500 text-sm hover:text-slate-300 transition-colors"
          >
            ← 이전 문항으로
          </button>
        )}
      </div>
    </div>
  );
}
