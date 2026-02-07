import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { autosarRules } from './autosarRules.comprehensive';

export interface ViolationItem {
    file: string;
    line: number;
    column: number;
    ruleCode: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    category: string;
}

export class AutosarTreeDataProvider implements vscode.TreeDataProvider<ViolationTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ViolationTreeItem | undefined | null | void> = new vscode.EventEmitter<ViolationTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ViolationTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private violations: Map<string, ViolationItem[]> = new Map();
    private isPaused: boolean = false;

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ViolationTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ViolationTreeItem): Thenable<ViolationTreeItem[]> {
        if (!element) {
            // Root level - show summary and categories
            return Promise.resolve(this.getRootItems());
        } else if (element.type === 'summary') {
            return Promise.resolve([]);
        } else if (element.type === 'category') {
            return Promise.resolve(this.getViolationsByCategory(element.label as string));
        } else {
            return Promise.resolve([]);
        }
    }

    private getRootItems(): ViolationTreeItem[] {
        const items: ViolationTreeItem[] = [];
        
        // Summary item
        const totalViolations = Array.from(this.violations.values()).reduce((sum, arr) => sum + arr.length, 0);
        const summaryItem = new ViolationTreeItem(
            `Total Violations: ${totalViolations}`,
            vscode.TreeItemCollapsibleState.None,
            'summary'
        );
        summaryItem.iconPath = new vscode.ThemeIcon('info');
        items.push(summaryItem);

        // Group by category
        const categories = new Map<string, number>();
        this.violations.forEach(viols => {
            viols.forEach(v => {
                const count = categories.get(v.category) || 0;
                categories.set(v.category, count + 1);
            });
        });

        // Create category items
        categories.forEach((count, category) => {
            const item = new ViolationTreeItem(
                `${category} (${count})`,
                vscode.TreeItemCollapsibleState.Collapsed,
                'category'
            );
            item.iconPath = new vscode.ThemeIcon('folder');
            items.push(item);
        });

        return items;
    }

    private getViolationsByCategory(category: string): ViolationTreeItem[] {
        const items: ViolationTreeItem[] = [];
        
        this.violations.forEach((viols, file) => {
            viols.forEach(v => {
                if (v.category === category.replace(/\s*\(\d+\)$/, '')) {
                    const item = new ViolationTreeItem(
                        `[${v.ruleCode}] ${v.message.substring(0, 60)}...`,
                        vscode.TreeItemCollapsibleState.None,
                        'violation'
                    );
                    
                    // Set icon based on severity
                    if (v.severity === 'error') {
                        item.iconPath = new vscode.ThemeIcon('error', new vscode.ThemeColor('errorForeground'));
                    } else if (v.severity === 'warning') {
                        item.iconPath = new vscode.ThemeIcon('warning', new vscode.ThemeColor('warningForeground'));
                    } else {
                        item.iconPath = new vscode.ThemeIcon('info', new vscode.ThemeColor('notificationsInfoIcon.foreground'));
                    }
                    
                    item.tooltip = `${v.ruleCode}: ${v.message}\nFile: ${file}\nLine: ${v.line + 1}`;
                    item.description = `Line ${v.line + 1}`;
                    
                    // Make it clickable
                    item.command = {
                        command: 'autosar-checker.goToViolation',
                        title: 'Go to Violation',
                        arguments: [file, v.line, v.column, v.ruleCode, v.message, v.severity, v.category]
                    };
                    
                    items.push(item);
                }
            });
        });
        
        return items;
    }

    updateViolations(file: string, violations: ViolationItem[]): void {
        if (!this.isPaused) {
            if (violations.length === 0) {
                this.violations.delete(file);
            } else {
                this.violations.set(file, violations);
            }
            this.refresh();
        }
    }

    clearViolations(): void {
        this.violations.clear();
        this.refresh();
    }

    togglePause(): boolean {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    isPausedState(): boolean {
        return this.isPaused;
    }

    rerunCheck(): void {
        this.isPaused = false;
        vscode.commands.executeCommand('autosar-checker.recheckAllFiles');
    }

    // Get violation with code snippet for details panel
    public getViolationWithSnippet(violation: ViolationItem): ViolationItem & { codeSnippet?: string } {
        try {
            if (fs.existsSync(violation.file)) {
                const fileContent = fs.readFileSync(violation.file, 'utf-8');
                const lines = fileContent.split('\n');
                
                // Get 3 lines before and after for context
                const startLine = Math.max(0, violation.line - 3);
                const endLine = Math.min(lines.length - 1, violation.line + 3);
                
                let snippet = '';
                for (let i = startLine; i <= endLine; i++) {
                    const lineNum = (i + 1).toString().padStart(4, ' ');
                    const marker = i === violation.line ? '→' : ' ';
                    snippet += `${lineNum} ${marker} ${lines[i]}\n`;
                }
                
                return { ...violation, codeSnippet: snippet };
            }
        } catch (error) {
            console.error('Error reading file for code snippet:', error);
        }
        return violation;
    }
}

export class ViolationTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'summary' | 'category' | 'violation'
    ) {
        super(label, collapsibleState);
    }
}
