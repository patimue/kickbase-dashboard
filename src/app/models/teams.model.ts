export interface teamInterface {
    name: string;
    standing: number;
    id: number;
    cmd?: number;
    points?: number;
}

export interface Match {
    teamOne: string;
    teamTwo: string;
    teamOnePoints: number;
    teamTwoPoints: number;
    status: number | undefined;
    minutes : number | undefined;
    id? : string;
    startTime?: Date;
    odds? : {
        teamOne : number;
        tie : number;
        teamTwo: number;
    }
}