
// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'), '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
var ctx = document.getElementById('PieChartIncome');
var PieChartIncome = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#3493FF', '#36b9cc', '#6e707e'],
        hoverBackgroundColor: ['#4FAFFF', '#4FCFDF', '#7e808e'],
        hoverBorderColor: 'rgba(234, 236, 244, 1)'
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: 'rgb(255,255,255)',
      bodyFontColor: '#858796',
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10
    },
    legend: {
      display: true,
      position: 'bottom',
      fullWidth: true,
      align: 'center',
      labels: {
        boxWidth: 20,
        usePointStyle: true
      }
    },
    cutoutPercentage: 80
  }
});





