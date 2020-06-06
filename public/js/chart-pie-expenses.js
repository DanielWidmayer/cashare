

// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'), '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
var ctx = document.getElementById('PieChartExpenses');
var PieChart_Expenses = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#3493FF', '#99c9ff','#e6f1ff','#8598ad', '94999e', '#999999'],
        hoverBackgroundColor: ['#66adff', '#80bbff', '#cce4ff', '#8a98a8', '#99c9ff'],
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
/*
function getArrays(){
var idArray = [];
var valueArray = [];
var idcounter = 0;
var alreadyExists = 0;
var tempid = 0;
var tempval = 0;
transactions.forEach(transaction => {
for (i=0;idcounter > i; i++){ //checkt ob es die categoryid schon im idarray gibt
  if(idArray[i] == transaction.category_id){
    valueArray[i] = valueArray[i] + Math.abs(transaction.transaction_value);
    alreadyExists = 1;
    break;
  }
}
if(alreadyExists == 0  ){//wenn id noch  noch nicht in idarray existent, wird hier erstellt 
  idArray[idcounter] = transaction.category_id;
  valueArray[idcounter] = transaction.transaction_value;
  idcounter++;
}
alreadyExists = 0;
})

for(i = idcounter - 1; i > 0 ; i--){ //doppelter bubblesort für beide arrays 
  for(j = 1; j <= i; j++){
    if (valueArray[j-1] > valueArray[j]){
      tempid = idArray[j-1];
      tempval = valueArray[j-1];
      idArray[j-1] = idArray [j];
      valueArray[j-1] = valueArray[j];
      idArray[j] = tempid;
      valueArray[j] = tempval;
    }
  }
}



}
*/