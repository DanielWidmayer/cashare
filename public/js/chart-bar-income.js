// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
// default template function for chart bars
window.number_format = function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

/*
// get months ...
window.getMonths = function getMonths(){
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Dezember"];
  var thisMonth = new Date().getMonth();
  var labels = [];

  for (let index = 0; index <= thisMonth; index++) {
      labels.push(months[index]);
  }
  return labels;
}
*/
/*
// Get transaction Value for specific month
function getValue(val){
    var sum = 0;
    transactions.forEach(transaction => {
        if(transaction.transaction_date != null) // ????
        {
         var datetime = new Date(transaction.transaction_date);
         var month = datetime.getMonth();
         var year = datetime.getFullYear();
         if(year == new Date().getFullYear())
         {
            if(month == val)
            {
                sum += Math.abs(transaction.transaction_value);
            }
         }
        }
    });

    // Check whether maxValue has been exceeded, if so then update maxValue 
    if(sum >= maxValue)
    {
      var x = 1;
      var i = 1;

      while (sum > x * Math.pow(10,i)) {
        if(x <= 9){
          x++;
        }
        else{
          x = 1
          i++;
        }
      }
      maxValue = x * Math.pow(10,i);
    }
    return sum;
}
*/

var ctx_incomes = document.getElementById("BarChart_Incomes");

var BarChart_Incomes = new Chart(ctx_incomes, {
  type: 'bar',
  data: {
    labels: [], //getMonths(),
    datasets: [{
      label: "Revenue",
      backgroundColor: "#3493FF",
      hoverBackgroundColor: "#4FAFFF",
      borderColor: "#4e73df",
      data: []//getData()
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 12
        },
        maxBarThickness: 25,
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 10, //maxValue,
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        }
      }
    },
  }
});