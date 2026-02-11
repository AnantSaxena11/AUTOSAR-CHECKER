# 🚀 AUTOSAR C++14 Extension - Installation & Testing Guide

## ✅ Prerequisites Check

Before installing, ensure you have:
- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **VS Code** (latest version) - [Download](https://code.visualstudio.com/)
- ✅ **Git** (for cloning/version control)

---

## 📦 Installation Methods

### Method 1: Development Mode (Recommended for Testing)

This method runs the extension in a debug window - perfect for testing!

#### Step 1: Install Dependencies
```powershell
# Navigate to the extension directory
cd "d:\AUTOSAR Compiler"

# Install all dependencies
npm install
```

#### Step 2: Compile TypeScript
```powershell
# Compile the extension
npm run compile

# OR watch for changes (auto-recompile)
npm run watch
```

#### Step 3: Launch Extension in Debug Mode
1. Open the project in VS Code: `code "d:\AUTOSAR Compiler"`
2. Press **F5** (or Run → Start Debugging)
3. A new VS Code window opens with the extension loaded
4. In the new window, open `example.cpp`
5. You should see **warnings/errors** with squiggly underlines!

---

### Method 2: Install as VS Code Extension (Production)

This installs the extension permanently in your VS Code.

#### Step 1: Package the Extension
```powershell
# Install VSCE (VS Code Extension packager) globally
npm install -g @vscode/vsce

# Navigate to extension directory
cd "d:\AUTOSAR Compiler"

# Package the extension
vsce package
```

This creates a `.vsix` file (e.g., `autosar-checker-0.0.1.vsix`)

#### Step 2: Install the Extension
```powershell
# Method A: Via Command Line
code --install-extension autosar-checker-0.0.1.vsix

# Method B: Via VS Code UI
# 1. Open VS Code
# 2. Press Ctrl+Shift+P
# 3. Type "Extensions: Install from VSIX"
# 4. Select the .vsix file
```

#### Step 3: Reload VS Code
- Press **Ctrl+Shift+P** → Type "Reload Window" → Enter
- The extension is now active for all C/C++ files!

---

## 🧪 Testing the Extension

### Quick Test (5 minutes)

1. **Open the test file:**
   ```
   File → Open File → d:\AUTOSAR Compiler\example.cpp
   ```

2. **You should immediately see:**
   - 🔴 Red/orange squiggly underlines on violations
   - 📊 Problems panel shows all violations
   - 🌲 "AUTOSAR Violations" tree view in sidebar

3. **Hover over a warning:**
   - See the rule code (e.g., "A5-0-3")
   - Read the description
   - Understand why it's a violation

4. **Try suppressing a warning:**
   - Click on a warning
   - Press **Ctrl+.** (or click the lightbulb 💡)
   - Select "Suppress A5-0-3 on next line"
   - Comment is added and warning disappears!

5. **Check the suppression:**
   - Try adding the same suppression again
   - You should see "Suppression comment already exists"
   - ✅ Bug fixed - no duplicate comments!

### Comprehensive Test

Open `example.cpp` and verify these violations are detected:

#### Category 0: Language Independent
- [ ] **A0-1-2**: `getValue()` - Unused return value
- [ ] **M0-1-1**: Unreachable code after `return`
- [ ] **M0-1-2**: Constant condition `if (true)`
- [ ] **M0-1-3**: Unused variable

#### Category 1: General
- [ ] **A1-1-1**: `register` keyword (deprecated)

#### Category 2: Lexical
- [ ] **A2-10-1**: Variable shadowing
- [ ] **A2-11-1**: `volatile` keyword
- [ ] **A2-13-3**: `wchar_t` usage
- [ ] **A2-13-4**: String literal to non-const pointer
- [ ] **A2-13-5**: Lowercase hex `0xabcd`
- [ ] **M2-13-2**: Octal constant `0755`
- [ ] **M2-13-4**: Lowercase suffix `100l`, `3.14f`

#### Category 3: Basic Concepts
- [ ] **A3-9-1**: `short`, `long` instead of fixed-width types
- [ ] **M3-1-2**: Function declared at block scope

#### Category 4: Conversions
- [ ] **A4-10-1**: `NULL` and `0` instead of `nullptr`

#### Category 5: Expressions
- [ ] **A5-0-3**: Triple pointer `int***`
- [ ] **A5-1-1**: Magic numbers `5000`, `3`
- [ ] **A5-2-1**: `dynamic_cast` usage
- [ ] **A5-2-2**: C-style cast `(int)d`
- [ ] **A5-2-3**: `const_cast` removing const
- [ ] **A5-2-4**: `reinterpret_cast` usage

#### Category 6: Statements
- [ ] **A6-5-2**: For loop with `float` counter
- [ ] **A6-5-3**: `do-while` statement
- [ ] **A6-6-1**: `goto` statement
- [ ] **M6-4-2**: Missing final `else` clause

#### Category 7: Declarations
- [ ] **A7-1-4**: `register` keyword
- [ ] **A7-1-6**: `typedef` instead of `using`
- [ ] **A7-2-3**: Unscoped enum

#### Category 10: Classes
- [ ] **A10-3-1**: Missing `override` specifier

#### Category 15: Exceptions
- [ ] **A15-1-1**: Throwing int instead of exception

#### Category 18: Library
- [ ] **A18-1-1**: C-style array `int arr[10]`
- [ ] **A18-5-2**: Explicit `new`/`delete`

---

## 🎯 Expected Results

### Problems Panel Should Show:
```
AUTOSAR (50+ warnings)
├── A0-1-2: Unused return value (line XX)
├── A0-4-2: long double not allowed (line XX)
├── A5-0-3: Too many pointer levels (line XX)
├── A6-6-1: goto not allowed (line XX)
├── A15-1-1: Invalid exception type (line XX)
└── ... (many more)
```

### Tree View Should Show:
```
AUTOSAR VIOLATIONS
├── 0. Language Independent Issues (8)
├── 1. General (1)
├── 2. Lexical Conventions (12)
├── 3. Basic Concepts (3)
├── 4. Standard Conversions (2)
├── 5. Expressions (8)
├── 6. Statements (5)
├── 7. Declarations (4)
├── 10. Derived Classes (1)
├── 15. Exception Handling (1)
└── 18. Language Support Library (2)
```

---

## 🐛 Troubleshooting

### Issue: No warnings appear
**Solutions:**
1. Check file extension is `.cpp`, `.c`, `.h`, or `.hpp`
2. Reload window: `Ctrl+Shift+P` → "Reload Window"
3. Check Output panel: "View → Output" → Select "AUTOSAR"
4. Recompile: `npm run compile`

### Issue: Extension not found in debug mode
**Solutions:**
1. Ensure dependencies installed: `npm install`
2. Compile TypeScript: `npm run compile`
3. Check for errors in Terminal
4. Try "Run → Restart Debugging"

### Issue: Suppression comments don't work
**Solutions:**
1. ✅ **FIXED** - Update applied, reload window
2. Ensure exact format: `// autosar-disable-next-line A5-0-3`
3. Check rule code matches exactly
4. Reload window after adding suppression

### Issue: Multiple suppression comments added
**Solutions:**
1. ✅ **FIXED** - Update applied
2. If still occurs, delete duplicate comments
3. Reload window: `Ctrl+Shift+P` → "Reload Window"

### Issue: Extension crashes or freezes
**Solutions:**
1. Check for very large files (>10000 lines)
2. Temporarily disable on large files
3. Check Developer Tools: `Help → Toggle Developer Tools`
4. Report error in console

---

## 🔧 Configuration

### Customize Rule Severity

Edit `src/autosarRules.comprehensive.ts`:

```typescript
{
    code: 'A5-0-3',
    message: 'No more than 2 levels of pointer indirection',
    severity: 'warning',  // Change to 'error' or 'info'
    pattern: /\*\s*\*\s*\*/,
    description: '...',
    category: '5. Expressions'
}
```

After changes:
1. Save file
2. Run `npm run compile`
3. Press `F5` to test
4. Or reinstall extension if already packaged

### Add Custom Rules

See `IMPLEMENTATION_SUMMARY.md` for detailed guide.

Quick example:
```typescript
{
    code: 'CUSTOM-1',
    message: 'Custom rule violated',
    severity: 'warning',
    pattern: /your-regex-pattern/,
    description: 'Your custom rule description',
    category: 'Custom Rules'
}
```

---

## 📊 Performance Tips

### For Large Projects:
1. Disable on very large files (>5000 lines)
2. Use specific file patterns in settings
3. Consider running as build step instead of real-time

### Optimize Checking:
```json
{
    "files.associations": {
        "*.cpp": "cpp",
        "*.h": "cpp"
    },
    "autosar.enableRealTimeChecking": true,
    "autosar.maxFileSize": 10000
}
```

---

## 📚 Next Steps

1. ✅ **Install and test** - Follow Method 1 above
2. ✅ **Review example.cpp** - See all violation types
3. ✅ **Test suppressions** - Verify bug fix works
4. 📖 **Read documentation:**
   - `AUTOSAR_RULES_COMPLETE_REFERENCE.md` - All 400+ rules
   - `IMPLEMENTATION_SUMMARY.md` - Technical details
   - `QUICK_REFERENCE.md` - Quick overview
5. 🎨 **Customize** - Add your own rules or adjust severity
6. 🚀 **Deploy** - Package and install in your team's VS Code

---

## 🎉 Success Checklist

After installation, you should be able to:
- [x] See AUTOSAR violations in C++ files
- [x] Hover over warnings to see rule details
- [x] Use Ctrl+. to suppress warnings
- [x] No duplicate suppression comments
- [x] Suppressions actually hide warnings
- [x] View violations in Problems panel
- [x] See violations grouped in tree view
- [x] Test with example.cpp successfully

---

## 📞 Support

### Resources:
- **All Rules**: `AUTOSAR_RULES_COMPLETE_REFERENCE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **Quick Ref**: `QUICK_REFERENCE.md`

### Common Issues:
- Suppression not working → ✅ Fixed in latest code
- Duplicate comments → ✅ Fixed in latest code
- No warnings shown → Check file extension and reload
- Extension not loading → Run `npm install` and `npm run compile`

---

**Ready to enforce AUTOSAR compliance! 🎊**

*Last Updated: February 8, 2026*
