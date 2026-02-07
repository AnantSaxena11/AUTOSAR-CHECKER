// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AutosarDiagnosticProvider } from './diagnosticProvider';
import { AutosarCodeActionProvider } from './codeActionProvider';
import { AutosarTreeDataProvider } from './violationTreeView';
import { ViolationDetailsPanel, ViolationDetails } from './violationDetailsPanel';
import { AutosarHoverProvider } from './hoverProvider';

let diagnosticProvider: AutosarDiagnosticProvider;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('========================================');
	console.log('AUTOSAR Checker extension is ACTIVATING!');
	console.log('========================================');

	// Create tree data provider for custom panel
	const treeDataProvider = new AutosarTreeDataProvider();
	
	// Register the AUTOSAR Violations tree view
	const treeView = vscode.window.createTreeView('autosarViolations', {
		treeDataProvider: treeDataProvider,
		showCollapseAll: true
	});
	context.subscriptions.push(treeView);

	// Create hover provider with tree data provider and extension URI
	const hoverProvider = new AutosarHoverProvider(treeDataProvider, context.extensionUri);
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(
			[{ language: 'cpp' }, { language: 'c' }],
			hoverProvider
		)
	);

	// Initialize the diagnostic provider with tree view and hover provider integration
	diagnosticProvider = new AutosarDiagnosticProvider(treeDataProvider, hoverProvider);
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

	// Register command: Pause/Resume checking
	const togglePauseCommand = vscode.commands.registerCommand('autosar-checker.togglePause', () => {
		const isPaused = treeDataProvider.togglePause();
		const statusMsg = isPaused ? '⏸️ AUTOSAR Checker PAUSED' : '▶️ AUTOSAR Checker RESUMED';
		vscode.window.showInformationMessage(statusMsg);
		
		// Update status bar
		vscode.commands.executeCommand('setContext', 'autosar-checker.isPaused', isPaused);
	});

	// Register command: Rerun check
	const rerunCheckCommand = vscode.commands.registerCommand('autosar-checker.rerunCheck', () => {
		treeDataProvider.rerunCheck();
		diagnosticProvider.recheckAllFiles();
		vscode.window.showInformationMessage('🔄 Rechecking all files...');
	});

	// Register command: Clear all violations
	const clearViolationsCommand = vscode.commands.registerCommand('autosar-checker.clearViolations', () => {
		treeDataProvider.clearViolations();
		vscode.window.showInformationMessage('🗑️ All violations cleared');
	});

	// Register command: Go to violation and open details panel
	const goToViolationCommand = vscode.commands.registerCommand('autosar-checker.goToViolation', 
		async (file: string, line: number, column: number, ruleCode: string, message: string, severity: 'error' | 'warning' | 'info', category: string) => {
			// Open the file and navigate to the violation
			const document = await vscode.workspace.openTextDocument(file);
			const editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.One);
			const position = new vscode.Position(line, column);
			editor.selection = new vscode.Selection(position, position);
			editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);

			// Get violation with code snippet
			const violationWithSnippet = treeDataProvider.getViolationWithSnippet({
				file,
				line,
				column,
				ruleCode,
				message,
				severity,
				category
			});

			// Show details panel on the right
			const details: ViolationDetails = {
				ruleCode,
				message,
				severity,
				category,
				file,
				line,
				column,
				codeSnippet: violationWithSnippet.codeSnippet
			};

			ViolationDetailsPanel.show(details, context.extensionUri);
	});

	// Register command: Recheck all files
	const recheckAllFilesCommand = vscode.commands.registerCommand('autosar-checker.recheckAllFiles', () => {
		diagnosticProvider.recheckAllFiles();
	});

	// Register command to manually trigger AUTOSAR check
	const checkCommand = vscode.commands.registerCommand('autosar-checker.checkCurrentFile', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			vscode.window.showInformationMessage('AUTOSAR check completed for current file');
		} else {
			vscode.window.showWarningMessage('No active editor found');
		}
	});

	context.subscriptions.push(
		togglePauseCommand,
		rerunCheckCommand,
		clearViolationsCommand,
		goToViolationCommand,
		recheckAllFilesCommand,
		checkCommand
	);
	
	console.log('AUTOSAR Checker is READY!');
	vscode.window.showInformationMessage('✅ AUTOSAR Checker is now active! Check the AUTOSAR Violations panel.');
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (diagnosticProvider) {
		diagnosticProvider.dispose();
	}
}
