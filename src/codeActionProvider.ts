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

        // Check if suppression comment already exists on this line
        const ruleCode = diagnostic.code?.toString() || '';
        if (lineText.includes(`autosar-disable-line ${ruleCode}`) ||
            lineText.includes(`NOLINT(${ruleCode})`)) {
            // Comment already exists, don't add again
            action.disabled = { reason: 'Suppression comment already exists on this line' };
            return action;
        }

        const edit = new vscode.WorkspaceEdit();
        const commentText = ` // autosar-disable-line ${ruleCode}`;
        
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

        // Check if suppression comment already exists on previous line
        const ruleCode = diagnostic.code?.toString() || '';
        if (line > 0) {
            const previousLineText = document.lineAt(line - 1).text;
            if (previousLineText.includes(`autosar-disable-next-line ${ruleCode}`) ||
                previousLineText.includes(`NOLINTNEXTLINE(${ruleCode})`)) {
                // Comment already exists, don't add again
                action.disabled = { reason: 'Suppression comment already exists on previous line' };
                return action;
            }
        }

        const edit = new vscode.WorkspaceEdit();
        const commentText = `${indentation}// autosar-disable-next-line ${ruleCode}\n`;
        
        edit.insert(
            document.uri,
            new vscode.Position(line, 0),
            commentText
        );

        action.edit = edit;
        return action;
    }
}
