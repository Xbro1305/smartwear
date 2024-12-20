import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(...registerables)
Chart.register(ChartDataLabels)

interface ChartComponentProps {
  points: any
  max: any
  labels: any
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ points, labels, max }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Продажи',
        data: points,
        fill: true,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderColor: '#000',
        borderWidth: 1.5,
        pointBackgroundColor: '#000',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        cornerRadius: 4,
        xPadding: 10,
        yPadding: 10,
      },
      datalabels: {
        display: true,
        color: '#000',
        font: {
          size: 12,
          weight: 'bold',
        },
        align: 'top',
        formatter: (value: any) => value,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
        title: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
          stepSize: 100,
        },
        title: {
          display: false,
        },
        min: 0,
        max,
      },
    },
  }

  return <Line data={data} options={options as any} />
}
