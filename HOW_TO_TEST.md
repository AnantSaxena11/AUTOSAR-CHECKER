# HOW TO TEST THE EXTENSION

## IMPORTANT: The extension is NOT active in this window!

You are currently in the **development workspace**. To see the AUTOSAR warnings work, you must:

## Step 1: Launch the Extension
Press **F5** (or go to Run > Start Debugging)

This will:
- Compile the extension
- Open a NEW VS Code window called "[Extension Development Host]"
- Activate your AUTOSAR Checker extension in that window

## Step 2: Open a C++ File
In the NEW window that opens:
- Open the example.cpp file from this project
- OR create a new .cpp file with some code

## Step 3: See the Warnings!
You should immediately see:
- ⚠️ Yellow squiggly lines under violations
- 🔴 Red squiggly lines under errors
- Warnings listed in the Problems panel (Ctrl+Shift+M)

## Step 4: Try Quick Fixes
- Click on any warning
- Press Ctrl+. (period)
- Select "Suppress on next line" or "Suppress on this line"

---

## Why Can't I See Errors in THIS Window?

This is the **extension development** workspace - it's where you EDIT the extension code.
The extension only runs in the **Extension Development Host** window (launched with F5).

## Quick Test Checklist

✅ Fixed the typo (analyzeDoucment → analyzeDocument)
✅ Compiled successfully
⚠️ **NOW YOU NEED TO**: Press F5 and open example.cpp in the new window

## Troubleshooting

**Problem**: Extension Development Host window doesn't open
- **Solution**: Make sure no other debug session is running, then press F5

**Problem**: Still no warnings in the Extension Development Host
- **Solution**: Check that you opened a .cpp, .c, or .h file
- **Solution**: Open the Output panel, select "AUTOSAR Checker" to see console logs

**Problem**: "Command 'npm' not found" when pressing F5
- **Solution**: Make sure Node.js and npm are installed

---

## Ready to Test?

1. Press **F5** in THIS window
2. Wait for new window to open
3. In new window: Open example.cpp
4. See the magic! ✨
