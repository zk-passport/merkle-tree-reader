import fs from 'fs';

export const readJSONFile = <T>(path: string): T | null => {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data) as T;
    }
    return null;
};

export const writeJSONFile = (path: string, data: any): void => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
