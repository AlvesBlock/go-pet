import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";
import { formatCurrency } from "../../utils/formatters";

interface RevenuePoint {
  day: string;
  value: number;
}

interface Props {
  data: RevenuePoint[];
}

export default function RevenueAreaChart({ data }: Props) {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={160}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4457ff" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#4457ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#94a3b8" />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Area type="monotone" dataKey="value" stroke="#4457ff" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
