const player1st = '先行';
const player2nd = '後攻';

// プレイヤー情報
const playerInfomations = {
  先行: {
    mark: '〇',
    color: 'text-skyblue',
    image: {
      normal: './images/face_man.png',
      win: './images/face_man_win.png',
      lose: './images/face_man_lose.png',
    },
  },
  後攻: {
    mark: '×',
    color: 'text-pink',
    image: {
      normal: './images/face_woman.png',
      win: './images/face_woman_win.png',
      lose: './images/face_woman_lose.png',
    },
  },
};

// 勝利判定マップ(最後にマークされた場所に関連するセルを列挙)
// r => row, c => column
const victoryJudgeMap = {
  r1c1: [
    ['r1c1', 'r1c2', 'r1c3'], // →
    ['r1c1', 'r2c1', 'r3c1'], // ↓
    ['r1c1', 'r2c2', 'r3c3'], // ↘
  ],
  r1c2: [
    ['r1c1', 'r1c2', 'r1c3'], // →
    ['r1c2', 'r2c2', 'r3c2'], // ↓
  ],
  r1c3: [
    ['r1c1', 'r1c2', 'r1c3'], // →
    ['r1c3', 'r2c3', 'r3c3'], // ↓
    ['r1c3', 'r2c2', 'r3c1'], // ↙
  ],
  r2c1: [
    ['r2c1', 'r2c2', 'r2c3'], // →
    ['r1c1', 'r2c1', 'r3c1'], // ↓
  ],
  r2c2: [
    ['r2c1', 'r2c2', 'r2c3'], // →
    ['r1c2', 'r2c2', 'r3c2'], // ↓
    ['r1c1', 'r2c2', 'r3c3'], // ↘
    ['r1c3', 'r2c2', 'r3c1'], // ↙
  ],
  r2c3: [
    ['r2c1', 'r2c2', 'r2c3'], // →
    ['r1c3', 'r2c3', 'r3c3'], // ↓
  ],
  r3c1: [
    ['r3c1', 'r3c2', 'r3c3'], // →
    ['r1c1', 'r2c1', 'r3c1'], // ↓
    ['r1c3', 'r2c2', 'r3c1'], // ↙
  ],
  r3c2: [
    ['r3c1', 'r3c2', 'r3c3'], // →
    ['r1c2', 'r2c2', 'r3c2'], // ↓
  ],
  r3c3: [
    ['r3c1', 'r3c2', 'r3c3'], // →
    ['r1c3', 'r2c3', 'r3c3'], // ↓
    ['r1c1', 'r2c2', 'r3c3'], // ↘
  ],
};

// 手番プレイヤー
let ternPlayer = player1st;

// ゲーム終了フラグ
let isGameOver = false;

// 引き分けカウンター
let tieCounter = 9;

// ウィンドウが読み込まれたときに実行する処理
$(function () {
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
function init() {
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
  $('#img-player1').attr('src', playerInfomations[player1st].image.normal);
  $('#img-player2').attr('src', playerInfomations[player2nd].image.normal);

  // プレイヤーを先行にする
  ternPlayer = player1st;

  // ゲーム終了フラグを倒す
  isGameOver = false;

  // 勝利演出を消す
  $('body').removeClass('confetti');

  // メッセージを消す
  $('#info').text('');
}

// セルの初期化処理
//
// @param cell 〇×ゲームのマス
function initCell(cell) {
  cell.attr('data-mark', '');
  cell.removeClass('text-skyblue');
  cell.removeClass('text-pink');
}

// セルをクリックしたときに実行する処理
function onClickCellHandler() {
  // ゲーム終了後はマークできない
  if (isGameOver) {
    return;
  }

  // マーク済みのセルはマークできない
  if (isMarked(this)) {
    return;
  }

  // マークを付ける
  $(this).attr('data-mark', playerInfomations[ternPlayer].mark);
  $(this).addClass(playerInfomations[ternPlayer].color);

  // 勝利判定
  if (isVictory($(this).attr('id'))) {
    isGameOver = true;
    $('#main').addClass('bg-confetti');

    if (ternPlayer === player1st) {
      $('#info').text('先行の勝利です!!');
      $('#img-player1').attr('src', playerInfomations[player1st].image.win);
      $('#img-player2').attr('src', playerInfomations[player2nd].image.lose);
    }
    else {
      $('#info').text('後攻の勝利です!!');
      $('#img-player1').attr('src', playerInfomations[player1st].image.lose);
      $('#img-player2').attr('src', playerInfomations[player2nd].image.win);
    }

    return;
  }

  // 引き分けたらゲーム終了
  if (isTied()) {
    isGameOver = true;
    $('#info').text('引き分けです');
  }

  // プレイヤー交代
  changePlayer();
}

// プレイヤー交代処理
function changePlayer() {
  // Bug 2. 最初の1回しかプレイヤーが変わりません！
  ternPlayer = (ternPlayer === player1st ? player2nd : player1st);
}

// マーク済み判定
// クリックしたセルにマークがあるかどうかを返します。
//
// @param clickedCell クリックしたセル
// @return boolean マークの有無
function isMarked(clickedCell) {
  // Bug 3. マークが上書きできてしまいます！
  return $(clickedCell).attr('data-mark') !== '';
}

// 引き分け判定
function isTied() {
  // Bug 4. 全てのマスを埋めても引き分けになりません！
  return tieCounter <= 0;
}

// 勝利判定
//
// @param markedCellId マークしたセルのID
// @return boolean 勝敗判定
function isVictory(markedCellId) {
  // 定義した方向へ勝利判定を繰り返し、1方向でも条件を満たしていれば決着
  return victoryJudgeMap[markedCellId].some((direction) => {
    let marks = [];

    // 判定方向に応じたマークを取得
    direction.forEach((cellId) => {
      marks.push($('#' + cellId).attr('data-mark'));
    });

    // 現在のプレイヤーに応じたマークが1方向でも揃っていれば勝利
    const currentPlayerMark = playerInfomations[ternPlayer].mark;
    return marks.every((value) => value === currentPlayerMark);
  });
}
