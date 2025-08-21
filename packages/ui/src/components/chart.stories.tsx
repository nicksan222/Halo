import { Area, AreaChart, Bar, BarChart, Cell, Line, LineChart, Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from './chart';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 }
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const config = {
  value: {
    label: 'Value',
    color: '#0088FE'
  }
};

export default {
  title: 'Components/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'centered'
  }
};

export const LineChartExample = () => (
  <div className="w-[600px] space-y-4">
    <ChartContainer config={config}>
      <LineChart data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  </div>
);

export const BarChartExample = () => (
  <div className="w-[600px] space-y-4">
    <ChartContainer config={config}>
      <BarChart data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="#0088FE" />
      </BarChart>
    </ChartContainer>
  </div>
);

export const AreaChartExample = () => (
  <div className="w-[600px] space-y-4">
    <ChartContainer config={config}>
      <AreaChart data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="value" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
      </AreaChart>
    </ChartContainer>
  </div>
);

export const PieChartExample = () => (
  <div className="w-[400px] space-y-4">
    <ChartContainer config={config}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={pieData}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  </div>
);

export const WithLegend = () => (
  <div className="w-[600px] space-y-4">
    <ChartContainer config={config}>
      <LineChart data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  </div>
);
