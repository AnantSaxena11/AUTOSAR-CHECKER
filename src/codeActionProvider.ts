import * as vscode from 'vscode';

export class AutosarCodeActionProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.CodeAction[] | undefined {
        // Get AUTOSAR diagnostics at the current position
        const autosarDiagnostics = context.diagnostics.filter(
            diag => diag.source === 'AUTOSAR'
        );

        if (autosarDiagnostics.length === 0) {
            return undefined;
        }

        const codeActions: vscode.CodeAction[] = [];

        autosarDiagnostics.forEach(diagnostic => {
            // Create "Suppress on this line" action
            const suppressLineAction = this.createSuppressLineAction(document, diagnostic);
            codeActions.push(suppressLineAction);

            // Create "Suppress on next line" action
            const suppressNextLineAction = this.createSuppressNextLineAction(document, diagnostic);
            codeActions.push(suppressNextLineAction);
        });

        return codeActions;
    }

    private createSuppressLineAction(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction {
        const action = new vscode.CodeAction(
            `Suppress ${diagnostic.code} on this line`,
            vscode.CodeActionKind.QuickFix
        );

        action.diagnostics = [diagnostic];
        action.isPreferred = false;

        const line = diagnostic.range.start.line;
        const lineText = document.lineAt(line).text;
        const indentation = lineText.match(/^\s*/)?.[0] || '';

        const edit = new vscode.WorkspaceEdit();
        const commentText = ` // autosar-disable-line ${diagnostic.code}`;
        
        edit.insert(
            document.uri,
            new vscode.Position(line, lineText.length),
            commentText
        );

        action.edit = edit;
        return action;
    }

    private createSuppressNextLineAction(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic
    ): vscode.CodeAction {
        const action = new vscode.CodeAction(
            `Suppress ${diagnostic.code} on next line`,
            vscode.CodeActionKind.QuickFix
        );

        action.diagnostics = [diagnostic];
        action.isPreferred = true;

        const line = diagnostic.range.start.line;
        const lineText = document.lineAt(line).text;
        const indentation = lineText.match(/^\s*/)?.[0] || '';

        const edit = new vscode.WorkspaceEdit();
        const commentText = `${indentation}// autosar-disable-next-line ${diagnostic.code}\n`;
        
        edit.insert(
            document.uri,
            new vscode.Position(line, 0),
            commentText
        );

        action.edit = edit;
        return action;
    }
}
