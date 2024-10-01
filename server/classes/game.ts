import { Player } from "./player";

export interface Game {
    id: string
    player1: Player|null
    player2: Player|null
    gameboard: { [key: string]: string }
}

export class Game {
    
    constructor(gameID: string) {
        this.id = gameID;
        this.player1 = null;
        this.player2 = null;
        this.gameboard = {
            0: ""
            , 1: ""
            , 2: ""
            , 3: ""
            , 4: ""
            , 5: ""
            , 6: ""
            , 7: ""
            , 8: ""
        };
    }

 
    reset() {
        // Reset gameboard
        this.gameboard = {
            0: ""
            , 1: ""
            , 2: ""
            , 3: ""
            , 4: ""
            , 5: ""
            , 6: ""
            , 7: ""
            , 8: ""
        };

        // Player1 starts the games
        this.player1.turn = true;
        this.player2.turn = false;
    }

  
    addPlayer(playerID: string) {
        // Check which player to add (only two players per game)
        if (this.player1 == null) {
            this.player1 = new Player(playerID, true, "X");
            return "player1";
        } else {
            this.player2 = new Player(playerID, false, "O");
            return "player2";
        }
    }


    checkValid(player : Player, cell: string) {
        // Must check that player is one of the players
        if (player.turn && (this.player1.equals(player) || this.player2.equals(player))) {
            return this.gameboard[cell] == "";
        }

        return false;
    }

 
    updateBoard(cell: string, type: string) {
        this.gameboard[cell] = type;
        this.updateTurns();
    }

  
    updateTurns() {
        this.player1.turn = !this.player1.turn;
        this.player2.turn = !this.player2.turn;
    }

    checkStatus() {
        let board = this.gameboard;
        // Check row 1
        if ((board[0] != "") && ((board[0] == board[1]) && (board[1] == board[2]))) {
            return "win";
        }
        // Check row 2
        if ((board[3] != "") && ((board[3] == board[4]) && (board[4] == board[5]))) {
            return "win";
        }
        // Check row 3
        if ((board[6] != "") && ((board[6] == board[7]) && (board[7] == board[8]))) {
            return "win";
        }
        // Check col 1
        if ((board[0] != "") && ((board[0] == board[3]) && (board[3] == board[6]))) {
            return "win";
        }
        // Check col 2
        if ((board[1] != "") && ((board[1] == board[4]) && (board[4] == board[7]))) {
            return "win";
        }
        // Check col 3
        if ((board[2] != "") && ((board[2] === board[5]) && (board[5] == board[8]))) {
            return "win";
        }
        // Check diag 1
        if ((board[0] != "") && ((board[0] === board[4]) && (board[4] == board[8]))) {
            return "win";
        }
        // Check diag 2
        if ((board[2] != "") && ((board[2] === board[4]) && (board[4] == board[6]))) {
            return "win";
        }

        // Check board full with no winner
        if ((board[0] != "") && (board[1] != "") && (board[2] != "") && (board[3] != "") &&
            (board[4] != "") && (board[5] != "") && (board[6] != "") && (board[7] != "") && (board[8] != "")) {
            return "tie";
        }

        // Game is ongoing
        return "ongoing";
    }
}