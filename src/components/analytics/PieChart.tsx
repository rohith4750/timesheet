import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Typography, Paper } from '@mui/material';
import { PieChartProps } from './types';
import { ApexOptions } from 'apexcharts';

const defaultColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  height = 350,
  colors = defaultColors,
  enableLegend = true
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'pie' as const,
      toolbar: {
        show: true
      }
    },
    colors: colors,
    labels: data.labels,
    legend: {
      show: enableLegend,
      position: 'bottom',
      horizontalAlign: 'center'
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ReactApexChart
        options={options}
        series={data.values}
        type="pie"
        height={height}
      />
    </Paper>
  );
};