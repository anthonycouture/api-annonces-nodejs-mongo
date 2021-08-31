import path from "path";
import fs from "fs";

export function getPrivateKey(): Buffer {
    const certPath = path.join(__dirname, './private.key');
    return fs.readFileSync(certPath);
}