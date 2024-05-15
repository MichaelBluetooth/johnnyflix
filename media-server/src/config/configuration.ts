import { readFileSync } from 'fs';
import { join } from 'path';

const JSON_CONFIG_FILENAME = 'app_config.json';

export default () => {
    const configPath = join(__dirname, "..", "config", JSON_CONFIG_FILENAME);
    console.log(`LOADING CONFIG: ${configPath}`);
    return JSON.parse(
        readFileSync(configPath, 'utf8'),
    ) as Record<string, any>;
};