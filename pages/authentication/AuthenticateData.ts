
import path from 'path';
import * as fs from 'fs';

export interface UserData {
    username: string,
    password: string,
    error: string,
    session_filename: string
}

export class AuthenticateData {
    DEFAULT_USERNAME = 'standard_user'
    readonly userData: UserData[];
    constructor() {
        this.userData = JSON.parse(
            fs.readFileSync(path.join(__dirname, './authenticate_data.json'), 'utf-8')
        );
    }

    getDefault(): UserData {
        return this.getByUsername(this.DEFAULT_USERNAME);
    }

    getByUsername(username: string): UserData {
        return this.userData.filter((u: UserData) => u.username == username)[0]
    }

    getAllNonDefault(): UserData[] {
        return this.userData.filter((u: UserData) => u.username != this.DEFAULT_USERNAME)
    }
}

export function defaultUserSessionFilename (): string {
    return (new AuthenticateData()).getDefault().session_filename;
}
