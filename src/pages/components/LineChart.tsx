import { ChartData } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

interface LineChartProps {
  chartData: ChartData<'line'>;
  yLabel: string;
  xLabel: string;
}

const LineChart: React.FC<LineChartProps> = ({ chartData, yLabel, xLabel }) => {
  console.log('chartData', chartData);

  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={{
          plugins: {
            // title: {
            //   display: true,
            //   text: "Users Gained between 2016-2020",
            // },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: xLabel,
              },
            },
            y: {
              type: 'linear',
              display: true,
              beginAtZero: true,
              position: 'left',
              grid: {
                display: false, // Hide grid lines
              },
              title: {
                display: true,
                text: yLabel,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
