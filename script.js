const X_CLASS='x';
const O_CLASS='circle';

const winningCombos=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
]
let turnX=true;

let position=[];
updatePosition();
console.log(position)
const field=document.getElementById('field');
const boards=document.querySelectorAll('[data-board]');
const cellElements=document.querySelectorAll('[data-cell]');


function getDataCells(boardId) {
    const board = document.getElementById(boardId);
    const cells = board.querySelectorAll('[data-cell]');
    return Array.from(cells).map(cell => {
        if (cell.classList.contains(X_CLASS))
            return 'x';
        if (cell.classList.contains(O_CLASS))
            return 'o';
        else
            return '';
    }); 
}
function updatePosition() {
    position = [];

    for (let i = 1; i <= 9; i++) {
        const boardId = 'board' + i;
        const boardData = getDataCells(boardId);
        position.push(boardData);
    }

}
function move(e) {
    const cell=e.target;
    const turnPlayer=turnX ? X_CLASS : O_CLASS;
    const currBoard=cell.closest('[data-board]');
    console.log(currBoard.id)
    const currCells=currBoard.querySelectorAll(`[data-cell]`);
    console.log(currCells.length);
    if (currBoard.classList.contains('curr')) {
        
        cell.classList.add(turnPlayer);
        updatePosition();
        console.log(position);
        const newCurrBoard=[...cellElements].indexOf(cell)%9;
        if (checkForTake([...currCells],turnPlayer)) {
            currBoard.classList.add('taken',turnPlayer);
        }
        else {
            if (checkForDraw([...currCells])){
                currBoard.classList.add('draw');
            }
        }

        if (checkWin(turnPlayer)) {
            const winText=document.querySelector('[data-winning-message-text]')
            winText.textContent = `${turnX ? "X's" : "O's"} wins!`
            switchView(true,'winningMessage');
            muteAudio();
        }
        else if (endDrawGame()) {
            const winText=document.querySelector('[data-winning-message-text]')
            winText.textContent = `Draw!`
            switchView(true,'winningMessage');
            muteAudio();
            return 0;
        }

        if (!boards[newCurrBoard].classList.contains('taken') && !boards[newCurrBoard].classList.contains('draw')) {
            boards.forEach(board => board.classList.remove('curr'));
            boards[newCurrBoard].classList.add('curr');
        }
        else {
            boards.forEach(board => {
                if (!board.classList.contains('draw') && !board.classList.contains('taken')) {
                    board.classList.add('curr');
                }
            });
        }
        update();

    }
    

    
}

function swap() {
    field.classList.remove(X_CLASS,O_CLASS);
    field.classList.add(turnX ? X_CLASS:O_CLASS)
}

function update() {

    turnX=!turnX;
    swap();
    cellElements.forEach(cell=>{
        if (cell.classList.contains('x') || cell.classList.contains('circle') || cell.closest('[data-cell]').classList.contains('taken') || cell.closest('[data-cell]').classList.contains('draw'))
            cell.removeEventListener('click',move);
        })
    
}

function checkForTake(board, turnPlayer) {
    return winningCombos.some(combination=>{
        return combination.every(index=>{
            return board[index].classList.contains(turnPlayer);
        })
    })
}

function checkForDraw(board) {
    return board.every(cell=>{
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    })
}

function checkWin(turnPlayer) {
    return winningCombos.some(combination=>{
        return combination.every(index=>{
            return boards[index].classList.contains(turnPlayer);
        })
    })
}

function endDrawGame() {
    return [...boards].every(board=>{
        return board.classList.contains(X_CLASS) || board.classList.contains(O_CLASS) || board.classList.contains('draw');
    })
}

function switchView(show,id) {
    if (show) {
        document.getElementById(id).classList.add('show');
        document.getElementById(id).classList.remove('hide');
    }
    else {
        document.getElementById(id).classList.remove('show');
        document.getElementById(id).classList.add('hide');
    }
}

function startGame() {
    switchView(false,'startMenu');
    boards.forEach(board =>{
        board.classList.add('curr');
    })
    
    cellElements.forEach(cell=>{
        cell.classList.remove('x','circle')
        cell.addEventListener('click', move);
    })
    document.getElementById('playAudio').play();
}

function muteAudio() {
    document.getElementById('audioButtonImg').setAttribute('src',document.getElementById('audioButtonImg').src.includes('play.png') ? './img/mute.png' : './img/play.png');
    document.getElementById('playAudio').muted=document.getElementById('audioButtonImg').src.includes('play.png') ? false : true;
    
}