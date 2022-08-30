export interface userInterface {
    cToken: String | undefined;
}


export interface userInfo {
    name: string;
    positive: number;
    points: number;
    stats: number;
    picture: string | undefined;
    players: playerInterface[];
}


export interface playerInterface {
    name : string;
    number: number;
    points: number;
}