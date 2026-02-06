// AUTOSAR Rule Definitions
export interface AutosarRule {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    pattern: RegExp;
    description: string;
}

// Sample AUTOSAR rules - extend this list based on your actual requirements
export const autosarRules: AutosarRule[] = [
    {
        code: 'A1-1-1',
        message: 'All code shall conform to ISO/IEC 14882:2014',
        severity: 'error',
        pattern: /\b(goto)\b/,
        description: 'Usage of goto statement is not allowed'
    },
    {
        code: 'A2-10-1',
        message: 'An identifier declared in an inner scope shall not hide an identifier declared in an outer scope',
        severity: 'warning',
        pattern: /\bint\s+(\w+)\s*=.*\n.*\bint\s+\1\s*=/m,
        description: 'Variable shadowing detected'
    },
    {
        code: 'A2-13-1',
        message: 'Only those escape sequences that are defined in ISO/IEC 14882:2014 shall be used',
        severity: 'warning',
        pattern: /\\(?!['"\\abfnrtv0])/,
        description: 'Invalid escape sequence detected'
    },
    {
        code: 'A3-1-1',
        message: 'It shall be possible to include any header file in multiple translation units without violating ODR',
        severity: 'warning',
        pattern: /^(?!#ifndef|#define|#pragma once).*\bconst\b.*=/m,
        description: 'Missing include guard'
    },
    {
        code: 'A5-0-3',
        message: 'The declaration of objects shall contain no more than two levels of pointer indirection',
        severity: 'warning',
        pattern: /\*\s*\*\s*\*/,
        description: 'More than two levels of pointer indirection'
    },
    {
        code: 'A5-1-1',
        message: 'Literal values shall not be used apart from type initialization',
        severity: 'info',
        pattern: /=\s*\d+\s*[;,\)]/,
        description: 'Magic number detected'
    },
    {
        code: 'A7-1-1',
        message: 'Constexpr or const specifiers shall be used for immutable data declaration',
        severity: 'warning',
        pattern: /\b(int|float|double|char)\s+(\w+)\s*=\s*[^;]+;(?!\s*(const|constexpr))/,
        description: 'Immutable variable should be const or constexpr'
    },
    {
        code: 'A8-4-7',
        message: 'In a function definition, a name of each parameter shall be present',
        severity: 'warning',
        pattern: /\w+\s+\w+\s*\([^)]*\w+\s*\)/,
        description: 'Function parameter missing name'
    },
    {
        code: 'A13-2-1',
        message: 'An assignment operator shall return a reference to "this"',
        severity: 'warning',
        pattern: /operator\s*=\s*\([^)]*\)\s*{[^}]*(?!return\s+\*this)/,
        description: 'Assignment operator does not return *this'
    },
    {
        code: 'A15-1-1',
        message: 'Only instances of types derived from std::exception shall be thrown',
        severity: 'error',
        pattern: /throw\s+(?!std::)/,
        description: 'Throwing non-exception type'
    },
    {
        code: 'A18-1-1',
        message: 'C-style arrays shall not be used',
        severity: 'warning',
        pattern: /\b\w+\s+\w+\s*\[\s*\d*\s*\]/,
        description: 'C-style array detected, use std::array or std::vector'
    },
    {
        code: 'M0-1-1',
        message: 'A project shall not contain unreachable code',
        severity: 'warning',
        pattern: /\breturn\s+[^;]+;\s*\w+/,
        description: 'Unreachable code after return statement'
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
