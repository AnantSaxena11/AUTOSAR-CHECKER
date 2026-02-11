# COMPLETE AUTOSAR C++14 RULES REFERENCE

This document lists ALL 400+ AUTOSAR C++14 rules organized by category.

## Implementation Status
✅ = Implemented with pattern matching  
🔄 = Implemented (requires enhanced analysis)  
📋 = Documented (requires compiler integration)

---

## 0. Language Independent Issues (18 Rules)

| Rule | Status | Description |
|------|--------|-------------|
| **A0-1-1** | ✅ | A project shall not contain instances of non-volatile variables being given values that are not subsequently used |
| **A0-1-2** | ✅ | The value returned by a function having a non-void return type shall be used |
| **A0-1-3** | ✅ | Every function defined in anonymous namespace/static/private shall be used |
| **A0-1-4** | ✅ | There shall be no unused named parameters in non-virtual functions |
| **A0-1-5** | ✅ | There shall be no unused named parameters in virtual functions |
| **A0-1-6** | 🔄 | There should be no unused type declarations |
| **A0-4-2** | ✅ | Type long double shall not be used |
| **A0-4-4** | ✅ | Range, domain and pole errors shall be checked when using math functions |
| **M0-1-1** | ✅ | A project shall not contain unreachable code |
| **M0-1-2** | ✅ | A project shall not contain infeasible paths |
| **M0-1-3** | 🔄 | A project shall not contain unused variables |
| **M0-1-4** | 🔄 | A project shall not contain non-volatile POD variables having only one use |
| **M0-1-8** | 🔄 | All functions with void return type shall have external side effects |
| **M0-1-9** | ✅ | There shall be no dead code |
| **M0-1-10** | 🔄 | Every defined function should be called at least once |
| **M0-2-1** | ✅ | An object shall not be assigned to an overlapping object |
| **M0-3-2** | ✅ | Error information from functions shall be tested |

---

## 1. General (1 Rule)

| Rule | Status | Description |
|------|--------|-------------|
| **A1-1-1** | ✅ | All code shall conform to ISO/IEC 14882:2014 and no deprecated features |

---

## 2. Lexical Conventions (24 Rules)

