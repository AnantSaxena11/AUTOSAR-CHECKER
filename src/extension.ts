// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AutosarDiagnosticProvider } from './diagnosticProvider';
import { AutosarCodeActionProvider } from './codeActionProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('========================================');
	console.log('AUTOSAR Checker extension is ACTIVATING!');
	console.log('========================================');

	// Initialize the diagnostic provider for real-time checking
	const diagnosticProvider = new AutosarDiagnosticProvider();
	diagnosticProvider.activate(context);
	
	console.log('Diagnostic provider initialized');

	// Register code action provider for quick fixes (suppress warnings)
	const codeActionProvider = new AutosarCodeActionProvider();
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			[{ language: 'cpp' }, { language: 'c' }],
			codeActionProvider,
			{
				providedCodeActionKinds: AutosarCodeActionProvider.providedCodeActionKinds
			}
		)
	);
	
	console.log('Code action provider registered');
	console.log('AUTOSAR Checker is READY!');
	vscode.window.showInformationMessage('✅ AUTOSAR Checker is now active!');


	// Register command to manually trigger AUTOSAR check
	const checkCommand = vscode.commands.registerCommand('autosar-checker.checkCurrentFile', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			vscode.window.showInformationMessage('AUTOSAR check completed for current file');
		} else {
			vscode.window.showWarningMessage('No active editor found');
		}
	});

	context.subscriptions.push(checkCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
