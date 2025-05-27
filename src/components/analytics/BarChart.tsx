import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Typography, Paper } from '@mui/material';
import { BarChartProps } from './types';
import { ApexOptions } from 'apexcharts';

const defaultColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  height = 350,
  colors = defaultColors,
  xAxisTitle,
  yAxisTitle
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: true
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: data.labels,
      title: {
        text: xAxisTitle
      }
    },
    yaxis: {
      title: {
        text: yAxisTitle
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString()
      }
    }
  };

  const series = [{
    name: title,
    data: data.values
  }];

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={height}
      />
    </Paper>
  );
};
export default BarChart;