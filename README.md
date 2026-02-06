# AUTOSAR Checker

Real-time AUTOSAR compliance checker for C/C++ code in Visual Studio Code. This extension helps you maintain AUTOSAR coding standards by flagging violations as you write code, similar to a spell checker.

## Features

- **Real-time Diagnostics**: Get instant feedback on AUTOSAR violations as you type
- **Checker Numbers**: Each warning displays the specific AUTOSAR rule code (e.g., A1-1-1, M0-1-1)
- **Quick Fixes**: Suppress warnings with one click using code actions
- **C/C++ Support**: Works with `.c`, `.cpp`, `.h`, `.hpp` files
- **Non-intrusive**: Similar to spell checking - fix now or suppress later

## Supported AUTOSAR Rules

The extension currently checks for the following AUTOSAR rules:

- **A1-1-1**: No goto statements
- **A2-10-1**: No variable shadowing
- **A2-13-1**: Only valid escape sequences
- **A3-1-1**: Include guards required
- **A5-0-3**: Maximum two levels of pointer indirection
- **A5-1-1**: No magic numbers
- **A7-1-1**: Use const/constexpr for immutable data
- **A8-4-7**: Function parameters must be named
- **A13-2-1**: Assignment operator must return *this
- **A15-1-1**: Only throw std::exception types
- **A18-1-1**: No C-style arrays
- **M0-1-1**: No unreachable code

## Usage

### Real-time Checking

1. Open any C/C++ file
2. The extension automatically analyzes your code
3. Violations appear as warnings/errors with squiggly underlines
4. Hover over warnings to see the AUTOSAR rule code and description

### Suppressing Warnings

When you see a warning, click the lightbulb icon or press `Ctrl+.` (Windows/Linux) or `Cmd+.` (Mac) to see quick fixes:

1. **Suppress on this line**: Adds `// autosar-disable-line <rule-code>` at the end of the line
2. **Suppress on next line**: Adds `// autosar-disable-next-line <rule-code>` above the line

Example:
```cpp
// autosar-disable-next-line A1-1-1
goto error_handler;  // This warning is suppressed

int value = 42; // autosar-disable-line A5-1-1 - Magic number suppressed
```

### Manual Check

Run the command **AUTOSAR: Check Current File** from the Command Palette (`Ctrl+Shift+P`).

## Installation

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` to open a new VS Code window with the extension loaded

### Package as VSIX

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the `.vsix` file in VS Code.

## Configuration

Currently, all AUTOSAR rules are enabled by default. Future versions will support:
- Rule-level configuration
- Custom severity levels
- Project-specific rule sets

## Extension Development

### Prerequisites

- Node.js (v16 or higher)
- Visual Studio Code
- npm

### Setup

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch
```

### Testing

```bash
# Run tests
npm test

# Compile tests
npm run compile-tests
```

### Debugging

1. Open this project in VS Code
2. Press `F5` to start debugging
3. A new VS Code window will open with the extension loaded
4. Open a C/C++ file to test the extension

## Project Structure

```
.
├── src/
│   ├── extension.ts           # Extension entry point
│   ├── diagnosticProvider.ts  # Real-time AUTOSAR checking
│   ├── codeActionProvider.ts  # Quick fix actions
│   └── autosarRules.ts        # AUTOSAR rule definitions
├── dist/                      # Compiled output
├── package.json               # Extension manifest
└── tsconfig.json             # TypeScript configuration
```

## How It Works

1. **Diagnostic Provider**: Monitors document changes and analyzes code against AUTOSAR rules using regex patterns
2. **Code Action Provider**: Offers quick fixes to suppress warnings when requested
3. **Rule Definitions**: Each AUTOSAR rule has a pattern, severity, and message
4. **Suppression**: Comments with specific format are recognized to ignore violations

## Extending the Extension

### Adding New AUTOSAR Rules

Edit [src/autosarRules.ts](src/autosarRules.ts) and add new rules to the `autosarRules` array:

```typescript
{
    code: 'A1-2-3',
    message: 'Your rule description',
    severity: 'warning',  // 'error', 'warning', or 'info'
    pattern: /your-regex-pattern/,
    description: 'Detailed explanation'
}
```

### Customizing Severity

Change the `severity` field in the rule definition to `'error'`, `'warning'`, or `'info'`.

## Limitations

- Pattern-based detection (not full AST analysis)
- Limited to regex-matchable violations
- May have false positives for complex code patterns
- Does not perform deep semantic analysis

## Future Enhancements

- [ ] Integration with external AUTOSAR checkers
- [ ] AST-based analysis for better accuracy
- [ ] Configurable rule sets per project
- [ ] Custom rule definitions
- [ ] Batch checking for entire projects
- [ ] Export violation reports

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Note**: This extension provides basic AUTOSAR compliance checking. For comprehensive analysis, consider using dedicated static analysis tools like Axivion, LDRA, or Parasoft C/C++test in conjunction with this extension.
