// src/components/PieChart.js

import React from 'react';
import ApexCharts from 'react-apexcharts';

const PieChart = () => {
  const options = {
    chart: {
      type: 'donut',
      height: 400,
    },
    dataLabels: {
      enabled: true
    },
    legend: {
      position: 'bottom'
    },
    colors: ['#2F58CD', '#005B41', '#CD1818', '#D89216'],
    plotOptions: {
      pie: {
        donut: {
          size: '60 %',
          labels: {
            show: true,
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 20
            },
            value: {
              fontSize: '14px',
              color: 'black',
              offsetY: -20,
              formatter: function (val) {
                return val + "%";
              }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              color: '#373d3f',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0) + "%";
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        }
      }
    }
  };

  const series = [44, 55, 13, 43];

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <ApexCharts options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default PieChart;
