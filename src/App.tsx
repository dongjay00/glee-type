import { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import NameScreen from './components/NameScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import type { CoreCode, Suffix } from './data/types';
import type { Answers } from './components/QuizScreen';

type Axis = 'HL' | 'AB' | 'RF' | 'PI' | 'VS';
import { QUESTIONS } from './data/questions';

type Phase = 'intro' | 'name' | 'quiz' | 'result';

const SCORE_MAP: Record<number, number> = { 1: 2, 2: 1, 3: -1, 4: -2 };

function calcType(answers: Answers): { core: CoreCode; suffix: Suffix } {
  function dominant(axis: Axis, firstLetter: string, secondLetter: string): string {
    const qs = QUESTIONS.filter((q) => q.axis === axis);
    const total = qs.reduce((sum, q) => sum + (SCORE_MAP[answers[q.id] ?? 2] ?? 0), 0);
    return total >= 0 ? firstLetter : secondLetter;
  }
  return {
    core: `${dominant('HL', 'H', 'L')}${dominant('AB', 'A', 'B')}${dominant('RF', 'R', 'F')}${dominant('PI', 'P', 'I')}` as CoreCode,
    suffix: dominant('VS', 'V', 'S') as Suffix,
  };
}

function parseParams(): { core: CoreCode; suffix: Suffix; name: string } | null {
  const params = new URLSearchParams(window.location.search);
  const r = params.get('result');
  if (!r) return null;
  const [core, suffix] = r.split('-');
  return { core: core as CoreCode, suffix: suffix as Suffix, name: params.get('name') ?? '' };
}

export default function App() {
  const initial = parseParams();
  const [phase, setPhase] = useState<Phase>(initial ? 'result' : 'intro');
  const [name, setName] = useState(initial?.name ?? '');
  const [result, setResult] = useState<{ core: CoreCode; suffix: Suffix } | null>(
    initial ? { core: initial.core, suffix: initial.suffix } : null
  );

  function handleComplete(answers: Answers) {
    const r = calcType(answers);
    setResult(r);
    setPhase('result');
  }

  function handleRetry() {
    setResult(null);
    setName('');
    setPhase('intro');
    window.history.replaceState({}, '', window.location.pathname);
  }

  if (phase === 'name') return <NameScreen onNext={(n) => { setName(n); setPhase('quiz'); }} />;
  if (phase === 'quiz') return <QuizScreen onComplete={handleComplete} />;
  if (phase === 'result' && result) {
    return <ResultScreen coreCode={result.core} suffix={result.suffix} name={name} onRetry={handleRetry} />;
  }
  return <IntroScreen onStart={() => setPhase('name')} />;
}
