import Chart from 'react-apexcharts'

const MixedChart = () => {
  const data1 = [400, 120, 50]
  const data2 = [80, 840, 218]
  const data3 = [200, 500, 150] // Dữ liệu dạng line

  // Tính toán giá trị lớn hơn và nhỏ hơn cho mỗi cột
  const lowerValues = data1.map((value, index) => Math.min(value, data2[index]))
  const higherValues = data1.map((value, index) =>
    Math.abs(value - data2[index])
  )

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true, // Chồng cột
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '50%', // Độ rộng của cột
        endingShape: 'rounded', // Cột có góc bo tròn
      },
    },
    stroke: {
      width: [0, 0, 2], // Đường viền của cột và độ dày của đường line
      curve: 'smooth', // Đường line mượt
    },
    xaxis: {
      categories: ['Column 1', 'Column 2', 'Column 3'], // Tên của các cột
    },
    yaxis: [
      {
        title: {
          text: 'Values (Bar)',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Values (Line)',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: 'top',
    },
    colors: ['#008FFB', '#00E396', '#FEB019'], // Màu sắc của các series
  }

  const chartSeries = [
    {
      name: 'Lower Value',
      type: 'bar',
      data: lowerValues,
      group: 'bar-stack',
    },
    {
      name: 'Higher Value',
      type: 'bar',
      data: higherValues,
      group: 'bar-stack',
    },
    {
      name: 'Line Data',
      type: 'line',
      data: data3,
    },
  ]

  return (
    <div>
      <h3>Mixed Chart: Stacked Column with Line</h3>
      <Chart
        // @ts-ignore
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={400}
      />
    </div>
  )
}

export default MixedChart
