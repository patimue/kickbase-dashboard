export interface userInterface {
    cToken: String | undefined;
}


export interface userInfo {
    id: string;
    name: string;
    positive: number;
    points: number;
    stats: number;
    picture: string | undefined;
    players: playerInterface[];
}


export interface playerInterface {
    name: string;
    number: number;
    points: number;
    image: string;
    boughtFor: number;
    marketV: number;
    averagePoints: number;
    position: string;
    id: number;
    user?: string;
    teamId: string;
}

export const position = {
    1: "TW",
    2: "ABW",
    3: "MF",
    4: "ST"
}