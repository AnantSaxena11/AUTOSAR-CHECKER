import * as vscode from 'vscode';
import { autosarRules } from './autosarRules.comprehensive';
import { ViolationDetailsPanel, ViolationDetails } from './violationDetailsPanel';
import { AutosarTreeDataProvider } from './violationTreeView';

export class AutosarHoverProvider implements vscode.HoverProvider {
    private violationsMap: Map<string, Array<{
        line: number;
        column: number;
        ruleCode: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
        category: string;
    }>> = new Map();

    constructor(
        private treeDataProvider: AutosarTreeDataProvider,
        private extensionUri: vscode.Uri
    ) {}

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const violations = this.violationsMap.get(document.uri.fsPath) || [];
        
        // Find violations at this position
        const violationsAtPosition = violations.filter(v => v.line === position.line);
        
        if (violationsAtPosition.length === 0) {
            return undefined;
        }

        // Create hover content with beautiful formatting
        const hoverContents: vscode.MarkdownString[] = [];

        for (const violation of violationsAtPosition) {
            const rule = autosarRules.find(r => r.code === violation.ruleCode);
            
            const markdown = new vscode.MarkdownString();
            markdown.supportHtml = true;
            markdown.isTrusted = true;

            // Header with severity badge
            const severityEmoji = this.getSeverityEmoji(violation.severity);
            const severityColor = this.getSeverityColor(violation.severity);
            const severityLabel = this.getSeverityLabel(violation.severity);

            markdown.appendMarkdown(`### ${severityEmoji} AUTOSAR Violation: \`${violation.ruleCode}\`\n\n`);
            
            markdown.appendMarkdown(`<span style="background: ${severityColor}; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${severityLabel}</span>\n\n`);

            // Message
            markdown.appendMarkdown(`**${violation.message}**\n\n`);

            // Category
            markdown.appendMarkdown(`📁 **Category:** ${violation.category}\n\n`);

            // Separator
            markdown.appendMarkdown(`---\n\n`);

            // Description
            if (rule?.description) {
                markdown.appendMarkdown(`📝 **Description:**\n\n${rule.description}\n\n`);
            }

            // Rationale
            if (rule?.rationale) {
                markdown.appendMarkdown(`💡 **Why This Matters:**\n\n${rule.rationale}\n\n`);
            }

            // Location
            markdown.appendMarkdown(`📍 **Location:** Line ${violation.line + 1}, Column ${violation.column + 1}\n\n`);

            // Quick actions
            markdown.appendMarkdown(`---\n\n`);
            markdown.appendMarkdown(`**Quick Actions:**\n\n`);
            
            // Add clickable command link to open details panel
            const detailsArgs = encodeURIComponent(JSON.stringify([
                document.uri.fsPath,
                violation.line,
                violation.column,
                violation.ruleCode,
                violation.message,
                violation.severity,
                violation.category
            ]));
            markdown.appendMarkdown(`- [🔍 **View Full Details Panel**](command:autosar-checker.goToViolation?${detailsArgs} "Click to open detailed violation information")\n`);
            markdown.appendMarkdown(`- 💡 Press \`Ctrl+.\` for quick fixes\n`);
            markdown.appendMarkdown(`- 🔇 Add \`// suppress-line: ${violation.ruleCode}\` to ignore\n\n`);

            hoverContents.push(markdown);
        }

        return new vscode.Hover(hoverContents);
    }

    public updateViolations(file: string, violations: Array<{
        line: number;
        column: number;
        ruleCode: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
        category: string;
    }>): void {
        if (violations.length === 0) {
            this.violationsMap.delete(file);
        } else {
            this.violationsMap.set(file, violations);
        }
    }

    public clearViolations(file: string): void {
        this.violationsMap.delete(file);
    }

    private getSeverityEmoji(severity: 'error' | 'warning' | 'info'): string {
        switch (severity) {
            case 'error': return '🔴';
            case 'warning': return '🟠';
            case 'info': return '🔵';
        }
    }

    private getSeverityColor(severity: 'error' | 'warning' | 'info'): string {
        switch (severity) {
            case 'error': return '#ff4757';
            case 'warning': return '#ffa502';
            case 'info': return '#48dbfb';
        }
    }

    private getSeverityLabel(severity: 'error' | 'warning' | 'info'): string {
        switch (severity) {
            case 'error': return 'HIGH RISK';
            case 'warning': return 'MEDIUM RISK';
            case 'info': return 'LOW RISK';
        }
    }
}
