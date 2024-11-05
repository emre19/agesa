const dayjs = require('dayjs');

// tarihleri ms cinsine çevir
export let parseDateToMilliseconds = (dateString) => {
    let parts = dateString.split(" ");
    let dateParts = parts[0].split("-");
    let timeParts = parts[1].split(":");
   
    let year = parseInt(dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2]);
    let month = parseInt(dateParts[1]) - 1; 
    let day = parseInt(dateParts[0]);
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    let seconds = parseInt(timeParts[2]);
   
    return dayjs(new Date(year, month, day, hours, minutes, seconds)).valueOf();

    //return dayjs(dateString,"DD-MM-YY HH:mm:ss").valueOf();
  }