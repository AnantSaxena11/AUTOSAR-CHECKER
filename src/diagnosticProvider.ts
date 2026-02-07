import * as vscode from 'vscode';
import { autosarRules, isRuleSuppressed } from './autosarRules.comprehensive';
import { AutosarDecorationProvider } from './decorationProvider';
import { AutosarTreeDataProvider, ViolationItem } from './violationTreeView';
import { AutosarHoverProvider } from './hoverProvider';

export class AutosarDiagnosticProvider {
    private disposables: vscode.Disposable[] = [];
    private decorationProvider: AutosarDecorationProvider;
    private treeDataProvider: AutosarTreeDataProvider;
    private hoverProvider: AutosarHoverProvider;

    constructor(treeDataProvider: AutosarTreeDataProvider, hoverProvider: AutosarHoverProvider) {
        this.decorationProvider = new AutosarDecorationProvider();
        this.treeDataProvider = treeDataProvider;
        this.hoverProvider = hoverProvider;
    }

    public activate(context: vscode.ExtensionContext) {
        // Register event handlers
        this.disposables.push(
            vscode.workspace.onDidOpenTextDocument(doc => this.analyzeDocument(doc)),
            vscode.workspace.onDidChangeTextDocument(e => this.analyzeDocument(e.document)),
            vscode.workspace.onDidCloseTextDocument(doc => this.clearDocument(doc)),
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (editor) {
                    this.analyzeDocument(editor.document);
                }
            })
        );

        // Analyze all currently open documents
        vscode.workspace.textDocuments.forEach(doc => this.analyzeDocument(doc));

        context.subscriptions.push(...this.disposables, this.decorationProvider);
    }

    private clearDocument(document: vscode.TextDocument) {
        const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
        if (editor) {
            this.decorationProvider.clearDecorations(editor);
        }
        this.treeDataProvider.updateViolations(document.uri.fsPath, []);
        this.hoverProvider.clearViolations(document.uri.fsPath);
    }

    private analyzeDocument(document: vscode.TextDocument) {
        console.log('=== Analyzing document:', document.fileName);
        console.log('Language ID:', document.languageId);
        
        // Only analyze C/C++ files
        if (!this.isCppFile(document)) {
            console.log('SKIPPED - Not a C/C++ file');
            return;
        }

        // Skip if paused
        if (this.treeDataProvider.isPausedState()) {
            console.log('SKIPPED - Checker is paused');
            return;
        }

        console.log('Processing C/C++ file...');
        const violations: ViolationItem[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        const errorRanges: vscode.Range[] = [];
        const warningRanges: vscode.Range[] = [];
        const infoRanges: vscode.Range[] = [];

        // Build comment map for the entire document
        const commentRanges = this.getCommentRanges(text);

        // Check each rule against the document
        autosarRules.forEach(rule => {
            const matches = text.matchAll(new RegExp(rule.pattern.source, 'gm'));
            
            for (const match of matches) {
                if (match.index === undefined) {
                    continue;
                }

                const startPosition = document.positionAt(match.index);
                const endPosition = document.positionAt(match.index + match[0].length);
                const lineNumber = startPosition.line;

                // Skip if match is inside a comment
                if (this.isPositionInComment(match.index, commentRanges)) {
                    console.log(`Skipping violation in comment at line ${lineNumber + 1}`);
                    continue;
                }

                // Check if rule is suppressed
                if (isRuleSuppressed(text, lineNumber, rule.code)) {
                    console.log(`Rule ${rule.code} suppressed at line ${lineNumber + 1}`);
                    continue;
                }

                const range = new vscode.Range(startPosition, endPosition);

                // Add to appropriate decoration array
                if (rule.severity === 'error') {
                    errorRanges.push(range);
                } else if (rule.severity === 'warning') {
                    warningRanges.push(range);
                } else {
                    infoRanges.push(range);
                }

                // Add to violations list for tree view
                violations.push({
                    file: document.uri.fsPath,
                    line: lineNumber,
                    column: startPosition.character,
                    ruleCode: rule.code,
                    message: rule.message,
                    severity: rule.severity,
                    category: rule.category
                });
            }
        });

        console.log(`Found ${violations.length} violations`);

        // Update tree view
        this.treeDataProvider.updateViolations(document.uri.fsPath, violations);

        // Update hover provider
        this.hoverProvider.updateViolations(document.uri.fsPath, violations);

        // Apply decorations to visible editor
        const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
        if (editor) {
            this.decorationProvider.applyDecorations(editor, errorRanges, warningRanges, infoRanges);
        }
    }

    private getCommentRanges(text: string): Array<{start: number, end: number}> {
        const ranges: Array<{start: number, end: number}> = [];
        
        // Find single-line comments (//)
        const singleLineRegex = /\/\/.*$/gm;
        let match;
        while ((match = singleLineRegex.exec(text)) !== null) {
            ranges.push({
                start: match.index,
                end: match.index + match[0].length
            });
        }
        
        // Find multi-line comments (/* ... */)
        const multiLineRegex = /\/\*[\s\S]*?\*\//g;
        while ((match = multiLineRegex.exec(text)) !== null) {
            ranges.push({
                start: match.index,
                end: match.index + match[0].length
            });
        }
        
        return ranges;
    }

    private isPositionInComment(position: number, commentRanges: Array<{start: number, end: number}>): boolean {
        return commentRanges.some(range => position >= range.start && position < range.end);
    }

    private isCommentLine(line: string): boolean {
        const trimmed = line.trim();
        // Check for C++ style comments (//) or C style comments (/* */)
        return trimmed.startsWith('//') || 
               trimmed.startsWith('/*') || 
               trimmed.startsWith('*') ||
               trimmed.endsWith('*/');
    }

    public recheckAllFiles(): void {
        vscode.workspace.textDocuments.forEach(doc => {
            if (this.isCppFile(doc)) {
                this.analyzeDocument(doc);
            }
        });
    }

    private isCppFile(document: vscode.TextDocument): boolean {
        return document.languageId === 'cpp' || 
               document.languageId === 'c' ||
               document.fileName.endsWith('.cpp') ||
               document.fileName.endsWith('.cc') ||
               document.fileName.endsWith('.cxx') ||
               document.fileName.endsWith('.c') ||
               document.fileName.endsWith('.h') ||
               document.fileName.endsWith('.hpp');
    }

    public dispose() {
        this.decorationProvider.dispose();
        this.disposables.forEach(d => d.dispose());
    }
}
