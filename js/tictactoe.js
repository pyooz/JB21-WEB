var N_SIZE = 3,
		EMPTY = "&nbsp;",
		boxes = [],
		turn = "X",
		score,
		moves;

	/*
	 * 틱택토 보드 설정
	 */
	function init() {
		var board = document.createElement('table');
    board.setAttribute("border", 1);
    board.setAttribute("cellspacing", 0);
    
		var identifier = 1;
		for (var i = 0; i < N_SIZE; i++) {
			var row = document.createElement('tr');
			board.appendChild(row);
			for (var j = 0; j < N_SIZE; j++) {
        var cell = document.createElement('td');
        cell.setAttribute('height', 120);
        cell.setAttribute('width', 120);
        cell.setAttribute('align', 'center');
        cell.setAttribute('valign', 'center');
				cell.classList.add('col' + j,'row' + i);
				if (i == j) {
					cell.classList.add('diagonal0');
				}
				if (j == N_SIZE - i - 1) {
					cell.classList.add('diagonal1');
				}
				cell.identifier = identifier;
				cell.addEventListener("click", set);
				row.appendChild(cell);
				boxes.push(cell);
				identifier += identifier;
			}
		}

		document.getElementById("tictactoe").appendChild(board);
		startNewGame();
	}

	/*
	 * 새 게임 플레이
	 */
	function startNewGame() {
		score = {
			"X": 0,
			"O": 0
		};
		moves = 0;
		turn = "X";
		boxes.forEach(function (square) {
			square.innerHTML = EMPTY;
		});
	}

	/*승패 확인*/
	function win(clicked) {
		// 모든 셀 클래스 get하기
		var memberOf = clicked.className.split(/\s+/);
		for (var i = 0; i < memberOf.length; i++) {
			var testClass = '.' + memberOf[i];
      var items = contains('#tictactoe ' + testClass, turn);
			// 이긴 경우: turn == N_SIZE
			if (items.length == N_SIZE) {
				return true;
			}
		}
		return false;
	}

function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return [].filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}

	/*클릭 확인, 턴 관리*/
	function set() {
		if (this.innerHTML !== EMPTY) {
			return;
		}
		this.innerHTML = turn;
		moves += 1;
		score[turn] += this.identifier;
		if (win(this)) {
			alert('승리자는 플레이어 ' + turn + '입니다!');
			startNewGame();
		} else if (moves === N_SIZE * N_SIZE) {
			alert("비겼습니다!");
			startNewGame();
		} else {
			turn = turn === "X" ? "O" : "X";
			document.getElementById('turn').innerHTML = '<h1>플레이어 ' +  turn + ' 의 턴 </h1>';
		}
	}

	init();