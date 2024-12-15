'use client'

import { format } from 'date-fns'
import Chart from 'react-apexcharts'

type SystemChartProps = {
  data: any
}

const SystemChart = ({ data }: SystemChartProps) => {
  const months = Object.keys(data)
  const monthNames = Object.keys(data).map((key) => {
    const [year, month] = key.split('-')
    return format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM')
  })
  const totalOriginalAmounts = months.map(
    (month) => data[month].totalOriginalAmount
  )
  const totalAmounts = months.map((month) => data[month].totalAmount)
  const totalFees = months.map((month) => data[month].totalFee)
  const totalOrders = months.map((month) => data[month].totalOrder)

  const totalAmountCombined = totalOriginalAmounts.map((value, index) => [
    value,
    totalAmounts[index],
  ])

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    stroke: {
      width: [0, 0, 0, 3],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        endingShape: 'flat',
      },
    },
    xaxis: {
      categories: monthNames,
    },
    yaxis: [
      {
        seriesName: ['Total Original Amount', 'Total Fee', 'Total Amount'],
        title: {
          text: 'Amounts (USD)',
        },
      },
      {
        opposite: true,
        seriesName: 'Total Orders',
        title: {
          text: 'Orders',
        },
        min: 0,
        max: 100,
      },
    ],
    tooltip: {
      y: {
        formatter: function (
          // @ts-ignore
          value: number,
          // @ts-ignore
          { series, seriesIndex, dataPointIndex, w }
        ) {
          const test = series[seriesIndex][dataPointIndex]
          const seriesName = w.globals.seriesNames[seriesIndex]
          if (seriesName === 'Total Original Amount') {
            return totalOriginalAmounts[dataPointIndex]
          }
          return value
        },
      },
    },
    legend: {
      position: 'top',
    },
  }

  const chartSeries = [
    {
      name: 'Total Original Amount',
      type: 'bar',
      group: 'total-amount',
      data: totalOriginalAmounts.map((value, index) =>
        Math.abs(value - totalAmounts[index])
      ),
    },
    {
      name: 'Total Amount',
      type: 'bar',
      group: 'total-amount',
      data: totalAmounts,
    },
    {
      name: 'Total Fee',
      type: 'bar',
      data: totalFees,
    },
    {
      name: 'Total Orders',
      type: 'line',
      data: totalOrders,
    },
  ]
  return (
    <Chart
      // @ts-ignore
      options={chartOptions}
      series={chartSeries}
      type="line"
      height={400}
    />
  )
}

export default SystemChart
