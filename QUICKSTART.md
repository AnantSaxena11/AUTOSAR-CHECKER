# Quick Start Guide - AUTOSAR Checker Extension

## Testing the Extension

1. **Launch the Extension**
   - Press `F5` in VS Code (or select "Run > Start Debugging")
   - This opens a new "Extension Development Host" window

2. **Open the Example File**
   - In the new window, open `example.cpp` from this project
   - You should immediately see AUTOSAR warnings with squiggly underlines

3. **View Warnings**
   - Hover over any underlined code to see the warning message and AUTOSAR rule code
   - Check the Problems panel (`View > Problems` or `Ctrl+Shift+M`) to see all warnings

4. **Try Quick Fixes**
   - Click on a warning to position your cursor there
   - Press `Ctrl+.` to see available quick fixes
   - Select "Suppress on next line" or "Suppress on this line"
   - The suppression comment will be added automatically

## What You'll See

The `example.cpp` file contains intentional AUTOSAR violations:

- **Goto statements** (A1-1-1) - shown as errors
- **C-style arrays** (A18-1-1) - shown as warnings  
- **Magic numbers** (A5-1-1) - shown as info
- **Non-exception throws** (A15-1-1) - shown as errors
- **Unreachable code** (M0-1-1) - shown as warnings

## How to Use in Your Projects

1. Open any C/C++ file in your workspace
2. The extension activates automatically
3. Warnings appear in real-time as you type
4. Use `Ctrl+.` on any warning to suppress it

## Adding More AUTOSAR Rules

Edit `src/autosarRules.ts` and add entries to the `autosarRules` array:

```typescript
{
    code: 'YOUR-RULE-CODE',
    message: 'Your warning message',
    severity: 'warning',  // or 'error' or 'info'
    pattern: /your-regex-pattern/,
    description: 'Detailed explanation'
}
```

After editing, run `npm run compile` and restart debugging (`F5`).

## Troubleshooting

**Extension not activating?**
- Make sure you're opening a `.c`, `.cpp`, `.h`, or `.hpp` file
- Check the Output panel (`View > Output`) and select "AUTOSAR Checker"

**No warnings showing?**
- Verify the file contains code that violates AUTOSAR rules
- Open the example.cpp file to confirm the extension is working

**Quick fixes not appearing?**
- Make sure your cursor is on a line with an AUTOSAR warning
- Press `Ctrl+.` or click the lightbulb icon

## Next Steps

- Customize the rules in `src/autosarRules.ts`
- Add project-specific AUTOSAR rules
- Adjust severity levels
- Package the extension with `vsce package`
- Share with your team!
