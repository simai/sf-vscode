import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface CssModifier {
    modifier: string;
    description: string;
}

console.log('The extension "sf-vscode" is connected!');

export function activate(context: vscode.ExtensionContext) {

    const modifiersPath = path.join(context.extensionPath, 'src', 'modifiers.json');
    const data = fs.readFileSync(modifiersPath, 'utf-8');
    const cssModifiers: CssModifier[] = JSON.parse(data);

    const provider = vscode.languages.registerCompletionItemProvider(
        ['css', 'scss', 'sass', 'less', 'html', 'javascript', 'typescript', 'vue', 'react'],
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
               
                const line = document.lineAt(position).text;
                const charBefore = position.character > 0 ? line[position.character - 1] : '';

                if (charBefore !== '.') {
                    return undefined;
                }

                const linePrefix = line.substr(0, position.character);

                const regex = /\.([\w-]*)$/;
                const match = linePrefix.match(regex);

                if (!match) {
                    return undefined;
                }

                const currentWord = match[1].toLowerCase();

                const filteredModifiers = cssModifiers.filter(mod => mod.modifier.startsWith(currentWord));

                if (filteredModifiers.length === 0) {
                    return undefined;
                }

                return filteredModifiers.map(mod => {
                    const completionItem = new vscode.CompletionItem(mod.modifier, vscode.CompletionItemKind.Text);
                    completionItem.detail = mod.description;

                    const startPos = position.translate(0, -currentWord.length);
                    const range = new vscode.Range(startPos, position);

                    completionItem.range = range;

                    return completionItem;
                });
            }
        },
        '.'
    );

    context.subscriptions.push(provider);
}

export function deactivate() {}
