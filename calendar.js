function getBackgroundColor(hours) {
  //
  //始業時間に応じてセル色を設定
  //
  var pastelRed = '#f4cccc';
  var pastelBlue = '#cfe2f3';
  var pastelYellow = '#ffe599';
  var color;
  switch(hours){
    case 7:
      return pastelBlue;
    case 8:
      return pastelRed;
    default:
      return pastelYellow;
  }
}
