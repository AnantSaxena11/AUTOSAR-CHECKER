# What's New in AUTOSAR Checker v0.0.3

## 🎨 Custom UI - BlackDuck Style

Version 0.0.3 brings a completely redesigned user interface with **purple diamond decorations** and a **dedicated violations panel**, moving away from the standard VS Code Problems tab.

---

## ✨ Key Features

### 1. Purple Diamond Decorations
- **BlackDuck-style visual markers** instead of standard squiggly lines
- **Purple color theme** (#9370DB) matching industry tools
- **Diamond symbols** (◆ for warnings, ◇ for info) appear next to violations
- **Overview ruler integration** - see all violations in the scrollbar

### 2. Custom AUTOSAR Violations Panel
- **Dedicated sidebar panel** - Click the shield icon in the Activity Bar
- **Hierarchical violations view**:
  - Summary (total violations)
  - Categories (Resource Management, Type Safety, etc.)
  - Individual violations with file/line/rule info
- **Click any violation** to jump directly to the code location
- **No more Problems tab** - all violations in one clean interface

### 3. Pause/Play Controls
- **Pause button** (⏸) - Temporarily stop checking while editing
- **Resume button** (▶) - Re-enable automatic checking
- **Rerun button** (🔄) - Manually trigger a full workspace scan
- **Clear button** (🗑) - Clear all violations from the panel

---

## 🚀 How to Use

### Viewing Violations

1. **Open the AUTOSAR Violations panel**:
   - Click the **shield icon** (🛡) in the Activity Bar (left sidebar)
   - Or use Command Palette: `View: Show AUTOSAR Checker`

2. **Navigate violations**:
   - Expand categories to see grouped violations
   - Click any violation to jump to that line in the editor
   - Purple diamonds appear in the code showing exact violation locations

### Controlling the Checker

- **Pause/Resume**: Click the pause/play button in the panel toolbar
  - Useful when making large edits without constant checking
  - Violations are hidden while paused
  
- **Rerun Check**: Click the refresh button to scan all open files again
  - Useful after making multiple fixes
  
- **Clear All**: Click the trash icon to remove all violations
  - Fresh start for new analysis

### Purple Diamond Indicators

The decorations use a color-coded system:

- **Red border** (◆) = Error severity
- **Purple border** (◆) = Warning severity  
- **Sky blue border** (◇) = Info severity

All decorations appear:
- **In the editor** as colored borders around violations
- **In the overview ruler** (scrollbar) for quick navigation
- **Next to the line** with diamond symbols

---

## 🔧 Technical Changes from v0.0.2

### What Changed

- **Removed**: Standard VS Code DiagnosticCollection
- **Added**: Custom TextEditorDecorationType for purple diamonds
- **Added**: TreeDataProvider for custom violations panel
- **Added**: Pause state management
- **Added**: Manual recheck commands
- **Updated**: 50+ comprehensive AUTOSAR rules still included

### Migration Notes

- Violations **no longer appear** in the Problems tab
- Use the **AUTOSAR Violations panel** instead (shield icon)
- Quick fixes (suppress-line, suppress-next-line) still work via `Ctrl+.`

---

## 📋 Command Reference

All commands available in Command Palette (`Ctrl+Shift+P`):

| Command | Description | Icon |
|---------|-------------|------|
| `AUTOSAR: Check Current File` | Manually check active file | ▶ |
| `AUTOSAR: Pause/Resume Checker` | Toggle automatic checking | ⏸ |
| `AUTOSAR: Rerun Check` | Scan all open files | 🔄 |
| `AUTOSAR: Clear All Violations` | Remove all violations | 🗑 |

---

## 🎯 Quick Start

1. **Reload VS Code**: Press `Ctrl+Shift+P` → `Developer: Reload Window`
2. **Open the violations panel**: Click the shield icon in the Activity Bar
3. **Open a C/C++ file** (or open `example.cpp` to see sample violations)
4. **Watch purple diamonds appear** in your code
5. **Click violations in the panel** to navigate to each issue
6. **Use pause/play** to control checking as needed

---

## 📚 Resources

- **AUTOSAR Rules Guide**: See `AUTOSAR_RULES_GUIDE.md` for complete rule list
- **Testing**: See `HOW_TO_TEST.md` for testing instructions
- **Example File**: Open `example.cpp` to see violations in action
- **Quick Start**: See `QUICKSTART.md` for basic usage

---

## 🐛 Troubleshooting

**Problem**: Purple diamonds don't appear
- **Solution**: Reload window (`Ctrl+Shift+P` → `Developer: Reload Window`)

**Problem**: Violations panel is empty
- **Solution**: Open a C/C++ file, or click the Rerun button (🔄)

**Problem**: Too many violations showing
- **Solution**: Use `// suppress-line: <RuleCode>` comments to ignore specific ones

**Problem**: Want to disable temporarily
- **Solution**: Click the Pause button (⏸) in the panel toolbar

---

## 💡 Tips

- **Keep violations panel open** while coding for real-time feedback
- **Use categories** to focus on specific types of issues (e.g., Resource Management)
- **Pause during heavy editing** to avoid distraction
- **Rerun after fixes** to see the updated violation count
- **Click overview ruler** (scrollbar markers) for quick navigation

---

## 🎉 Enjoy the New UI!

The custom purple diamond interface provides a **cleaner, more focused** experience for AUTOSAR compliance checking. No more cluttered Problems tab - just your violations, organized and ready to fix!
