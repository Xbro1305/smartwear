import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart'

Chart.register(...registerables)
Chart.register(ChartDataLabels)

interface ChartComponentProps {
  points: any
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ points }) => {
  return (
    <>
      <LineChart
        series={[
          {
            curve: 'natural',
            color: '#1b1b1b',
            data: points,
            area: true,
          },
        ]}
        yAxis={[
          {
            colorMap: {
              type: 'continuous',
              min: 0,
              max: Math.max(...points),
              color: ['#fff', '#ebebeb'],
            },
          },
        ]}
        xAxis={[{ scaleType: 'point', data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }]}
        sx={{
          [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
            strokeWidth: 1,
            stroke: '#1b1b1b',
          },
          '.MuiLineElement-series-pvId': {
            strokeDasharray: '5 5',
            fill: '#1b1b1b',
          },
          '.MuiLineElement-series-uvId': {
            strokeDasharray: '3 4 5 2',
            fill: '#1b1b1b',
          },
          [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
            fill: '#1b1b1b',
          },
          [`& .${markElementClasses.highlighted}`]: {
            stroke: 'none',
          },
        }}
      />
    </>
  )
}
