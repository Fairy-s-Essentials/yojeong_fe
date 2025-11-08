import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: { date: string; accuracy: number }[];
}

const LineChart = ({ data }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis
          domain={[0, 100]}
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          label={{
            value: '정확도 (%)',
            angle: -90,
            position: 'insideLeft',
            style: { fontSize: '14px', fill: '#6b7280' },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value}%`, '정확도']}
        />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
