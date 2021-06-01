var grid = document.getElementById("grid");
var testMode = false; //켜면 내부 확인가능
generateGrid();

function generateGrid() {
  //10x10 그리드 형성
  grid.innerHTML="";
  for (var i=0; i<10; i++) {
    row = grid.insertRow(i);
    for (var j=0; j<10; j++) {
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      var mine = document.createAttribute("data-mine");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  addMines();
}

function addMines() {
  //지뢰 랜덤 생성
  for (var i=0; i<20; i++) {
    var row = Math.floor(Math.random() * 10);
    var col = Math.floor(Math.random() * 10);
    var cell = grid.rows[row].cells[col];
    cell.setAttribute("data-mine","true");
    if (testMode) cell.innerHTML="X";
  }
}

function revealMines() {
    //모든 지뢰를 빨간색으로 표시
    for (var i=0; i<10; i++) {
      for(var j=0; j<10; j++) {
        var cell = grid.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true") cell.className="mine";
      }
    }
}

function checkLevelCompletion() {
  var levelComplete = true;
    for (var i=0; i<10; i++) {
      for(var j=0; j<10; j++) {
        if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
      }
  }
  if (levelComplete) {
    alert("You Win!");
    revealMines();
  }
}

function clickCell(cell) {
  //마인 클릭시
  if (cell.getAttribute("data-mine")=="true") {
    revealMines();
    alert("이런! 지뢰를 밟았어요 ㅠ.ㅠ");
  } else {
    cell.className="clicked";
    //주변 지뢰수 계산
    var mineCount=0;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    //alert(cellRow + " " + cellCol);
    for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,9); i++) {
      for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,9); j++) {
        if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    cell.innerHTML=mineCount;
    if (mineCount==0) { 
      //지뢰가 없어 주변 모든 칸을 표시할떄
      for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,9); i++) {
        for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,9); j++) {
          //재귀호출
          if (grid.rows[i].cells[j].innerHTML=="") clickCell(grid.rows[i].cells[j]);
        }
      }
    }
    checkLevelCompletion();
  }
}