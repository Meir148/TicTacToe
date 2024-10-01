export interface Player {
    id: string;
    turn: boolean;
    type: string;
    equals(rhs: Player): boolean;
}

export class Player {
 
    constructor(playerID: string, turn: boolean, type: string) {
        /// Id of the player
        this.id = playerID;
        /// Whether it is the players turn
        this.turn = turn;
        /// The type of the player "X" or "O"
        this.type = type;
    }

    equals(rhs: Player) {
        return (this.id == rhs.id
            && this.turn == rhs.turn
            && this.type == rhs.type);
    }
}