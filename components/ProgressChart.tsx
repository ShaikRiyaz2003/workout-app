import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function ProgressChart({ data }: { data: any[] }) {
  return (
    <LineChart width={320} height={240} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line dataKey="weight" />
    </LineChart>
  );
}
