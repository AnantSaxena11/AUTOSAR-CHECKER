import * as vscode from 'vscode';

// Custom decorations for AUTOSAR violations (BlackDuck style)
export class AutosarDecorationProvider {
    private errorDecorationType: vscode.TextEditorDecorationType;
    private warningDecorationType: vscode.TextEditorDecorationType;
    private infoDecorationType: vscode.TextEditorDecorationType;

    constructor() {
        // Purple diamond decorations like BlackDuck
        this.errorDecorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '0 0 2px 0',
            borderStyle: 'solid',
            borderColor: new vscode.ThemeColor('editorError.foreground'),
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            gutterIconPath: this.createDiamondIcon('red'),
            gutterIconSize: 'contain',
            overviewRulerColor: new vscode.ThemeColor('editorError.foreground'),
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            after: {
                contentText: ' ◆',
                color: new vscode.ThemeColor('editorError.foreground'),
                fontWeight: 'bold'
            }
        });

        this.warningDecorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '0 0 2px 0',
            borderStyle: 'solid',
            borderColor: '#9370DB', // Purple like BlackDuck
            backgroundColor: 'rgba(147, 112, 219, 0.1)',
            gutterIconPath: this.createDiamondIcon('purple'),
            gutterIconSize: 'contain',
            overviewRulerColor: '#9370DB',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            after: {
                contentText: ' ◆',
                color: '#9370DB',
                fontWeight: 'bold'
            }
        });

        this.infoDecorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '0 0 1px 0',
            borderStyle: 'dotted',
            borderColor: '#87CEEB',
            backgroundColor: 'rgba(135, 206, 235, 0.05)',
            gutterIconPath: this.createDiamondIcon('skyblue'),
            gutterIconSize: 'contain',
            overviewRulerColor: '#87CEEB',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            after: {
                contentText: ' ◇',
                color: '#87CEEB'
            }
        });
    }

    private createDiamondIcon(color: string): vscode.Uri {
        // Create SVG diamond icon
        const svg = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" 
                  fill="${color}" 
                  stroke="${color}" 
                  stroke-width="1"/>
        </svg>`;
        
        const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
        return vscode.Uri.parse(svgDataUri);
    }

    applyDecorations(
        editor: vscode.TextEditor,
        errors: vscode.Range[],
        warnings: vscode.Range[],
        infos: vscode.Range[]
    ): void {
        editor.setDecorations(this.errorDecorationType, errors);
        editor.setDecorations(this.warningDecorationType, warnings);
        editor.setDecorations(this.infoDecorationType, infos);
    }

    clearDecorations(editor: vscode.TextEditor): void {
        editor.setDecorations(this.errorDecorationType, []);
        editor.setDecorations(this.warningDecorationType, []);
        editor.setDecorations(this.infoDecorationType, []);
    }

    dispose(): void {
        this.errorDecorationType.dispose();
        this.warningDecorationType.dispose();
        this.infoDecorationType.dispose();
    }
}
