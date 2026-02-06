# How to Expand AUTOSAR Rules Coverage

## 📚 Official AUTOSAR Resources

### Primary Sources:
1. **AUTOSAR C++14 Guidelines**
   - Official PDF: https://www.autosar.org/fileadmin/standards/R22-11/FO/AUTOSAR_RS_CPP14Guidelines.pdf
   - Contains complete rule descriptions, examples, and rationale

2. **MathWorks AUTOSAR Compliance Checker**
   - Documentation: https://www.mathworks.com/help/bugfinder/autosar-c-14.html
   - Provides rule interpretations and examples

3. **MISRA C++ Guidelines** (AUTOSAR extends MISRA)
   - Reference for M-prefixed rules

## 🚀 Quick Start - Using the Comprehensive Rules

I've created `autosarRules.comprehensive.ts` with **50+ AUTOSAR rules** covering:
- ✅ Language Independent Issues (M0, A0)
- ✅ General Rules (A1, M1)
- ✅ Lexical Conventions (A2, M2)
- ✅ Basic Concepts (A3, M3)
- ✅ Expressions (A5, M5)
- ✅ Statements (A6, M6)
- ✅ Declarations (A7, M7)
- ✅ Classes (A9-A12)
- ✅ Exception Handling (A15, M15)
- ✅ Templates (A14, M14)
- ✅ Library Rules (A17-A26)

### To Use All Comprehensive Rules:

**Replace the import in `diagnosticProvider.ts`:**

```typescript
// Change from:
import { autosarRules, isRuleSuppressed } from './autosarRules';

// To:
import { autosarRules, isRuleSuppressed } from './autosarRules.comprehensive';
```

Then recompile and reinstall:
```bash
npm run compile
vsce package
code --install-extension autosar-checker-0.0.2.vsix
```

## 📝 Adding New Rules - Step by Step

### 1. Find the Rule Information

Visit: https://www.mathworks.com/help/bugfinder/autosar-c-14.html

Example for rule **A7-1-5**:
```
Rule: A7-1-5
Title: "The auto specifier shall not be used apart from following cases: 
        (1) to declare that a variable has the same type as return type of a function call,
        (2) to declare that a variable has the same type as initializer of non-fundamental type,
        (3) to declare parameters of a generic lambda expression,
        (4) to declare a function template using trailing return type syntax."
Category: Declarations
Severity: Warning
```

### 2. Create a Regex Pattern

For A7-1-5 (auto misuse):
```typescript
{
    code: 'A7-1-5',
    message: 'The auto specifier shall not be used apart from AUTOSAR-defined cases',
    severity: 'warning',
    pattern: /\bauto\s+\w+\s*=\s*(?:\d+|"[^"]*"|'.')/,  // Auto with literal value
    description: 'auto should only be used for function return types or complex initializers',
    category: 'Declarations',
    rationale: 'Improper use of auto reduces code clarity and type safety'
}
```

### 3. Test Your Pattern

Create a test file to verify:
```cpp
// Should trigger A7-1-5:
auto x = 42;        // ❌ auto with literal
auto name = "test"; // ❌ auto with string literal

// Should NOT trigger:
auto result = calculateValue();  // ✅ function return
auto vec = std::vector<int>{};   // ✅ complex type
```

### 4. Add to autosarRules.ts

```typescript
export const autosarRules: AutosarRule[] = [
    // ... existing rules ...
    
    {
        code: 'A7-1-5',
        message: 'The auto specifier shall not be used apart from AUTOSAR-defined cases',
        severity: 'warning',
        pattern: /\bauto\s+\w+\s*=\s*(?:\d+|"[^"]*"|'.')/,
        description: 'auto should only be used for function return types or complex initializers',
        category: 'Declarations',
        rationale: 'Improper use of auto reduces code clarity and type safety'
    },
    
    // Add more rules here...
];
```

## 🎯 Pattern Writing Tips

### Common Patterns:

**Detect Function Calls:**
```typescript
pattern: /\bfunctionName\s*\(/
```

**Detect Type Declarations:**
```typescript
pattern: /\b(?:int|float|double|char)\s+\w+/
```

**Detect Keywords:**
```typescript
pattern: /\b(?:goto|throw|delete|new)\b/
```

**Detect Preprocessor:**
```typescript
pattern: /#define\s+\w+/
```

**Multi-line Patterns:**
```typescript
pattern: /class\s+\w+[^{]*{[^}]*private:/m  // Use 'm' flag for multiline
```

## 📊 Rule Categories from AUTOSAR

1. **Language Independent Issues** (M0, A0)
2. **General** (M1, A1)
3. **Lexical Conventions** (M2, A2)
4. **Basic Concepts** (M3, A3)
5. **Standard Conversions** (M4, A4)
6. **Expressions** (M5, A5)
7. **Statements** (M6, A6)
8. **Declarations** (M7, A7)
9. **Declarators** (M8, A8)
10. **Classes** (M9-M12, A9-A12)
11. **Overloading** (M13, A13)
12. **Templates** (M14, A14)
13. **Exception Handling** (M15, A15)
14. **Preprocessing** (M16, A16)
15. **Library** (M17-M27, A17-A27)

## 🔍 Testing New Rules

1. **Create test cases:**
   ```cpp
   // test-A7-1-5.cpp
   auto x = 42;              // Should trigger
   auto y = getValue();      // Should NOT trigger
   ```

2. **Run the test script:**
   ```bash
   node test-checker.js
   ```

3. **Verify in VS Code:**
   - Open the test file
   - Check if warnings appear correctly

## 📦 Updating the Extension

After adding rules:

1. **Bump version** in `package.json`:
   ```json
   "version": "0.0.2"
   ```

2. **Recompile:**
   ```bash
   npm run compile
   ```

3. **Package:**
   ```bash
   vsce package
   ```

4. **Install:**
   ```bash
   code --install-extension autosar-checker-0.0.2.vsix
   ```

5. **Share with team:**
   - Send the new `.vsix` file
   - They install it the same way

## 🎓 Advanced: Getting Rule Details from MathWorks

Visit each rule page for complete information:
- https://www.mathworks.com/help/bugfinder/ref/autosarcplusplus14-a1-1-1.html
- https://www.mathworks.com/help/bugfinder/ref/autosarcplusplus14-a7-1-5.html
- (Replace the rule code in the URL)

Each page contains:
- ✅ Detailed description
- ✅ Code examples (both compliant and non-compliant)
- ✅ Rationale
- ✅ Exception cases

## 💡 Pro Tips

1. **Start with high-priority rules** (errors and warnings)
2. **Test patterns thoroughly** before deployment
3. **Document custom rules** with examples
4. **Version control** your rules file
5. **Get team feedback** on false positives

## 🔗 Quick Reference Links

- AUTOSAR Organization: https://www.autosar.org/
- MathWorks AUTOSAR Docs: https://www.mathworks.com/help/bugfinder/autosar-c-14.html
- MISRA C++ Guidelines: https://www.misra.org.uk/
- ISO C++14 Standard: https://isocpp.org/std/the-standard

---

**Need help?** Check the comprehensive rules file I created, it has 50+ examples to learn from!
