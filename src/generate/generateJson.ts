import * as fs from 'fs';
import * as path from 'path';

const cssFilePath: string = path.resolve(__dirname, 'styles.css'); 

const outputJsonPath: string = path.resolve("./src/", 'modifiers.json');

interface Modifier {
    modifier: string;
    description: string;
}

const generateDescription = (modifier: string, cssRule: string): string => {
    if (cssRule.includes('border-radius')) {
        return `Sets the border radius for ${modifier}`;
    } else if (cssRule.includes('background-color')) {
        return `Sets the background color for ${modifier}`;
    } else if (cssRule.includes('flex')) {
        return `Configures the flex container: ${modifier}`;
    } else if (cssRule.includes('align-items')) {
        return `Aligns items along the axis: ${modifier}`;
    } else if (cssRule.includes('aspect-ratio')) {
        return `Sets the aspect ratio for ${modifier}`;
    } else if (cssRule.includes('opacity')) {
        return `Sets the opacity for ${modifier}`;
    }
    
    return `Description for modifier ${modifier}`;
};

const parseCssFile = (filePath: string): void => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return;
        }

        const regex = /\.([a-zA-Z0-9\-:]+)\s*\{([^}]+)\}/g;
        const modifiers: Modifier[] = [];
        let match: RegExpExecArray | null;

        while ((match = regex.exec(data)) !== null) {
            const modifier: string = match[1];
            const cssRule: string = match[2].trim();
            modifiers.push({
                modifier,
                description: generateDescription(modifier, cssRule),
            });
        }

        saveToJson(outputJsonPath, modifiers);
    });
};

const saveToJson = (filePath: string, data: Modifier[]): void => {
    fs.writeFile(filePath, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error(`Error write JSON: ${err.message}`);
            return;
        }
        console.log(`JSON success saved в ${filePath}`);
    });
};

parseCssFile(cssFilePath);
