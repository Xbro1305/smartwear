import ReactECharts from 'echarts-for-react'

interface chart {
  points: Number[]
}

export const ChartComponent: React.FC<chart> = ({ points }) => {
  const option = {
    grid: {
      left: '3%',
      right: '0%',
      bottom: '10%',
      top: '5%',
    },
    xAxis: {
      type: 'category',
      data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'],
      axisLine: {
        lineStyle: {
          color: '#fff',
        },
      },
      axisLabel: {
        show: true,
        color: '#1b1b1b',
        fontSize: 16,
        fontFamily: 'Inter',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#1b1b1b',
        fontSize: 16,
        fontFamily: 'Inter',
      },
      splitLine: {
        lineStyle: {
          color: '#fff',
        },
      },
    },
    series: [
      {
        type: 'line',
        data: points,
        symbol: 'circle',
        symbolSize: 6,
        smooth: true,
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: '#1b1b1b',
        },
        itemStyle: {
          color: '#1b1b1b',
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => (params.value ? params.value : ''),
          color: '#1b1b1b',
          fontSize: 16,
          fontFamily: 'Inter',
          backgroundColor: '#f5f5f5',
          padding: [3, 5],
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#f5f5f5',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1.5,
            colorStops: [
              { offset: 0, color: '#ebebeb' },
              { offset: 1, color: '#fff' },
            ],
          },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
}
