import React, { useRef, useEffect } from 'react';
import { LogMessage } from '../types';
import { Scroll, Trash2 } from 'lucide-react';

interface LogsConsoleProps {
  logs: LogMessage[];
  onClearLogs: () => void;
}

export default function LogsConsole({ logs, onClearLogs }: LogsConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom whenever they are appended
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div id="logs-console-overlay-console" className="bg-[#0b0c10]/95 border-t border-amber-900/15 p-2 h-24 shrink-0 flex flex-col justify-between font-mono select-none">
      <div className="flex items-center justify-between px-1.5 pb-1 border-b border-zinc-950">
        <span className="text-[9px] text-zinc-500 flex items-center gap-1 uppercase tracking-widest font-bold">
          <Scroll className="w-3 h-3 text-amber-500/80 animate-pulse" /> Imperial Strategic Transcript
        </span>
        <button
          onClick={onClearLogs}
          className="text-[8px] text-zinc-600 hover:text-zinc-400 p-0.5 rounded flex items-center gap-0.5 cursor-pointer"
          title="Flush transcripts"
        >
          <Trash2 className="w-2.5 h-2.5" /> Clear logs
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mt-1 px-1.5 space-y-1 scrollbar-thin overflow-x-hidden pt-0.5"
      >
        {logs.length === 0 ? (
          <div className="text-[10px] text-zinc-650 italic text-center py-2">
            No events registered inside transcripts. Keep building your domain!
          </div>
        ) : (
          logs.map((log) => {
            let color = 'text-zinc-500';
            if (log.type === 'success') color = 'text-emerald-400 font-medium';
            if (log.type === 'warning') color = 'text-amber-500 font-medium';
            if (log.type === 'combat') color = 'text-rose-400 font-bold';

            return (
              <div key={log.id} className="text-[9.5px] leading-relaxed flex items-start gap-1 font-mono">
                <span className="text-[8px] text-zinc-600">[{log.timestamp}]</span>
                <span className={color}>{log.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
