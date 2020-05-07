import { getTransactionsByUserID } from "../../dbsql/db_trans";

// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'), '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
var ctx = document.getElementById('myPieChart');
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Direct', 'Referral', 'Social'],
    datasets: [
      {
        data: [55, 30, 15],
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
      display: false
    },
    cutoutPercentage: 80
  }
});

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
