// Comprehensive AUTOSAR C++ Rule Database
// Based on AUTOSAR C++14 Guidelines
// Reference: https://www.autosar.org/fileadmin/standards/adaptive/21-11/AUTOSAR_RS_CPP14Guidelines.pdf

export interface AutosarRule {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    pattern: RegExp;
    description: string;
    category: string;
    rationale?: string;
}

// AUTOSAR C++ Rules organized by category
export const autosarRules: AutosarRule[] = [
    
    // ===================================================================
    // LANGUAGE INDEPENDENT ISSUES (A0, M0)
    // ===================================================================
    {
        code: 'M0-1-1',
        message: 'A project shall not contain unreachable code',
        severity: 'warning',
        pattern: /\breturn\s+[^;]+;\s*\w+/,
        description: 'Code after return statement is unreachable and will never execute',
        category: 'Language Independent Issues',
        rationale: 'Unreachable code may indicate a programming error or incomplete refactoring'
    },
    {
        code: 'M0-1-3',
        message: 'A project shall not contain unused variables',
        severity: 'info',
        pattern: /\b(?:int|float|double|char|bool)\s+(\w+)\s*;(?!\s*\1)/,
        description: 'Variable declared but never used in the code',
        category: 'Language Independent Issues',
        rationale: 'Unused variables waste memory and may indicate incomplete implementation'
    },

    // ===================================================================
    // GENERAL (A1, M1)
    // ===================================================================
    {
        code: 'A1-1-1',
        message: 'All code shall conform to ISO/IEC 14882:2014 - goto statements are not allowed',
        severity: 'error',
        pattern: /\b(goto)\b/,
        description: 'The goto statement shall not be used as it makes code difficult to understand and maintain',
        category: 'General',
        rationale: 'goto statements lead to spaghetti code and make control flow analysis difficult'
    },
    {
        code: 'A1-1-2',
        message: 'A project shall not contain instances of non-standard characters',
        severity: 'warning',
        pattern: /[^\x00-\x7F]/,
        description: 'Only standard ASCII characters should be used in source code',
        category: 'General',
        rationale: 'Non-standard characters may cause portability issues'
    },

    // ===================================================================
    // LEXICAL CONVENTIONS (A2, M2)
    // ===================================================================
    {
        code: 'A2-10-1',
        message: 'An identifier declared in an inner scope shall not hide an identifier declared in an outer scope',
        severity: 'warning',
        pattern: /\bint\s+(\w+)\s*=.*\n.*\bint\s+\1\s*=/m,
        description: 'Variable shadowing detected - inner scope variable hides outer scope variable',
        category: 'Lexical Conventions',
        rationale: 'Name hiding can lead to confusion and programming errors'
    },
    {
        code: 'A2-13-1',
        message: 'Only those escape sequences that are defined in ISO/IEC 14882:2014 shall be used',
        severity: 'warning',
        pattern: /\\(?!['"\\abfnrtv0])/,
        description: 'Invalid escape sequence detected - use only standard escape sequences',
        category: 'Lexical Conventions',
        rationale: 'Non-standard escape sequences lead to undefined behavior'
    },
    {
        code: 'A2-7-1',
        message: 'An expression with enum underlying type shall only have values corresponding to the enumerators',
        severity: 'warning',
        pattern: /enum\s+\w+\s*{[^}]+}\s*;\s*\w+\s*=\s*\d+/,
        description: 'Enum should only be assigned its defined values',
        category: 'Lexical Conventions',
        rationale: 'Using values outside enum range defeats type safety'
    },

    // ===================================================================
    // BASIC CONCEPTS (A3, M3)
    // ===================================================================
    {
        code: 'A3-1-1',
        message: 'It shall be possible to include any header file in multiple translation units without violating the One Definition Rule',
        severity: 'warning',
        pattern: /^(?!#ifndef|#define|#pragma once).*\bconst\b.*=/m,
        description: 'Header files should have include guards to prevent multiple inclusion',
        category: 'Basic Concepts',
        rationale: 'Missing include guards can lead to ODR violations and compilation errors'
    },
    {
        code: 'A3-3-1',
        message: 'Objects or functions with external linkage shall be declared in a header file',
        severity: 'info',
        pattern: /^(?!static)\s*\w+\s+\w+\s*\([^)]*\)\s*{/m,
        description: 'External functions should be declared in header files',
        category: 'Basic Concepts',
        rationale: 'Proper declarations improve modularity and reusability'
    },

    // ===================================================================
    // STANDARD CONVERSIONS (A4, M4)
    // ===================================================================
    {
        code: 'A4-7-1',
        message: 'An integer expression shall not lead to data loss',
        severity: 'warning',
        pattern: /\bint\s+\w+\s*=\s*\d{10,}/,
        description: 'Integer literal may be too large for int type',
        category: 'Standard Conversions',
        rationale: 'Data loss in conversions leads to incorrect calculations'
    },

    // ===================================================================
    // EXPRESSIONS (A5, M5)
    // ===================================================================
    {
        code: 'A5-0-3',
        message: 'The declaration of objects shall contain no more than two levels of pointer indirection',
        severity: 'warning',
        pattern: /\*\s*\*\s*\*/,
        description: 'More than two levels of pointer indirection detected',
        category: 'Expressions',
        rationale: 'Excessive pointer indirection reduces code readability and increases error potential'
    },
    {
        code: 'A5-1-1',
        message: 'Literal values shall not be used apart from type initialization, otherwise symbolic names shall be used',
        severity: 'info',
        pattern: /=\s*\d+\s*[;,\)]/,
        description: 'Magic number detected - consider using named constants',
        category: 'Expressions',
        rationale: 'Magic numbers reduce code readability and maintainability'
    },
    {
        code: 'A5-2-1',
        message: 'dynamic_cast should not be used',
        severity: 'warning',
        pattern: /\bdynamic_cast\s*</,
        description: 'Use of dynamic_cast detected - consider design alternatives',
        category: 'Expressions',
        rationale: 'dynamic_cast has runtime overhead and may indicate design issues'
    },
    {
        code: 'A5-2-3',
        message: 'A cast shall not remove any const or volatile qualification from the type of a pointer or reference',
        severity: 'error',
        pattern: /const_cast\s*</,
        description: 'const_cast detected - removing const qualification is dangerous',
        category: 'Expressions',
        rationale: 'Removing const can lead to undefined behavior'
    },

    // ===================================================================
    // STATEMENTS (A6, M6)
    // ===================================================================
    {
        code: 'A6-5-1',
        message: 'A for loop shall contain a single loop-counter which shall not have floating-point type',
        severity: 'warning',
        pattern: /for\s*\(\s*(?:float|double)\s+/,
        description: 'For loop with floating-point counter detected',
        category: 'Statements',
        rationale: 'Floating-point counters can lead to unexpected behavior due to precision issues'
    },
    {
        code: 'A6-5-2',
        message: 'A for loop shall be well-formed',
        severity: 'warning',
        pattern: /for\s*\(\s*;\s*;\s*\)/,
        description: 'Empty for loop detected - use while instead',
        category: 'Statements',
        rationale: 'Well-formed loops improve code clarity'
    },

    // ===================================================================
    // DECLARATIONS (A7, M7)
    // ===================================================================
    {
        code: 'A7-1-1',
        message: 'Constexpr or const specifiers shall be used for immutable data declaration',
        severity: 'warning',
        pattern: /\b(?:int|float|double|char)\s+(\w+)\s*=\s*[^;]+;(?!\s*(?:const|constexpr))/,
        description: 'Immutable variable should be declared const or constexpr',
        category: 'Declarations',
        rationale: 'const/constexpr declarations enable compiler optimizations and prevent accidental modifications'
    },
    {
        code: 'A7-1-4',
        message: 'There shall be no unused named parameters in non-virtual functions',
        severity: 'info',
        pattern: /\w+\s+\w+\s*\([^)]*\w+\s+(\w+)[^)]*\)\s*{/,
        description: 'Function parameter is declared but not used',
        category: 'Declarations',
        rationale: 'Unused parameters may indicate incomplete implementation'
    },

    // ===================================================================
    // DECLARATORS (A8, M8)
    // ===================================================================
    {
        code: 'A8-4-7',
        message: '"in" parameters for "cheap to copy" types shall be passed by value',
        severity: 'warning',
        pattern: /void\s+\w+\s*\(\s*const\s+(?:int|char|bool|short|float)\s*&/,
        description: 'Small types should be passed by value, not const reference',
        category: 'Declarators',
        rationale: 'Passing small types by reference adds unnecessary indirection'
    },
    {
        code: 'A8-4-8',
        message: 'Output parameters shall not be used',
        severity: 'warning',
        pattern: /void\s+\w+\s*\([^)]*\w+\s*&\s*\w+[^)]*\)/,
        description: 'Consider returning values instead of using output parameters',
        category: 'Declarators',
        rationale: 'Return values are clearer and safer than output parameters'
    },

    // ===================================================================
    // CLASSES (A9-A12, M9-M12)
    // ===================================================================
    {
        code: 'A10-3-1',
        message: 'Virtual function declaration shall contain exactly one of override, final or pure-specifier',
        severity: 'warning',
        pattern: /virtual\s+\w+\s+\w+\s*\([^)]*\)\s*(?!(?:override|final|=\s*0))/,
        description: 'Virtual function should be marked with override, final, or pure-specifier',
        category: 'Classes',
        rationale: 'Explicit specifiers prevent accidental signature mismatches'
    },
    {
        code: 'A11-0-1',
        message: 'A non-POD type should be defined as class',
        severity: 'info',
        pattern: /struct\s+\w+\s*{[^}]*(?:virtual|private|protected)/,
        description: 'Non-POD types should use class instead of struct',
        category: 'Classes',
        rationale: 'Using class for non-POD types makes intent clearer'
    },
    {
        code: 'A12-8-6',
        message: 'Copy and move constructors and assignment operators shall be declared protected or private',
        severity: 'warning',
        pattern: /class\s+\w+[^{]*{[^}]*public:[^}]*\w+\s*\(\s*const\s+\w+\s*&\s*\)/,
        description: 'Copy/move operations should not be public in polymorphic classes',
        category: 'Classes',
        rationale: 'Public copy/move in base classes can lead to slicing'
    },

    // ===================================================================
    // OVERLOADING (A13, M13)
    // ===================================================================
    {
        code: 'A13-2-1',
        message: 'An assignment operator shall return a reference to "this"',
        severity: 'warning',
        pattern: /operator\s*=\s*\([^)]*\)\s*{[^}]*(?!return\s+\*this)/,
        description: 'Assignment operator must return *this',
        category: 'Overloading',
        rationale: 'Enables chaining and follows standard conventions'
    },
    {
        code: 'A13-5-2',
        message: 'All user-defined conversion operators shall be defined explicit',
        severity: 'warning',
        pattern: /operator\s+\w+\s*\(\s*\)\s*(?!explicit)/,
        description: 'Conversion operators should be explicit',
        category: 'Overloading',
        rationale: 'Prevents unintended implicit conversions'
    },

    // ===================================================================
    // TEMPLATES (A14, M14)
    // ===================================================================
    {
        code: 'A14-5-1',
        message: 'A template constructor shall not participate in overload resolution for a copy constructor',
        severity: 'warning',
        pattern: /template\s*<[^>]*>\s*\w+\s*\(\s*const\s+\w+\s*&/,
        description: 'Template constructor may interfere with copy constructor',
        category: 'Templates',
        rationale: 'Prevents unexpected behavior in copy operations'
    },

    // ===================================================================
    // EXCEPTION HANDLING (A15, M15)
    // ===================================================================
    {
        code: 'A15-1-1',
        message: 'Only instances of types derived from std::exception shall be thrown',
        severity: 'error',
        pattern: /throw\s+(?!std::)/,
        description: 'Only std::exception derived types should be thrown',
        category: 'Exception Handling',
        rationale: 'Standard exception hierarchy enables proper exception handling'
    },
    {
        code: 'A15-3-3',
        message: 'Main function and a task main function shall catch at least std::exception',
        severity: 'warning',
        pattern: /int\s+main\s*\([^)]*\)\s*{(?!.*catch)/,
        description: 'Main function should have exception handling',
        category: 'Exception Handling',
        rationale: 'Prevents unhandled exceptions from terminating the program'
    },
    {
        code: 'A15-5-1',
        message: 'All thrown exceptions should be unique',
        severity: 'info',
        pattern: /throw\s+\w+Exception\s*\(\s*"[^"]*"\s*\)/,
        description: 'Consider using unique exception types for different errors',
        category: 'Exception Handling',
        rationale: 'Unique exceptions enable precise error handling'
    },

    // ===================================================================
    // PREPROCESSING DIRECTIVES (A16, M16)
    // ===================================================================
    {
        code: 'A16-0-1',
        message: '#include directives should only be preceded by other preprocessor directives or comments',
        severity: 'info',
        pattern: /\w+.*\n#include/,
        description: 'Include directives should be at the beginning of the file',
        category: 'Preprocessing',
        rationale: 'Consistent include placement improves readability'
    },
    {
        code: 'A16-2-1',
        message: 'The pre-processor shall only be used for file inclusion and include guards',
        severity: 'warning',
        pattern: /#define\s+\w+\s+\d+/,
        description: 'Avoid using #define for constants - use const or constexpr instead',
        category: 'Preprocessing',
        rationale: 'const/constexpr are type-safe and debugger-friendly'
    },

    // ===================================================================
    // LIBRARY INTRODUCTION (A17, M17)
    // ===================================================================
    {
        code: 'A17-0-1',
        message: 'Reserved identifiers, macros and functions shall not be defined, redefined or undefined',
        severity: 'error',
        pattern: /#(?:define|undef)\s+(?:_|std::)/,
        description: 'Do not define/undefine reserved identifiers',
        category: 'Library',
        rationale: 'Redefining reserved identifiers causes undefined behavior'
    },

    // ===================================================================
    // LANGUAGE SUPPORT LIBRARY (A18, M18)
    // ===================================================================
    {
        code: 'A18-1-1',
        message: 'C-style arrays shall not be used, use std::array or std::vector instead',
        severity: 'warning',
        pattern: /\b\w+\s+\w+\s*\[\s*\d*\s*\]/,
        description: 'Use std::array or std::vector instead of C-style arrays',
        category: 'Language Support Library',
        rationale: 'C-style arrays do not provide size information and are error-prone'
    },
    {
        code: 'A18-1-2',
        message: 'The std::vector<bool> specialization shall not be used',
        severity: 'warning',
        pattern: /std::vector\s*<\s*bool\s*>/,
        description: 'std::vector<bool> has non-standard behavior',
        category: 'Language Support Library',
        rationale: 'vector<bool> is not a container and does not meet container requirements'
    },
    {
        code: 'A18-5-2',
        message: 'Operators new and delete shall not be called explicitly',
        severity: 'warning',
        pattern: /\b(?:new|delete)\b/,
        description: 'Use smart pointers instead of explicit new/delete',
        category: 'Language Support Library',
        rationale: 'Smart pointers prevent memory leaks and manage resources automatically'
    },

    // ===================================================================
    // DIAGNOSTICS LIBRARY (A19)
    // ===================================================================
    {
        code: 'A19-3-1',
        message: 'Error handling should be used instead of C-style error handling',
        severity: 'warning',
        pattern: /\berrno\b/,
        description: 'Use exceptions instead of errno for error handling',
        category: 'Diagnostics',
        rationale: 'Exceptions provide better error propagation and handling'
    },

    // ===================================================================
    // GENERAL UTILITIES (A20)
    // ===================================================================
    {
        code: 'A20-8-1',
        message: 'An already-owned pointer value shall not be assigned to an unique pointer',
        severity: 'error',
        pattern: /unique_ptr.*=.*new/,
        description: 'Do not assign raw pointer to unique_ptr after construction',
        category: 'General Utilities',
        rationale: 'Can lead to double-delete and undefined behavior'
    },

    // ===================================================================
    // STRINGS LIBRARY (A21)
    // ===================================================================
    {
        code: 'A21-8-1',
        message: 'Arguments to character-handling functions shall be representable as an unsigned char',
        severity: 'warning',
        pattern: /(?:isalpha|isdigit|isspace)\s*\(\s*[^)]*/,
        description: 'Character handling functions require unsigned char',
        category: 'Strings Library',
        rationale: 'Prevents undefined behavior with negative char values'
    },

    // ===================================================================
    // CONTAINERS LIBRARY (A23)
    // ===================================================================
    {
        code: 'A23-0-1',
        message: 'An element of a container shall only be accessed by iterators if the container owns the element',
        severity: 'warning',
        pattern: /\.erase\s*\([^)]*\).*\*/,
        description: 'Do not dereference iterator after erase',
        category: 'Containers',
        rationale: 'Erased iterators are invalidated and cause undefined behavior'
    },

    // ===================================================================
    // ALGORITHMS LIBRARY (A25)
    // ===================================================================
    {
        code: 'A25-1-1',
        message: 'Non-static data members or captured values of predicate function objects shall not be modified',
        severity: 'warning',
        pattern: /\[\s*&\s*\][^{]*{[^}]*\w+\s*=/,
        description: 'Lambda predicates should not modify captured variables',
        category: 'Algorithms',
        rationale: 'Modifying predicates can lead to unexpected algorithm behavior'
    },

    // ===================================================================
    // NUMERICS LIBRARY (A26)
    // ===================================================================
    {
        code: 'A26-5-1',
        message: 'Pseudorandom numbers shall not be generated using std::rand()',
        severity: 'warning',
        pattern: /\bstd::rand\s*\(\s*\)/,
        description: 'Use <random> library instead of rand()',
        category: 'Numerics',
        rationale: 'std::rand has poor randomness quality and is not thread-safe'
    }
];

// Function to check if a rule is suppressed in the file
export function isRuleSuppressed(document: string, lineNumber: number, ruleCode: string): boolean {
    const lines = document.split('\n');
    
    // Check the line above for suppression comment
    if (lineNumber > 0) {
        const previousLine = lines[lineNumber - 1];
        if (previousLine.includes(`// autosar-disable-next-line ${ruleCode}`) ||
            previousLine.includes(`/* autosar-disable-next-line ${ruleCode} */`)) {
            return true;
        }
    }
    
    // Check the same line for suppression comment
    const currentLine = lines[lineNumber];
    if (currentLine.includes(`// autosar-disable-line ${ruleCode}`) ||
        currentLine.includes(`/* autosar-disable-line ${ruleCode} */`)) {
        return true;
    }
    
    return false;
}

// Helper function to get rules by category
export function getRulesByCategory(category: string): AutosarRule[] {
    return autosarRules.filter(rule => rule.category === category);
}

// Helper function to get all categories
export function getCategories(): string[] {
    return [...new Set(autosarRules.map(rule => rule.category))];
}
