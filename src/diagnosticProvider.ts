import * as vscode from 'vscode';
import { autosarRules, isRuleSuppressed } from './autosarRules.comprehensive';

export class AutosarDiagnosticProvider {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private disposables: vscode.Disposable[] = [];

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('autosar');
    }

    public activate(context: vscode.ExtensionContext) {
        // Register event handlers
        this.disposables.push(
            vscode.workspace.onDidOpenTextDocument(doc => this.analyzeDocument(doc)),
            vscode.workspace.onDidChangeTextDocument(e => this.analyzeDocument(e.document)),
            vscode.workspace.onDidCloseTextDocument(doc => this.diagnosticCollection.delete(doc.uri))
        );

        // Analyze all currently open documents
        vscode.workspace.textDocuments.forEach(doc => this.analyzeDocument(doc));

        context.subscriptions.push(this.diagnosticCollection, ...this.disposables);
    }

    private analyzeDocument(document: vscode.TextDocument) {
        console.log('=== Analyzing document:', document.fileName);
        console.log('Language ID:', document.languageId);
        
        // Only analyze C/C++ files
        if (!this.isCppFile(document)) {
            console.log('SKIPPED - Not a C/C++ file');
            return;
        }

        console.log('Processing C/C++ file...');
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        // Check each rule against the document
        autosarRules.forEach(rule => {
            const matches = text.matchAll(new RegExp(rule.pattern.source, 'gm'));
            
            let matchCount = 0;
            for (const match of matches) {
                matchCount++;
                if (match.index === undefined) {
                    continue;
                }

                const startPosition = document.positionAt(match.index);
                const endPosition = document.positionAt(match.index + match[0].length);
                const lineNumber = startPosition.line;

                // Check if rule is suppressed
                if (isRuleSuppressed(text, lineNumber, rule.code)) {
                    console.log(`Rule ${rule.code} suppressed at line ${lineNumber + 1}`);
                    continue;
                }

                const range = new vscode.Range(startPosition, endPosition);

                const diagnostic = new vscode.Diagnostic(
                    range,
                    `[${rule.code}] ${rule.message}`,
                    this.getSeverity(rule.severity)
                );

                diagnostic.code = rule.code;
                diagnostic.source = 'AUTOSAR';
                diagnostics.push(diagnostic);
            }
            
            if (matchCount > 0) {
                console.log(`Rule ${rule.code}: Found ${matchCount} matches`);
            }
        });

        console.log(`Total diagnostics created: ${diagnostics.length}`);
        this.diagnosticCollection.set(document.uri, diagnostics);
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

    private getSeverity(severity: 'error' | 'warning' | 'info'): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'error':
                return vscode.DiagnosticSeverity.Error;
            case 'warning':
                return vscode.DiagnosticSeverity.Warning;
            case 'info':
                return vscode.DiagnosticSeverity.Information;
        }
    }

    public dispose() {
        this.diagnosticCollection.dispose();
        this.disposables.forEach(d => d.dispose());
    }
}
