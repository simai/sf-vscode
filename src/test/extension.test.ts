import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        const result = 1 + 1;
        assert.strictEqual(result, 2, '1 + 1 is 2');
    });
});
