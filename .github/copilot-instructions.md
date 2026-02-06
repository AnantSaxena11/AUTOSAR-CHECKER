# AUTOSAR Real-Time Checker VS Code Extension

This workspace contains a VS Code extension for real-time AUTOSAR compliance checking.

## Features
- Real-time diagnostics for AUTOSAR violations
- Warning display with checker numbers
- Quick fixes to suppress warnings
- Similar to spell checker functionality

## Development Progress
- [x] Created copilot-instructions.md file
- [x] Scaffold VS Code extension project
- [x] Implement AUTOSAR diagnostics provider
- [x] Add quick fix code actions
- [x] Install dependencies and compile
- [x] Create documentation

## Project Complete!

### How to Test
1. Press **F5** to launch the extension in debug mode
2. Open `example.cpp` in the new window to see AUTOSAR warnings
3. Try the quick fixes by pressing `Ctrl+.` on any warning

### Key Files
- `src/extension.ts` - Extension entry point
- `src/diagnosticProvider.ts` - Real-time AUTOSAR checker
- `src/codeActionProvider.ts` - Quick fix actions
- `src/autosarRules.ts` - AUTOSAR rule definitions
- `example.cpp` - Sample file with violations

### Next Steps
- Customize AUTOSAR rules in `src/autosarRules.ts`
- Test with your own C/C++ files
- Package with `npm run package` for distribution

