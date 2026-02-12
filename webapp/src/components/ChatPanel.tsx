import type { ChatMessage } from "../types";
import { formatTime } from "../utils/formatters";

interface Props {
  messages: ChatMessage[];
}

export function ChatPanel({ messages }: Props) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white shadow-soft">
      <div className="border-b border-slate-100 px-5 py-3">
        <p className="font-semibold text-slate-800">Chat tutor ↔ motorista</p>
        <p className="text-xs text-slate-400">Retenção de 24h + mascaramento LGPD</p>
      </div>
      <div className="scroll-shadow flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderRole === "tutor" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${
                message.senderRole === "tutor" ? "bg-slate-100 text-slate-800" : "bg-brand-600 text-white"
              }`}
            >
              <p className="font-semibold text-xs uppercase tracking-wide">
                {message.senderRole === "tutor" ? "Tutor" : "Motorista"}
              </p>
              <p>{message.content}</p>
              <p className="mt-2 text-[10px] uppercase tracking-wide opacity-70">{formatTime(message.at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
