const player1 = 0;  // 先行
const player2 = 1;   // 後攻

const playerInfomations = [
  {
    mark: '〇',
    color: 'text-skyblue',
    image: {
      normal: './images/face_man.png',
      win: './images/face_man_win.png',
      lose: './images/face_man_lose.png'
    }
  },
  {
    mark: '×',
    color: 'text-pink',
    image: {
      normal: './images/face_woman.png',
      win: './images/face_woman_win.png',
      lose: './images/face_woman_lose.png'
    }
  }
];

// 勝利判定マップ(最後にマークされた場所に関連するセルを列挙)
const victoryJudgeMap = {
  "r1c1": [
    ["r1c1", "r1c2", "r1c3"],  // →
    ["r1c1", "r2c1", "r3c1"],  // ↓
    ["r1c1", "r2c2", "r3c3"],  // ↘
  ],
  "r1c2": [
    ["r1c1", "r1c2", "r1c3"],  // →
    ["r1c2", "r2c2", "r3c2"],  // ↓
  ],
  "r1c3": [
    ["r1c1", "r1c2", "r1c3"],  // →
    ["r1c3", "r2c3", "r3c3"],  // ↓
    ["r1c3", "r2c2", "r3c1"],  // ↙
  ],
  "r2c1": [
    ["r2c1", "r2c2", "r2c3"],  // →
    ["r1c1", "r2c1", "r3c1"],  // ↓
  ],
  "r2c2": [
    ["r2c1", "r2c2", "r2c3"],  // →
    ["r1c2", "r2c2", "r3c2"],  // ↓
    ["r1c1", "r2c2", "r3c3"],  // ↘
    ["r1c3", "r2c2", "r3c1"],  // ↙
  ],
  "r2c3": [
    ["r2c1", "r2c2", "r2c3"],  // →
    ["r1c3", "r2c3", "r3c3"],  // ↓
  ],
  "r3c1": [
    ["r3c1", "r3c2", "r3c3"],  // →
    ["r1c1", "r2c1", "r3c1"],  // ↓
    ["r1c3", "r2c2", "r3c1"],  // ↙
  ],
  "r3c2": [
    ["r3c1", "r3c2", "r3c3"],  // →
    ["r1c2", "r2c2", "r3c2"],  // ↓
  ],
  "r3c3": [
    ["r3c1", "r3c2", "r3c3"],  // →
    ["r1c3", "r2c3", "r3c3"],  // ↓
    ["r1c1", "r2c2", "r3c3"],  // ↘
  ]
}

let player = player1;
let isGameOver = false;
let drawCounter = 9;

// ウィンドウが読み込まれたときに実行する処理
$(function() {
  init();

  let cell = null;

  /* イベントハンドラの登録 */
  cell = $('#r1c1');
  cell.on('click', onClickCellHandler);

  cell = $('#r1c2');
  cell.on('click', onClickCellHandler);

  cell = $('#r1c3');
  cell.on('click', onClickCellHandler);

  cell = $('#r2c1');
  cell.on('click', onClickCellHandler);

  cell = $('#r2c2');
  cell.on('click', onClickCellHandler);

  cell = $('#r2c3');
  cell.on('click', onClickCellHandler);

  cell = $('#r3c1');
  cell.on('click', onClickCellHandler);

  cell = $('#r3c2');
  cell.on('click', onClickCellHandler);

  cell = $('#r3c3');
  cell.on('click', onClickCellHandler);
});

// 初期化処理
const init = function() {
  let cell = null;

  cell = $('#r1c1');
  initCell(cell);
  
  cell = $('#r1c2');
  initCell(cell);
  
  cell = $('#r1c3');
  initCell(cell);
  
  cell = $('#r2c1');
  initCell(cell);
  
  cell = $('#r2c2');
  initCell(cell);
  
  cell = $('#r2c3');
  initCell(cell);

  cell = $('#r3c1');
  initCell(cell);
  
  cell = $('#r3c2');
  initCell(cell);
  
  cell = $('#r3c3');
  initCell(cell);

  // プレイヤーに画像を設定する
  $('#img-player1').attr('src', playerInfomations[player1].image.normal);
  $('#img-player2').attr('src', playerInfomations[player2].image.normal);

  // プレイヤーを先行にする
  player = player1;

  // ゲーム終了フラグを倒す
  isGameOver = false;

  // 勝利演出を消す
  $('body').removeClass('confetti');

  // メッセージを消す
  $('#info').text('');
}

// セルの初期化処理
const initCell = function(cell) {
  cell.attr('data-mark', '');
}

const onClickCellHandler = function () {
  // ゲーム終了後はマークできない
  if (isGameOver) {
    return;
  }

  // マーク済みのセルはマークできない
  if ($(this).attr('data-mark') !== '') {
    return;
  }

  // マークを付ける
  $(this).attr('data-mark', playerInfomations[player].mark);
  $(this).addClass(playerInfomations[player].color);

  // 勝利判定
  if(judgeVictory($(this).attr('id'))) {
    isGameOver = true;
    $('#main').addClass('bg-confetti');
    if (player === player1) {
      $('#info').text('先行の勝利です!!');
      $('#img-player1').attr('src', playerInfomations[player1].image.win);
      $('#img-player2').attr('src', playerInfomations[player2].image.lose);
    }
    else {
      $('#info').text('後攻の勝利です!!');
      $('#img-player1').attr('src', playerInfomations[player1].image.lose);
      $('#img-player2').attr('src', playerInfomations[player2].image.win);
    }


    return; 
  }

  // 勝敗が付かない場合は引き分けカウンターを減らす
  drawCounter--;
  if (drawCounter <= 0) {
    isGameOver = true;

    // 0になったら引き分け
    $('#info').text('引き分けです');
  }

  // プレイヤー交代
  changePlayer();
}

const changePlayer = function() {
  if (player === player1) {
    player = player2;
  }
  else {
    player = player1;
  }
}

const judgeVictory = function(markedCellId) {
  return victoryJudgeMap[markedCellId].some(direction => {
    let marks = [];

    // 判定方向に応じたマークを取得
    direction.forEach(cellId => {
      marks.push($('#' + cellId).attr('data-mark'));
    });

    // 現在のプレイヤーに応じたマークが1方向でも揃っていれば勝利
    const currentPlayerMark = playerInfomations[player].mark;
    return marks.every((value) => value === currentPlayerMark);
  });
}
