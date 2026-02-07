import * as vscode from 'vscode';
import { autosarRules } from './autosarRules.comprehensive';
import * as path from 'path';

export interface ViolationDetails {
    ruleCode: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    category: string;
    file: string;
    line: number;
    column: number;
    codeSnippet?: string;
}

export class ViolationDetailsPanel {
    private static currentPanel: ViolationDetailsPanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private disposables: vscode.Disposable[] = [];
    private currentDetails?: ViolationDetails;

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        
        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'copyRuleCode':
                        if (this.currentDetails) {
                            vscode.env.clipboard.writeText(this.currentDetails.ruleCode);
                            vscode.window.showInformationMessage(`Copied: ${this.currentDetails.ruleCode}`);
                        }
                        break;
                    case 'suppressLine':
                        if (this.currentDetails) {
                            this.insertSuppressionComment(this.currentDetails);
                        }
                        break;
                }
            },
            null,
            this.disposables
        );
    }

    public static show(details: ViolationDetails, extensionUri: vscode.Uri) {
        const column = vscode.ViewColumn.Two;

        // If panel already exists, reveal it
        if (ViolationDetailsPanel.currentPanel) {
            ViolationDetailsPanel.currentPanel.panel.reveal(column);
            ViolationDetailsPanel.currentPanel.update(details);
            return;
        }

        // Create new panel
        const panel = vscode.window.createWebviewPanel(
            'autosarViolationDetails',
            'AUTOSAR Violation Details',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        ViolationDetailsPanel.currentPanel = new ViolationDetailsPanel(panel, extensionUri);
        ViolationDetailsPanel.currentPanel.update(details);
    }

    private update(details: ViolationDetails) {
        this.currentDetails = details;
        this.panel.title = `${details.ruleCode} - Violation Details`;
        this.panel.webview.html = this.getHtmlContent(details);
    }

    private async insertSuppressionComment(details: ViolationDetails) {
        try {
            const document = await vscode.workspace.openTextDocument(details.file);
            const editor = await vscode.window.showTextDocument(document, vscode.ViewColumn.One);
            const line = document.lineAt(details.line);
            const indentation = line.text.substring(0, line.firstNonWhitespaceCharacterIndex);
            
            // Use the correct suppression format that matches isRuleSuppressed
            const suppressComment = `${indentation}// suppress-line: ${details.ruleCode}\n`;
            
            await editor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(details.line, 0), suppressComment);
            });
            
            // Save the document to trigger re-analysis
            await document.save();
            
            vscode.window.showInformationMessage(`✅ Suppressed ${details.ruleCode} - Violation will disappear on save`);
            
            // Close the details panel after successful suppression
            this.dispose();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to add suppression comment: ${error}`);
        }
    }

    private getHtmlContent(details: ViolationDetails): string {
        // Find the full rule definition
        const rule = autosarRules.find(r => r.code === details.ruleCode);
        
        // Get severity color and label
        const severityInfo = this.getSeverityInfo(details.severity);
        
        // Extract filename from full path
        const fileName = path.basename(details.file);
        const fileDir = path.dirname(details.file);

        // Get code snippet (if available)
        const codeSnippet = details.codeSnippet || 'Code snippet not available';

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Violation Details</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e1e2e 0%, #252535 100%);
            color: #e0e0e0;
            padding: 0;
            line-height: 1.6;
            overflow-x: hidden;
            min-height: 100vh;
        }

        .container {
            max-width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .header {
            background: linear-gradient(135deg, #6a3de8 0%, #9370DB 100%);
            padding: 24px 32px;
            border-bottom: 3px solid #9370DB;
            box-shadow: 0 4px 12px rgba(147, 112, 219, 0.3);
        }

        .rule-code {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .rule-title {
            font-size: 16px;
            color: #f0e6ff;
            font-weight: 500;
        }

        .content {
            padding: 32px;
        }

        .section {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid rgba(147, 112, 219, 0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .section:hover {
            border-color: rgba(147, 112, 219, 0.4);
            box-shadow: 0 4px 16px rgba(147, 112, 219, 0.1);
            transform: translateY(-2px);
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #9370DB;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-title::before {
            content: '';
            width: 4px;
            height: 18px;
            background: linear-gradient(180deg, #9370DB 0%, #6a3de8 100%);
            border-radius: 2px;
        }

        .severity-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 24px;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .severity-high {
            background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
            color: #ffffff;
            border: 2px solid #ff6b7a;
        }

        .severity-medium {
            background: linear-gradient(135deg, #ffa502 0%, #ffb830 100%);
            color: #1e1e2e;
            border: 2px solid #ffc04d;
        }

        .severity-low {
            background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%);
            color: #1e1e2e;
            border: 2px solid #5ee2ff;
        }

        .severity-icon {
            font-size: 16px;
        }

        .location-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 12px;
        }

        .info-item {
            background: rgba(147, 112, 219, 0.1);
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 3px solid #9370DB;
        }

        .info-label {
            font-size: 11px;
            font-weight: 600;
            color: #9370DB;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 4px;
        }

        .info-value {
            font-size: 14px;
            color: #ffffff;
            font-weight: 500;
            font-family: 'Consolas', 'Monaco', monospace;
        }

        .description {
            font-size: 15px;
            line-height: 1.8;
            color: #d0d0d0;
        }

        .code-snippet {
            background: #1a1a2e;
            border: 1px solid #9370DB;
            border-radius: 8px;
            padding: 16px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #e0e0e0;
            overflow-x: auto;
            white-space: pre;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .category-badge {
            display: inline-block;
            background: linear-gradient(135deg, #6a3de8 0%, #9370DB 100%);
            color: #ffffff;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(147, 112, 219, 0.3);
        }

        .rationale {
            background: rgba(255, 193, 7, 0.1);
            border-left: 4px solid #ffc107;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            line-height: 1.8;
            color: #e0e0e0;
        }

        .remediation {
            background: rgba(76, 175, 80, 0.1);
            border-left: 4px solid #4caf50;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            line-height: 1.8;
            color: #e0e0e0;
        }

        .file-path {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 12px;
            color: #9370DB;
            background: rgba(147, 112, 219, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            display: inline-block;
            margin-top: 8px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-top: 16px;
        }

        .stat-card {
            background: linear-gradient(135deg, rgba(147, 112, 219, 0.2) 0%, rgba(106, 61, 232, 0.1) 100%);
            padding: 16px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid rgba(147, 112, 219, 0.3);
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #9370DB;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 11px;
            color: #a0a0a0;
            text-transform: uppercase;
            letter-spacing: 0.6px;
        }

        .footer {
            padding: 24px 32px;
            background: rgba(147, 112, 219, 0.05);
            border-top: 1px solid rgba(147, 112, 219, 0.2);
            text-align: center;
            font-size: 12px;
            color: #808080;
        }

        .footer-highlight {
            color: #9370DB;
            font-weight: 600;
        }

        hr {
            border: none;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, rgba(147, 112, 219, 0.3) 50%, transparent 100%);
            margin: 24px 0;
        }

        .quick-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
        }

        .action-btn {
            flex: 1;
            padding: 10px 16px;
            background: linear-gradient(135deg, #6a3de8 0%, #9370DB 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(147, 112, 219, 0.4);
        }

        .action-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(147, 112, 219, 0.3);
        }

        @media (max-width: 768px) {
            .content {
                padding: 20px;
            }
            .stats-grid {
                grid-template-columns: 1fr !important;
            }
            .location-info {
                grid-template-columns: 1fr !important;
            }
        }

        @media (max-width: 600px) {
            .quick-actions {
                flex-direction: column;
            }
            .action-btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="rule-code">⚠️ ${details.ruleCode}</div>
            <div class="rule-title">${details.message}</div>
        </div>

        <div class="content">
            <!-- Severity Section -->
            <div class="section">
                <div class="section-title">🎯 Severity Level</div>
                <span class="severity-badge severity-${severityInfo.level}">
                    <span class="severity-icon">${severityInfo.icon}</span>
                    ${severityInfo.label}
                </span>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${details.line + 1}</div>
                        <div class="stat-label">Line Number</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${details.column + 1}</div>
                        <div class="stat-label">Column</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${details.category.split(' ').length > 1 ? details.category.split(' ').slice(0, 2).join(' ') : details.category}</div>
                        <div class="stat-label">Category</div>
                    </div>
                </div>
            </div>

            <!-- Location Section -->
            <div class="section">
                <div class="section-title">📍 Location</div>
                <div class="location-info">
                    <div class="info-item">
                        <div class="info-label">File Name</div>
                        <div class="info-value">${fileName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Directory</div>
                        <div class="info-value">${this.truncatePath(fileDir)}</div>
                    </div>
                </div>
                <div class="file-path">📁 ${details.file}</div>
            </div>

            <!-- Category Section -->
            <div class="section">
                <div class="section-title">🏷️ Category</div>
                <span class="category-badge">${details.category}</span>
            </div>

            <!-- Description Section -->
            ${rule?.description ? `
            <div class="section">
                <div class="section-title">📝 Description</div>
                <div class="description">${rule.description}</div>
            </div>
            ` : ''}

            <!-- Rationale Section -->
            ${rule?.rationale ? `
            <div class="section">
                <div class="section-title">💡 Why This Matters</div>
                <div class="rationale">${rule.rationale}</div>
            </div>
            ` : ''}

            <!-- Code Snippet Section -->
            ${details.codeSnippet ? `
            <div class="section">
                <div class="section-title">💻 Code Snippet</div>
                <pre class="code-snippet">${this.escapeHtml(codeSnippet)}</pre>
            </div>
            ` : ''}

            <!-- Remediation Section -->
            <div class="section">
                <div class="section-title">🔧 Recommended Action</div>
                <div class="remediation">
                    ${this.getRemediation(details.ruleCode)}
                </div>
                <div class="quick-actions">
                    <button class="action-btn" onclick="copyRuleCode()">📋 Copy Rule Code</button>
                    <button class="action-btn" onclick="suppressLine()">🔇 Suppress This Line</button>
                </div>
            </div>
        </div>

        <div class="footer">
            Powered by <span class="footer-highlight">AUTOSAR Checker v0.0.4</span> | 
            Real-time Static Analysis | 
            <span class="footer-highlight">${autosarRules.length} Rules Active</span>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function copyRuleCode() {
            vscode.postMessage({
                command: 'copyRuleCode'
            });
        }

        function suppressLine() {
            vscode.postMessage({
                command: 'suppressLine'
            });
        }
    </script>
</body>
</html>`;
    }

    private getSeverityInfo(severity: 'error' | 'warning' | 'info'): { level: string; label: string; icon: string } {
        switch (severity) {
            case 'error':
                return { level: 'high', label: 'High Risk', icon: '🔴' };
            case 'warning':
                return { level: 'medium', label: 'Medium Risk', icon: '🟠' };
            case 'info':
                return { level: 'low', label: 'Low Risk', icon: '🔵' };
        }
    }

    private getRemediation(ruleCode: string): string {
        const remediations: { [key: string]: string } = {
            'A1-1-1': 'Ensure all code paths contain necessary statements. Add explicit return statements or use [[noreturn]] attribute for functions that never return.',
            'A18-1-1': 'Replace C-style arrays with std::array or std::vector. Use container.data() when interfacing with C APIs.',
            'M0-1-1': 'Remove or comment out unreachable code. Ensure all statements serve a purpose in your program logic.',
            'A7-1-4': 'Use nullptr instead of NULL. Replace all instances of NULL with the nullptr keyword for type-safe null pointer representation.',
            'A15-1-2': 'Add noexcept specification to functions that do not throw exceptions. Review error handling and add noexcept where appropriate.',
            'default': 'Review the AUTOSAR C++14 guidelines documentation for detailed remediation steps. Consider refactoring code to comply with the rule requirements.'
        };

        return remediations[ruleCode] || remediations['default'];
    }

    private escapeHtml(text: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    private truncatePath(path: string, maxLength: number = 50): string {
        if (path.length <= maxLength) {
            return path;
        }
        return '...' + path.substring(path.length - maxLength);
    }

    public dispose() {
        ViolationDetailsPanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
