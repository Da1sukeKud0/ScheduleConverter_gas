function onChange() {
  //定数定義
  var white = "#FFFFFF";
  var calendarInputPatternRow = 4;
  var calendarStartRow = 5;
  var calendarStartColumn = 2;
  var mostEarlyStartHours = 7;

  //アクティブブック/シート/セルの取得
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  var cell = sheet.getActiveCell();
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  //入力セルの行チェック
  if(cell.getRow() != calendarInputPatternRow || cell.getColumn() <= 1){return 0;}

  //masterシートから勤務パターンを取得
  var patternList = getPatternList();
  
  //calendarシートの編集対象列をクリア
  sheet.getRange(calendarStartRow, 
                 cell.getColumn(), 
                 lastRow - calendarStartRow + 1).setValue("").setBackground(white);
  
  var id = cell.getValue();
  //セル空白判定
  if(cell.isBlank()){return 0;}
  //"休"判定
  if(patternList[id].endTime - patternList[id].startTime == 0){return 0;}
  
  //始業/終業時間の列計算
  var startPointer = mostEarlyStartHours + (patternList[id].startTime.getHours() - mostEarlyStartHours)*4 + patternList[id].startTime.getMinutes()/15;
  var endPointer = mostEarlyStartHours + (patternList[id].endTime.getHours() - mostEarlyStartHours)*4 + patternList[id].endTime.getMinutes()/15;
  
  //セル着色
  sheet.getRange(startPointer, cell.getColumn(), endPointer - startPointer + 1)
  .setBackground(getBackgroundColor(patternList[id].startTime.getHours()));
  
  //スケジュール表示
  sheet.getRange(startPointer, cell.getColumn()).setValue(patternList[id].startTime);
  sheet.getRange(endPointer, cell.getColumn()).setValue(patternList[id].endTime);
}