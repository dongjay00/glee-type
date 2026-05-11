import { useState, useCallback } from 'react';
import { TYPES } from '../data/types';
import type { CoreCode, Suffix } from '../data/types';
import Toast from './Toast';

interface Props {
  coreCode: CoreCode;
  suffix: Suffix;
  name: string;
  onRetry: () => void;
}

const AXIS_DESCRIPTIONS: Record<string, [string, string]> = {
  H: ['고음', '빛나는 멜로디'],
  L: ['저음', '묵직한 기반'],
  A: ['주도형', '내 소리로 이끈다'],
  B: ['조화형', '전체 소리를 완성'],
  R: ['이성형', '분석으로 이해'],
  F: ['감성형', '느낌으로 이해'],
  P: ['계획형', '준비에서 완성'],
  I: ['즉흥형', '무대에서 완성'],
  V: ['Vibrant', '함께 에너지 충전'],
  S: ['Serene', '혼자 에너지 충전'],
};

function downloadCard(name: string, coreCode: CoreCode, suffix: Suffix) {
  const type = TYPES[coreCode];
  const size = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 배경
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e293b');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // 상단 컬러 바
  ctx.fillStyle = type.color;
  ctx.fillRect(0, 0, size, 12);

  // 글리型 레이블
  ctx.fillStyle = type.color;
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('글리型', size / 2, 110);

  // 이름
  if (name) {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 52px system-ui, sans-serif';
    ctx.fillText(`${name}님의 유형`, size / 2, 195);
  }

  // 타입 코드 (대형)
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 200px system-ui, sans-serif`;
  ctx.fillText(coreCode, size / 2, name ? 450 : 420);

  // 서픽스
  ctx.fillStyle = type.color;
  ctx.font = 'bold 72px system-ui, sans-serif';
  ctx.fillText(`— ${suffix}`, size / 2, name ? 545 : 515);

  // 유형 이름
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 58px system-ui, sans-serif';
  ctx.fillText(type.name, size / 2, name ? 650 : 620);

  // 태그라인
  ctx.fillStyle = '#94a3b8';
  ctx.font = '34px system-ui, sans-serif';
  const tagline = type.tagline.length > 22 ? type.tagline.slice(0, 22) + '…' : type.tagline;
  ctx.fillText(tagline, size / 2, name ? 730 : 700);

  // 하단 레이블
  ctx.fillStyle = '#334155';
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillText('연세 글리클럽 성격 유형 테스트', size / 2, 1010);

  const link = document.createElement('a');
  link.download = `글리型-${coreCode}-${suffix}${name ? `-${name}` : ''}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export default function ResultScreen({ coreCode, suffix, name, onRetry }: Props) {
  const type = TYPES[coreCode];
  const letters = coreCode.split('') as string[];
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  function handleCopyLink() {
    const params = new URLSearchParams({ result: `${coreCode}-${suffix}`, ...(name && { name }) });
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    navigator.clipboard.writeText(url)
      .then(() => showToast('🔗 링크가 복사되었습니다!'))
      .catch(() => showToast('복사에 실패했습니다. 다시 시도해 주세요.'));
  }

  function handleDownloadCard() {
    downloadCard(name, coreCode, suffix);
    showToast('🖼 카드 이미지를 저장했습니다!');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-5">
      <div className="max-w-lg mx-auto space-y-5">

        {/* 메인 카드 */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${type.color}22, ${type.color}44)`, border: `1px solid ${type.color}55` }}
        >
          <div className="h-2" style={{ backgroundColor: type.color }} />

          <div className="p-6 sm:p-8 space-y-5 sm:space-y-6">

            {/* 코드 + 이름 */}
            <div className="text-center space-y-1.5">
              <p className="text-xs font-bold tracking-widest" style={{ color: type.color }}>
                {name ? `${name}님의 글리型` : '나의 글리型'}
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {coreCode}
                <span className="text-2xl sm:text-3xl font-semibold ml-1" style={{ color: type.color }}>
                  -{suffix}
                </span>
              </h2>
              <p className="text-xl sm:text-2xl font-bold text-white">{type.name}</p>
              <p className="text-slate-400 text-xs sm:text-sm">{type.tagline}</p>
            </div>

            {/* 축별 요약 — 모바일에서 overflow-x scroll 방지 위해 text 줄임 */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {[...letters, suffix].map((letter, i) => {
                const [label, sub] = AXIS_DESCRIPTIONS[letter] ?? ['', ''];
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <span className="text-lg sm:text-xl font-black" style={{ color: type.color }}>{letter}</span>
                    <span className="text-white text-[10px] sm:text-xs font-semibold text-center leading-tight">{label}</span>
                    <span className="text-slate-500 text-[9px] sm:text-xs text-center leading-tight hidden sm:block">{sub}</span>
                  </div>
                );
              })}
            </div>

            {/* 설명 */}
            <p className="text-slate-300 text-sm leading-relaxed">{type.description}</p>

            {/* 에너지 설명 */}
            <div className="rounded-2xl p-3 sm:p-4 space-y-1" style={{ backgroundColor: `${type.color}15` }}>
              <p className="text-xs font-bold" style={{ color: type.color }}>
                -{suffix} ({suffix === 'V' ? 'Vibrant' : 'Serene'}) 유형으로서
              </p>
              <p className="text-slate-300 text-sm">
                {suffix === 'V' ? type.vDesc : type.sDesc}
              </p>
            </div>

            {/* 강점 / 약점 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">강점</p>
                {type.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ color: type.color }} className="text-xs mt-0.5 flex-shrink-0">✦</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">약점</p>
                {type.weaknesses.map((w, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-500 text-xs mt-0.5 flex-shrink-0">▵</span>
                    <p className="text-slate-400 text-xs leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 궁합 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3 space-y-1" style={{ backgroundColor: `${type.color}10` }}>
                <p className="text-xs font-bold text-slate-400">잘 맞는 유형</p>
                {type.compatible.map((c) => (
                  <p key={c} className="text-xs sm:text-sm font-bold" style={{ color: type.color }}>
                    {c} · {TYPES[c].name}
                  </p>
                ))}
              </div>
              <div className="rounded-2xl p-3 space-y-1 bg-white/5">
                <p className="text-xs font-bold text-slate-400">주의할 유형</p>
                <p className="text-xs sm:text-sm font-bold text-slate-300">
                  {type.caution} · {TYPES[type.caution].name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className="py-4 rounded-2xl font-bold text-white text-sm border border-white/20 hover:bg-white/10 active:scale-95 transition-all"
            >
              🔗 링크 복사
            </button>
            <button
              onClick={handleDownloadCard}
              className="py-4 rounded-2xl font-bold text-sm border active:scale-95 transition-all"
              style={{ borderColor: `${type.color}60`, color: type.color, backgroundColor: `${type.color}12` }}
            >
              🖼 카드 저장
            </button>
          </div>
          <button
            onClick={onRetry}
            className="w-full py-4 rounded-2xl font-bold text-slate-500 text-sm hover:text-white transition-colors"
          >
            다시 검사하기
          </button>
        </div>

        {/* 전체 유형 목록 */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-5 sm:p-6 space-y-4">
          <p className="text-sm font-bold text-slate-400 text-center">전체 16가지 코어 유형</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(TYPES).map((t) => (
              <div
                key={t.core}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                  t.core === coreCode ? '' : 'opacity-40'
                }`}
                style={t.core === coreCode
                  ? { backgroundColor: `${t.color}20`, color: t.color, outline: `1.5px solid ${t.color}60` }
                  : { color: '#94a3b8' }
                }
              >
                <span className="font-black w-10 flex-shrink-0">{t.core}</span>
                <span className="truncate">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
