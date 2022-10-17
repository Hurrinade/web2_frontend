export interface TableData {
    clubId: number,
    clubName: string,
    points: number,
    goals: number
}

export interface Result {
    resultId: number,
    firstTeamName: string,
    secondTeamName: string,
    firstTeamGoals: number,
    secondTeamGoals: number
}

export interface Fixture {
    clubId: number,
    firstTeamName: string,
    secondTeamName: string,
    fixtureDate: Date
}

export interface Comment {
    commentId: number,
    resultId: number,
    date: Date,
    email: string,
    text: string,
}