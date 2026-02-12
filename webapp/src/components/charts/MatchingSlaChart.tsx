import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";

interface MatchingPoint {
  day: string;
  sla: number;
}

interface Props {
  data: MatchingPoint[];
}

export default function MatchingSlaChart({ data }: Props) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="matchingArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff671c" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#ff671c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#94a3b8" />
          <Tooltip formatter={(value: number) => `${value.toFixed(1)} s`} />
          <Area type="natural" dataKey="sla" stroke="#ff671c" fillOpacity={1} fill="url(#matchingArea)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
