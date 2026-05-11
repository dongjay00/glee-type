import { useEffect, useState } from 'react';

interface Props {
  message: string;
  onDone: () => void;
  duration?: number;
}

export default function Toast({ message, onDone, duration = 2500 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => setVisible(false), duration - 400);
    const done = setTimeout(() => onDone(), duration);
    return () => { clearTimeout(show); clearTimeout(hide); clearTimeout(done); };
  }, [duration, onDone]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-white text-slate-900 text-sm font-semibold shadow-2xl transition-all duration-300 whitespace-nowrap ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {message}
    </div>
  );
}
