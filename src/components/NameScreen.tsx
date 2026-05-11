import { useState } from 'react';

interface Props {
  onNext: (name: string) => void;
}

export default function NameScreen({ onNext }: Props) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) onNext(name.trim());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-2">
          <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">글리型</p>
          <h2 className="text-2xl font-bold text-white">시작 전, 이름을 알려주세요</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            결과 카드와 공유 링크에<br className="sm:hidden" /> 이름이 포함됩니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 입력"
            maxLength={10}
            autoFocus
            className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-6 py-4 text-white caret-white text-center text-lg placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-all"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white text-slate-900 hover:bg-slate-100 active:scale-95"
          >
            검사 시작하기
          </button>
        </form>

        <button
          onClick={() => onNext('')}
          className="w-full py-3 text-slate-600 text-sm hover:text-slate-400 transition-colors"
        >
          이름 없이 시작하기
        </button>
      </div>
    </div>
  );
}
