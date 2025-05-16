import { ApexOptions } from 'apexcharts';

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface AnalyticsChartProps {
  title: string;
  data: ChartData;
  height?: number;
  colors?: string[];
}

export interface BarChartProps extends AnalyticsChartProps {
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export interface PieChartProps extends AnalyticsChartProps {
  enableLegend?: boolean;
}