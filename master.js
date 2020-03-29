function getPatternList() {
  //
  //masterシートから勤務パターンを取得
  //
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('master');
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  //勤務パターンリストの取得
  var Pattern = function(patternId, startTime, breakTime, endTime){
    this.patternId = patternId;
    this.startTime = startTime;
    this.breakTime = breakTime;
    this.endTime = endTime;
  }; 
  var patternList = {};
  var range = sheet.getRange(3, 1, lastRow, lastColumn);
  for (var i = 1; i <= lastRow+1-3; i++){
    patternList[range.getCell(i, 1).getValue()]
    = new Pattern(range.getCell(i, 1).getValue(), 
                  range.getCell(i, 2).getValue(), 
                  range.getCell(i, 3).getValue(), 
                  range.getCell(i, 4).getValue());
  }
  return patternList;
}
