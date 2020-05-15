function checkMaxValueExceeded(sum, maxValue){
    if (sum > maxValue){
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
    return maxValue;      
}