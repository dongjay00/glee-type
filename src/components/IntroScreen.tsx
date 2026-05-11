interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-3">
          <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">
            연세 글리클럽
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            글리型
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            합창을 통해 발견하는<br />나의 음악 성격 유형
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎵</span>
            <div>
              <p className="text-white text-sm font-semibold">5가지 축, 32가지 유형</p>
              <p className="text-slate-400 text-xs mt-0.5">음역·자리·방식·준비·에너지로 나만의 코드를 발견하세요</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏱</span>
            <div>
              <p className="text-white text-sm font-semibold">총 30문항, 약 7분</p>
              <p className="text-slate-400 text-xs mt-0.5">직관적으로, 처음 떠오르는 답을 선택하세요</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔗</span>
            <div>
              <p className="text-white text-sm font-semibold">결과 공유 가능</p>
              <p className="text-slate-400 text-xs mt-0.5">단원들과 유형을 비교해보세요</p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 active:scale-95 transition-all duration-150 shadow-lg"
        >
          유형 검사 시작하기
        </button>

        <p className="text-slate-600 text-xs">
          합창단 멤버가 아니어도 누구나 참여할 수 있어요
        </p>
      </div>
    </div>
  );
}
