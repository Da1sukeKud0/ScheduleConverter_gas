function onChange() {
  //変数定義
  var white = "#FFFFFF";
  var calendarInputPatternRow = 4;
  var calendarStartRow = 5;
  var calendarStartColumn = 2;
  var mostEarlyStartHours = 7;
  var calendarReloadButtonRow = 1;
  var calendarReloadButtonColumn = 21;
  var calendarReloadButtonValue = false;
  
  //アクティブブック/シート/セルの取得
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  var cell = sheet.getActiveCell();
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  //入力セルチェック
  if(sheet.getSheetName() == 'master'){
    return;
  }else if(cell.getRow() == calendarReloadButtonRow && cell.getColumn() == calendarReloadButtonColumn){
    calendarReloadButtonValue = true;
  }else if(cell.getRow() != calendarInputPatternRow || cell.getColumn() <= 1){
    return;
  }
  
  //masterシートから勤務パターンを取得
  var patternList = getPatternList();
  
  //calendarシートの編集対象列をクリア
  if(calendarReloadButtonValue){
    sheet.getRange(calendarStartRow, 
                 calendarStartColumn, 
                 lastRow - calendarStartRow + 1, 
                 lastColumn - calendarStartColumn + 1).setValue("").setBackground(white);
  }else{
    sheet.getRange(calendarStartRow, 
                   cell.getColumn(), 
                   lastRow - calendarStartRow + 1).setValue("").setBackground(white);
  }
  
  //勤務パターン入力行の値を取得
  var idList = Array(lastColumn - calendarStartColumn + 1);
  if(calendarReloadButtonValue){
    idList = sheet.getRange(calendarInputPatternRow, 
                            calendarStartColumn, 
                            1, 
                            lastColumn - calendarStartColumn + 1).getValues()[0];
  }else{
    idList[cell.getColumn() - calendarStartColumn] = cell.getValue();
    idList.forEach(function(id, index, idList) {
      if(id != cell.getColumn() - calendarStartColumn){
        idList[id] = "";
      }
    });
  }
  
  //各入力値に対する処理
  idList.forEach(function(id, index) {
    //セル空白判定
    if(id == ""){return;}
    //"休"判定
    if(patternList[id].endTime - patternList[id].startTime == 0){return;}
    
    //始業/終業時間の列計算
    var startPointer = mostEarlyStartHours + (patternList[id].startTime.getHours() - mostEarlyStartHours)*4 + patternList[id].startTime.getMinutes()/15;
    var endPointer = mostEarlyStartHours + (patternList[id].endTime.getHours() - mostEarlyStartHours)*4 + patternList[id].endTime.getMinutes()/15;
    
    //編集対象列の設定
    var targetColumn = calendarStartColumn + index;
    
    //始業時間~終業時間までのセルを着色
    sheet.getRange(startPointer, targetColumn, endPointer - startPointer + 1)
    .setBackground(getBackgroundColor(patternList[id].startTime.getHours()));
    
    //始業/終業時間を各セルに入力
    sheet.getRange(startPointer, targetColumn).setValue(patternList[id].startTime);
    sheet.getRange(endPointer, targetColumn).setValue(patternList[id].endTime);
  });
  
  //  //高速化のためのfuture work
  //  var values = [].push([]);
  //  values.push([]);
  //  //valuesを転置
  //  var _ = Underscore.load();
  //  var values_T = _.zip.apply(_, values);
  //  
  //  //スケジュール表示
  //  sheet.getRange(calendarStartRow, 
  //                 calendarStartColumn, 
  //                 lastRow - calendarStartRow + 1, 
  //                 lastColumn - calendarStartColumn + 1).setValues(values_T);
  
  //再読込ボタンの値を戻す
  if(calendarReloadButtonValue){
    sheet.getRange(calendarReloadButtonRow, calendarReloadButtonColumn).setValue(false);
  }
}