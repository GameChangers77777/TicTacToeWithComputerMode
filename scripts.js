document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const startButton = document.getElementById('startButton');
    const gamePage = document.getElementById('gamePage');
    const mainWindow = document.getElementById('mainWindow');
    const modeSelectionPage = document.getElementById('modeSelectionPage');
    const playerVsPlayerButton = document.getElementById('playerVsPlayerButton');
    const playerVsComputerButton = document.getElementById('playerVsComputerButton');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupRestartButton = document.getElementById('popupRestartButton');
    const clickSound = document.getElementById('clickSound');
    const winSound = document.getElementById('winSound');
    const drawSound = document.getElementById('drawSound');
    const madeByPopup = document.getElementById('madeByPopup');
    const madeByPopupSound = document.getElementById('madeByPopupSound');
    let currentPlayer = 'X';
    let gameState = Array(9).fill('');
    let gameActive = false;
    let mode = '';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));

        if (gameState[cellIndex] !== '' || !gameActive) {
            return;
        }

        clickSound.play();

        gameState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            displayWin();
            return;
        } else if (gameState.every(cell => cell !== '')) {
            gameActive = false;
            displayDraw();
            return;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (mode === 'computer' && currentPlayer === 'O') {
                setTimeout(makeComputerMove, 500);
            }
        }
    }

    function makeComputerMove() {
        let availableMoves = gameState.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        let randomIndex = Math.floor(Math.random() * availableMoves.length);
        let computerMoveIndex = availableMoves[randomIndex];

        gameState[computerMoveIndex] = currentPlayer;
        cells[computerMoveIndex].textContent = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            displayWin();
            return;
        } else if (gameState.every(cell => cell !== '')) {
            gameActive = false;
            displayDraw();
            return;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    function checkWin() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    }

    function displayWin() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            const cellA = cells[a];
            const cellB = cells[b];
            const cellC = cells[c];

            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                cellA.classList.add('win');
                cellB.classList.add('win');
                cellC.classList.add('win');

                popupMessage.textContent = `${gameState[a]} wins!`;
                showModal(popup);
                winSound.play();
            }
        }
    }

    function displayDraw() {
        popupMessage.textContent = 'It\'s a draw!';
        showModal(popup);
        drawSound.play();
    }

    function showModal(modal) {
        modal.style.display = 'flex';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    function restartGame() {
        currentPlayer = 'X';
        gameState = Array(9).fill('');
        gameActive = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('win');
        });
        hideModal(popup);
    }

    function switchMode(newMode) {
        mode = newMode;
        gamePage.style.display = 'flex';
        mainWindow.style.display = 'none';
        modeSelectionPage.style.display = 'none';
        restartGame();
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    startButton.addEventListener('click', () => {
        showModal(madeByPopup);
        madeByPopupSound.play();
        setTimeout(() => {
            hideModal(madeByPopup);
            mainWindow.style.display = 'none';
            modeSelectionPage.style.display = 'block';
        }, 2000); // Display the popup for 2 seconds
    });

    playerVsPlayerButton.addEventListener('click', () => switchMode('player'));
    playerVsComputerButton.addEventListener('click', () => switchMode('computer'));
    popupRestartButton.addEventListener('click', restartGame);

    // Initial state setup
    gameActive = false;
});
