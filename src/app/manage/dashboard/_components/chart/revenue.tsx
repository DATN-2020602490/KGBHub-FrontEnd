'use client'
import { format } from 'date-fns'
import Chart from 'react-apexcharts'

type RevenueChartProps = {
  data: any
  groupBy?: string
}

const RevenueChart = ({ data, groupBy = 'month' }: RevenueChartProps) => {
  const months = Object.keys(data)
  const monthNames =
    groupBy === 'month'
      ? Object.keys(data).map((key) => {
          const [year, month] = key.split('-')
          return format(new Date(parseInt(year), parseInt(month) - 1), 'MMMM')
        })
      : undefined
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
      foreColor: 'hsl(var(--nextui-default-800))',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    grid: {
      show: true,
      borderColor: 'hsl(var(--nextui-default-200))',
      strokeDashArray: 0,
      position: 'back',
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
      categories:
        groupBy === 'month' ? monthNames : Object.keys(data).map((key) => key),
      labels: {
        show: true,
        style: {
          colors: 'hsl(var(--nextui-default-800))',
        },
      },
      axisBorder: {
        color: 'hsl(var(--nextui-nextui-default-200))',
      },
      axisTicks: {
        color: 'hsl(var(--nextui-nextui-default-200))',
      },
    },
    yaxis: [
      {
        seriesName: ['Total Original Amount', 'Total Fee', 'Total Amount'],
        title: {
          text: 'Amounts (USD)',
        },
        labels: {
          style: {
            // hsl(var(--nextui-content1-foreground))
            colors: 'hsl(var(--nextui-default-800))',
          },
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
        labels: {
          style: {
            // hsl(var(--nextui-content1-foreground))
            colors: 'hsl(var(--nextui-default-800))',
          },
        },
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
      position: 'bottom',
      onItemClick: {
        toggleDataSeries: false,
      },
      onItemHover: {
        highlightDataSeries: false,
      },
    },
  }

  const chartSeries = [
    {
      name: 'Total Amount',
      type: 'bar',
      group: 'total-amount',
      data: totalAmounts,
    },
    {
      name: 'Total Original Amount',
      type: 'bar',
      group: 'total-amount',
      data: totalOriginalAmounts.map((value, index) =>
        Math.abs(value - totalAmounts[index])
      ),
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

export default RevenueChart