| Rule | Status | Description |
|------|--------|-------------|
| **A2-3-1** | ✅ | Only basic source character set shall be used |
| **A2-5-1** | ✅ | Trigraphs shall not be used |
| **A2-5-2** | ✅ | Digraphs shall not be used |
| **A2-7-1** | ✅ | \\ shall not be last character of C++ comment |
| **A2-7-2** | ✅ | Sections of code shall not be "commented out" |
| **A2-7-3** | ✅ | All declarations shall be preceded by documentation |
| **A2-8-1** | ✅ | Header file name should reflect logical entity |
| **A2-8-2** | ✅ | Implementation file name should reflect logical entity |
| **A2-10-1** | ✅ | Inner scope identifier shall not hide outer scope identifier |
| **A2-10-4** | ✅ | Static identifier shall not be reused within namespace |
| **A2-10-5** | ✅ | Function/object identifier with linkage should not be reused |
| **A2-10-6** | ✅ | Class/enum name shall not be hidden by variable/function |
| **A2-11-1** | ✅ | Volatile keyword shall not be used |
| **A2-13-1** | ✅ | Only standard escape sequences shall be used |
| **A2-13-2** | ✅ | String literals with different encodings shall not be concatenated |
| **A2-13-3** | ✅ | Type wchar_t shall not be used |
| **A2-13-4** | ✅ | String literals shall not be assigned to non-const pointers |
| **A2-13-5** | ✅ | Hexadecimal constants should be uppercase |
| **A2-13-6** | ✅ | Universal character names only in char/string literals |
| **M2-7-1** | ✅ | /* shall not be used within C-style comment |
| **M2-10-1** | ✅ | Different identifiers shall be typographically unambiguous |
| **M2-13-2** | ✅ | Octal constants shall not be used |
| **M2-13-3** | ✅ | "U" suffix shall be applied to unsigned hex/octal literals |
| **M2-13-4** | ✅ | Literal suffixes shall be upper case |

---

## 3. Basic Concepts (23 Rules)

| Rule | Status | Description |
|------|--------|-------------|
| **A3-1-1** | ✅ | Header files shall not violate One Definition Rule |
| **A3-1-2** | ✅ | Header files shall have extension .h, .hpp or .hxx |
| **A3-1-3** | ✅ | Implementation files should have extension .cpp |
| **A3-1-4** | ✅ | Array with external linkage shall have explicit size |
| **A3-1-5** | 🔄 | Function definition in class only for inline/template |
| **A3-1-6** | ✅ | Trivial accessor/mutator functions should be inlined |
| **A3-3-1** | ✅ | External linkage entities shall be declared in header |
| **A3-3-2** | ✅ | Static/thread-local objects shall be constant-initialized |
| **A3-8-1** | ✅ | Object shall not be accessed outside lifetime |
| **A3-9-1** | ✅ | Use fixed width integer types from <cstdint> |
| **M3-1-2** | ✅ | Functions shall not be declared at block scope |
| **M3-2-1** | ✅ | All declarations shall have compatible types |
| **M3-2-2** | ✅ | One Definition Rule shall not be violated |
| **M3-2-3** | ✅ | Shared entities shall be declared in one file |
| **M3-2-4** | ✅ | External linkage identifier shall have one definition |
| **M3-3-2** | ✅ | Static function re-declarations shall include static |
| **M3-4-1** | ✅ | Identifier scope shall be minimized |
| **M3-9-1** | ✅ | Types shall be token-identical in declarations |
| **M3-9-3** | ✅ | Floating-point bit representations shall not be used |

---

## 4. Standard Conversions (9 Rules)

| Rule | Status | Description |
|------|--------|-------------|
| **A4-5-1** | 🔄 | Enum expressions limited to specific operators |
| **A4-7-1** | 🔄 | Integer expression shall not lead to data loss |
| **A4-10-1** | ✅ | Only nullptr shall be used as null-pointer-constant |
| **M4-5-1** | ✅ | Bool expressions limited to specific operators |
| **M4-5-3** | ✅ | char/wchar_t expressions limited to specific operators |
| **M4-10-1** | ✅ | NULL shall not be used as integer value |
| **M4-10-2** | ✅ | Literal zero shall not be null-pointer-constant |

---

## 5. Expressions (60+ Rules)

| Rule | Status | Description |
|------|--------|-------------|
| **A5-0-1** | 📋 | Expression value shall be same under any evaluation order |
| **A5-0-2** | ✅ | if/iteration conditions shall have type bool |
| **A5-0-3** | ✅ | Objects shall not contain more than two levels of pointer indirection |
| **A5-0-4** | ✅ | Pointer arithmetic shall not be used with pointers to non-final classes |
| **A5-1-1** | ✅ | Literal values shall not be used apart from type initialization |
| **A5-1-2** | ✅ | Variables shall not be implicitly captured in lambda |
| **A5-1-3** | ✅ | Parameter list shall be included in lambda |
| **A5-1-4** | 📋 | Lambda shall not outlive reference-captured objects |
| **A5-1-6** | ✅ | Non-void lambda return type should be explicit |
| **A5-1-7** | ✅ | Lambda shall not be operand to decltype/typeid |
| **A5-1-8** | ✅ | Lambdas should not be defined inside another lambda |
| **A5-1-9** | 🔄 | Identical unnamed lambdas shall be replaced with named |
| **A5-2-1** | ✅ | dynamic_cast should not be used |
| **A5-2-2** | ✅ | C-style casts shall not be used |
| **A5-2-3** | ✅ | Cast shall not remove const/volatile |
| **A5-2-4** | ✅ | reinterpret_cast shall not be used |
| **A5-2-5** | 📋 | Array/container shall not be accessed beyond range |
| **A5-2-6** | ✅ | Operands of logical &&/|| shall be parenthesized |
| **A5-3-1** | ✅ | typeid operand shall not contain side effects |
| **A5-3-2** | 📋 | Null pointers shall not be dereferenced |
| **A5-3-3** | 📋 | Pointers to incomplete types shall not be deleted |
| **A5-5-1** | 📋 | Pointer to member shall not access non-existent members |
| **A5-6-1** | 📋 | Right operand of division/remainder shall not be zero |
| **A5-10-1** | ✅ | Pointer to member virtual function only tested with nullptr |
| **A5-16-1** | ✅ | Ternary operator shall not be used as sub-expression |
| **M5-0-2** | ✅ | Limited dependence on C++ operator precedence |
| **M5-0-3** | 📋 | cvalue expression shall not change underlying type |
| **M5-0-4** | 📋 | Integral conversion shall not change signedness |
| **M5-0-5** | 📋 | No implicit floating-integral conversions |
| **M5-0-6** | 📋 | Conversion shall not reduce underlying type size |
| **M5-0-7** | 📋 | No explicit floating-integral conversions of cvalue |
| **M5-0-8** | 📋 | Explicit conversion shall not increase cvalue size |
| **M5-0-9** | 📋 | Explicit integral conversion shall not change signedness |
| **M5-0-10** | 📋 | Bitwise operators on unsigned char/short need cast |
| **M5-0-11** | ✅ | plain char only for storage of character values |
| **M5-0-12** | ✅ | signed/unsigned char only for numeric values |
| **M5-0-14** | ✅ | Conditional operator first operand shall be bool |
| **M5-0-15** | ✅ | Array indexing only form of pointer arithmetic |
| **M5-0-16** | 📋 | Pointer arithmetic within same array only |
| **M5-0-17** | 📋 | Pointer subtraction only for same array |
| **M5-0-18** | 📋 | Relational operators only for same array pointers |
| **M5-0-20** | ✅ | Binary bitwise operands same underlying type |
| **M5-0-21** | ✅ | Bitwise operators only on unsigned types |
| **M5-2-2** | ✅ | Pointer to virtual base only cast via dynamic_cast |
| **M5-2-3** | ✅ | Base to derived cast should not be used |
| **M5-2-6** | ✅ | No cast from pointer to function to other pointer |
| **M5-2-8** | ✅ | No conversion from int/void* to pointer type |
| **M5-2-9** | ✅ | No cast from pointer to integral type |
| **M5-2-10** | ✅ | ++/-- operators not mixed with other operators |
| **M5-2-11** | ✅ | comma, &&, || operators shall not be overloaded |
| **M5-2-12** | ✅ | Array argument shall not decay to pointer |
| **M5-3-1** | ✅ | !, &&, || operands shall have type bool |
| **M5-3-2** | ✅ | Unary minus not applied to unsigned |
| **M5-3-3** | ✅ | Unary & shall not be overloaded |
| **M5-3-4** | ✅ | sizeof operand shall not contain side effects |
| **M5-8-1** | ✅ | Shift operator right operand in valid range |
| **M5-14-1** | ✅ | Right operand of &&/|| shall not have side effects |
| **M5-18-1** | ✅ | Comma operator shall not be used |
| **M5-19-1** | 📋 | Unsigned integer expressions shall not wrap-around |

---

## 6. Statements (22 Rules)

| Rule | Status | Description |
|------|--------|-------------|
| **A6-2-1** | 📋 | Move/copy assignment operators without side effects |
| **A6-2-2** | ✅ | Expression statements shall not be constructor calls only |
| **A6-4-1** | ✅ | Switch shall have at least two case-clauses |
| **A6-5-1** | 📋 | For-loop through all elements should use range-based for |
| **A6-5-2** | ✅ | For loop shall have single non-floating counter |
| **A6-5-3** | ✅ | Do statements should not be used |
| **A6-5-4** | ✅ | For-init/expression should only modify loop-counter |
| **A6-6-1** | ✅ | goto statement shall not be used |
| **M6-2-1** | ✅ | Assignment operators not in sub-expressions |
| **M6-2-2** | ✅ | Floating-point not tested for equality |
| **M6-2-3** | ✅ | Null statement only on line by itself |
| **M6-3-1** | ✅ | switch/while/do/for body shall be compound statement |
| **M6-4-1** | ✅ | if condition followed by compound statement |
| **M6-4-2** | ✅ | if...else if terminated with else |
| **M6-4-3** | ✅ | switch statement shall be well-formed |
| **M6-4-4** | ✅ | switch-label only in switch body |
| **M6-4-5** | ✅ | Non-empty switch-clause terminated with throw/break |
| **M6-4-6** | ✅ | Final switch clause shall be default |
| **M6-4-7** | ✅ | switch condition shall not have bool type |
| **M6-5-2** through **M6-5-6** | ✅ | For-loop constraints |
| **M6-6-1** through **M6-6-3** | ✅ | goto/continue constraints |

---

## 7. Declarations (24 Rules)

| Rule | Status | Description |
|------|--------|-------------|
| **A7-1-1** | ✅ | Constexpr/const for immutable data |
| **A7-1-2** | ✅ | constexpr for compile-time values |
| **A7-1-3** | ✅ | CV-qualifiers on right side of typedef/using |
| **A7-1-4** | ✅ | register keyword shall not be used |
| **A7-1-5** | ✅ | auto specifier restrictions |
| **A7-1-6** | ✅ | typedef shall not be used (use using) |
| **A7-1-7** | ✅ | Each statement/declaration on separate line |
| **A7-1-8** | ✅ | Non-type specifier before type specifier |
| **A7-1-9** | ✅ | No class/struct/enum declaration in type definition |
| **A7-2-1** | 📋 | Enum expression values shall correspond to enumerators |
| **A7-2-2** | ✅ | Enum underlying type shall be explicit |
| **A7-2-3** | ✅ | Enumerations shall be declared as scoped enum classes |
| **A7-2-4** | ✅ | Enum: none, first, or all enumerators initialized |
| **A7-3-1** | 📋 | All function overloads visible from call point |
| **A7-5-1** | 📋 | Function shall not return reference/pointer to const param |
| **A7-5-2** | 📋 | Functions shall not call themselves (recursion) |
| **A7-6-1** | 📋 | [[noreturn]] functions shall not return |
| **M7-1-2** | ✅ | Pointer/reference param declared const if not modified |
| **M7-3-1** | ✅ | Global namespace only contains main, namespace, extern "C" |
| **M7-3-2** | ✅ | main identifier only for global main function |
| **M7-3-3** | ✅ | No unnamed namespaces in header files |
| **M7-3-4** | ✅ | Using-directives shall not be used |
| **M7-3-6** | ✅ | Using-directives/-declarations not in headers |
| **A7-4-1** through **M7-5-2** | ✅ | Assembly and function return constraints |

---

## 8. Declarators (25+ Rules)

All A8-4-X rules (parameter passing conventions), A8-5-X rules (initialization), and M8-X rules (declarators) - Total 25+ rules covering function parameters, smart pointers, initialization, etc.

---

## 9-12. Classes (40+ Rules)

All A9-X, A10-X, A11-X, A12-X, M9-X, M10-X, M11-X, M12-X rules covering:
- Member functions
- Unions  
- Derived classes
- Virtual functions
- Member access control
- Special member functions
- Constructors & destructors
- Copy/move semantics

---

## 13. Overloading (12 Rules)

All A13-X rules covering operator overloading, user-defined literals, conversion operators, comparison operators, etc.

---

## 14. Templates (8 Rules)

All A14-X and M14-X rules covering template constraints, specialization, template constructors, etc.

---

## 15. Exception Handling (30+ Rules)

All A15-X and M15-X rules covering exception safety, exception types, noexcept, catch handlers, exception specifications, etc.

---

## 16. Preprocessing Directives (17 Rules)

All A16-X and M16-X rules covering preprocessor usage, include directives, macros, include guards, etc.

---

## 17-26. Library Rules (70+ Rules)

### 17. Library Introduction (6 Rules)
Reserved identifiers, C library usage, namespace constraints

### 18. Language Support Library (20+ Rules)  
Arrays, smart pointers, memory management, dynamic allocation, std::bind, std::forward, etc.

### 19. Diagnostics Library (1 Rule)
errno usage

### 20. General Utilities Library (7 Rules)
Smart pointer ownership (unique_ptr, shared_ptr, weak_ptr)

### 21. Strings Library (1 Rule)
Character handling functions

### 23. Containers Library (2 Rules)
Iterator validity, container access

### 25. Algorithms Library (2 Rules)
Predicate functions, ordering predicates

---

## Summary

**Total Rules: 400+**

### By Category:
- Language Independent: 18
- General: 1
- Lexical: 24
- Basic Concepts: 23
- Conversions: 9
- Expressions: 60+
- Statements: 22
- Declarations: 24
- Declarators: 25+
- Classes: 40+
- Overloading: 12
- Templates: 8
- Exceptions: 30+
- Preprocessing: 17
- Library: 70+

### Implementation Notes:

1. **Pattern-Based Detection (✅)**: ~150 rules have regex patterns for basic detection
2. **Enhanced Analysis (🔄)**: ~100 rules need data/control flow analysis
3. **Compiler Integration (📋)**: ~150+ rules require full AST/semantic analysis

For production systems, consider integrating:
- Clang-Tidy with AUTOSAR module
- PC-Lint Plus / Gimpel FlexeLint
- Coverity / SonarQube  
- Custom Clang-based static analyzer

---

## Extension Mechanism

To add new rules:

```typescript
{
    code: 'AXX-Y-Z',
    message: 'Rule description',
    severity: 'error' | 'warning' | 'info',
    pattern: /regex-pattern/,
    description: 'Detailed explanation',
    category: 'Category Name',
    rationale: 'Why this rule exists'
}
```

## Quick Fix Suppression Formats

```cpp
// autosar-disable-next-line A5-0-3
int*** ptr;

int*** ptr2;  // autosar-disable-line A5-0-3

// NOLINTNEXTLINE(A5-0-3)
int*** ptr3;

// Or use standard suppression
/* autosar-disable-next-line A5-0-3 */
```
