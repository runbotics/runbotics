import { existsSync, readFileSync } from "fs";
import path from "path";

export function loadAuthData() {
    const authFile = path.join(__dirname, "../.auth/user.json");

    if (!existsSync(authFile)) {
        throw new Error(`Auth file does not exist at: ${authFile}`);
    }

    try {
        const fileContent = readFileSync(authFile, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        throw new Error("Error reading or parsing auth file");
    }
}
