/*******************************************************
 * AUTOSAR C++14 Compliance Test File
 * Purpose: Test all implemented AUTOSAR rules
 * Instructions: Open this file to see violations highlighted
 *               Use Ctrl+. on warnings to suppress them
 *******************************************************/

#include <iostream>
#include <cstdlib>
#include <cstring>
#include <vector>

// ============================================================================
// CATEGORY 0: LANGUAGE INDEPENDENT ISSUES
// ============================================================================

// A0-1-2: Unused return value
int getValue() { return 42; }

void testUnusedReturnValue() {
    getValue();  // Warning: Return value not used
}

// A0-1-3: Unused static function
static int unusedFunction() {  // Warning: Function never called
    return 0;
}

// A0-1-4: Unused named parameter
void processData(int data, int unused) {  // Warning: 'unused' parameter not used
    std::cout << data;
}

// A0-4-2: long double usage
long double bigNumber = 3.14159265358979323846L;  // Warning: long double not allowed

// M0-1-1: Unreachable code
void testUnreachable() {
    return;
    int x = 5;  // Warning: Unreachable code
}

// M0-1-2: Infeasible path
void testInfeasible() {
    if (true) {  // Warning: Constant condition
        std::cout << "Always executed";
    }
}

// M0-1-3: Unused variable
void testUnused() {
    int unused;  // Warning: Unused variable
    int used = 10;
    std::cout << used;
}

// ============================================================================
// CATEGORY 1: GENERAL
// ============================================================================

// A1-1-1: Deprecated features
void testDeprecated() {
    register int x = 5;  // Warning: 'register' is deprecated
}

// ============================================================================
// CATEGORY 2: LEXICAL CONVENTIONS
// ============================================================================

// A2-3-1: Non-ASCII characters
void testNonAscii() {
    // int café = 10;  // Warning: Non-ASCII character (uncomment to test)
}

// A2-5-1: Trigraphs (rare, but tested)
// char* trigraph = "??=??/??'??<";  // Warning: Trigraph usage

// A2-7-2: Commented out code
/*
void oldFunction() {
    if (condition) {
        doSomething();
    }
}
*/  // Warning: Commented out code

// A2-10-1: Variable shadowing
int globalValue = 100;

void testShadowing() {
    int globalValue = 50;  // Warning: Shadows global variable
    std::cout << globalValue;
}

// A2-11-1: Volatile keyword
volatile int volatileVar = 0;  // Warning: volatile shall not be used

// A2-13-1: Invalid escape sequence
// char* invalid = "\k";  // Warning: Invalid escape sequence (uncomment to test)

// A2-13-3: wchar_t usage
wchar_t wideChar = L'A';  // Warning: wchar_t shall not be used

// A2-13-4: String literal to non-const pointer
void testStringLiteral() {
    char* str = "Hello";  // Warning: Should be const char*
}

// A2-13-5: Lowercase hex
int hexLower = 0xabcd;  // Warning: Should be 0xABCD

// M2-13-2: Octal constants
int octalNum = 0755;  // Warning: Octal constant not allowed

// M2-13-4: Lowercase suffix
long longNum = 100l;  // Warning: Should be 100L
float floatNum = 3.14f;  // Warning: Should be 3.14F

// ============================================================================
// CATEGORY 3: BASIC CONCEPTS
// ============================================================================

// A3-1-1: Missing include guard (in header files)
// This would be tested in a .h file

// A3-9-1: Use fixed-width integers
void testFixedWidth() {
    short s = 100;  // Warning: Use int16_t instead
    long l = 1000;  // Warning: Use int32_t or int64_t
    unsigned int ui = 500;  // Warning: Use uint32_t
}

// M3-1-2: Function declared at block scope
void testBlockScope() {
    void innerFunction();  // Warning: Function declared at block scope
}

// M3-4-1: Variable scope not minimized
int broadScope = 10;  // Could be declared later when first used

// ============================================================================
// CATEGORY 4: STANDARD CONVERSIONS
// ============================================================================

// A4-10-1: NULL instead of nullptr
void testNullptr() {
    int* ptr1 = NULL;  // Warning: Use nullptr
    int* ptr2 = 0;     // Warning: Use nullptr
    int* ptr3 = nullptr;  // OK
}

// M4-10-1: NULL as integer value
void testNullAsInt() {
    // int x = NULL + 5;  // Warning: NULL not for integer (uncomment to test)
}

// ============================================================================
// CATEGORY 5: EXPRESSIONS
// ============================================================================

// A5-0-3: More than 2 levels of pointer indirection
int*** triplePointer;  // Warning: Max 2 levels of indirection

// A5-1-1: Magic numbers
void testMagicNumbers() {
    int timeout = 5000;  // Warning: Use named constant
    int maxRetries = 3;   // Warning: Use named constant
}

// A5-2-1: dynamic_cast usage
class Base { virtual ~Base() {} };
class Derived : public Base {};

void testDynamicCast() {
    Base* b = new Derived();
    Derived* d = dynamic_cast<Derived*>(b);  // Warning: dynamic_cast should not be used
    delete b;
}

// A5-2-2: C-style cast
void testCStyleCast() {
    double d = 3.14;
    int i = (int)d;  // Warning: Use static_cast
}

// A5-2-3: const_cast
void testConstCast() {
    const int x = 5;
    int* p = const_cast<int*>(&x);  // Warning: Removing const
}

// A5-2-4: reinterpret_cast
void testReinterpretCast() {
    int x = 42;
    void* p = reinterpret_cast<void*>(&x);  // Warning: reinterpret_cast not allowed
}

// M5-0-11: plain char for numeric values
void testPlainChar() {
    // char c = 200;  // Warning: Use signed char or unsigned char (uncomment to test)
}

// M5-2-10: Increment mixed with other operators
void testIncrementMix() {
    int x = 5;
    // int y = x++ + 10;  // Warning: Don't mix ++ with other operators (uncomment to test)
}

// M5-3-2: Unary minus on unsigned
void testUnaryMinus() {
    unsigned int u = 10;
    // int neg = -u;  // Warning: Unary minus on unsigned (uncomment to test)
}

// ============================================================================
// CATEGORY 6: STATEMENTS
// ============================================================================

// A6-5-2: For loop with floating point counter
void testFloatLoop() {
    // suppress-line: M0-1-4
    for (float f = 0.0f; f < 10.0f; f += 0.1f) {  // Warning: Float loop counter
        std::cout << f;
    }
}

// A6-5-3: Do-while statement
void testDoWhile() {
    int i = 0;
    do {  // Warning: do-while should not be used
        i++;
    } while (i < 10);
}

// A6-6-1: goto statement
void testGoto() {
    goto error;  // Warning: goto not allowed
    std::cout << "Normal flow";
error:
    std::cout << "Error handler";
}

// M6-2-1: Assignment in sub-expression
void testAssignmentInExpr() {
    int x = 0;
    // if (x = 5) {  // Warning: Assignment in condition (uncomment to test)
    //     std::cout << x;
    // }
}

// M6-4-2: Missing else clause
void testMissingElse() {
    int x = 5;
    if (x > 10) {
        std::cout << "Greater";
    } else if (x > 5) {
        std::cout << "Medium";
    }  // Warning: Should have final else
}

// ============================================================================
// CATEGORY 7: DECLARATIONS
// ============================================================================

// A7-1-1: Missing const/constexpr
void testConstness() {
    int immutable = 42;  // Warning: Should be const or constexpr
    // Later: immutable is never modified
}

// A7-1-4: register keyword
void testRegister() {
    register int fast = 10;  // Warning: register is deprecated
}

// A7-1-6: typedef instead of using
typedef int MyInt;  // Warning: Use 'using' instead

// A7-2-3: Unscoped enum
enum Color { RED, GREEN, BLUE };  // Warning: Use enum class

// ============================================================================
// CATEGORY 8: DECLARATORS
// ============================================================================

// A8-4-7: Small type passed by const reference
void processInt(const int& x) {  // Warning: int should be passed by value
    std::cout << x;
}

// ============================================================================
// CATEGORIES 9-12: CLASSES
// ============================================================================

// A9-3-1: Returning non-const pointer to private data
class BadEncapsulation {
private:
    int* data;
public:
    BadEncapsulation() : data(new int(42)) {}
    int* getData() { return data; }  // Warning: Exposes private data
    ~BadEncapsulation() { delete data; }
};

// A10-3-1: Missing override specifier
class Animal {
public:
    virtual void makeSound() {}
    virtual ~Animal() {}
};

class Dog : public Animal {
public:
    void makeSound() {}  // Warning: Missing 'override'
};

// A11-0-1: Non-POD type as struct
struct ComplexStruct {  // Warning: Should be class
    virtual void method() {}
private:
    int data;
};

// A12-8-4: Move constructor using copy semantics
class MoveIssue {
    int* ptr;
public:
    MoveIssue(MoveIssue&& other) {
        ptr = new int(*other.ptr);  // Warning: Should move, not copy
    }
};

// ============================================================================
// CATEGORY 13: OVERLOADING
// ============================================================================

// A13-2-1: Assignment operator not returning *this
class BadAssignment {
public:
    BadAssignment& operator=(const BadAssignment& other) {
        // ... assignment logic ...
        // Warning: Missing return *this
    }
};

// ============================================================================
// CATEGORY 15: EXCEPTION HANDLING
// ============================================================================

// A15-1-1: Throwing non-exception type
void testThrowInt() {
    throw 5;  // Warning: Only throw std::exception derived types
}

// ============================================================================
// CATEGORY 16: PREPROCESSING
// ============================================================================

// A16-2-1: #define for constants
#define MAX_SIZE 100  // Warning: Use constexpr instead
#define PI 3.14159    // Warning: Use constexpr instead

// ============================================================================
// CATEGORY 18: LANGUAGE SUPPORT LIBRARY
// ============================================================================

// A18-1-1: C-style arrays
void testCArray() {
    int arr[10];  // Warning: Use std::array or std::vector
    arr[0] = 1;
}

// A18-5-2: Explicit new/delete
void testNewDelete() {
    int* p = new int(42);  // Warning: Use smart pointers
    delete p;              // Warning: Use smart pointers
}

// M18-0-3: stdlib functions
void testStdlib() {
    // exit(0);  // Warning: exit() not allowed (uncomment to test)
    // system("ls");  // Warning: system() not allowed (uncomment to test)
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

int main() {
    std::cout << "AUTOSAR C++14 Compliance Test Suite\n";
    std::cout << "This file intentionally violates AUTOSAR rules for testing.\n";
    std::cout << "Hover over warnings to see rule codes.\n";
    std::cout << "Press Ctrl+. to suppress individual warnings.\n";
    
    return 0;
}

// ============================================================================
// SUPPRESSION EXAMPLES (Test that suppressions work)
// ============================================================================

// autosar-disable-next-line A6-6-1
void exampleWithSuppression() {
    goto cleanup;  // This warning should be suppressed
cleanup:
    std::cout << "Cleanup";
}

void anotherExample() {
    int*** ptr;  // autosar-disable-line A5-0-3
    // The above warning should be suppressed
}


start:                                 // A1-1-1: goto label
    i++;

    if (i < 3)
        goto start;                    // suppress-line: A1-1-1

    int arr[10];                       // A18-1-2: C-style array
    int arr[10]; 
    int arr[10]; 
    int arr[10]; 
    int arr[10]; 
    int arr[10]; 

    for (int j = 0; j < 10; j++) {
        arr[j] = j;
    }

    // suppress-line: M0-1-3
    int x;                             // A8-5-1: uninitialized variable
    cout << x << endl;

    // suppress-line: A18-1-1
    char buffer[10];
    strcpy(buffer, "ThisIsTooLong");   // A18-1-4: unsafe C string function

    if (i == 3)
        cout << "Magic number" << endl; // A7-1-1: magic literal

    throw 1;                           // A15-1-1: throwing non-exception type
}

void bar(int a, int b)
{
    if (a = b) {                       // A5-2-1: assignment in condition
        cout << "Oops" << endl;
    }
}

int main()
{
    BadClass* obj = new BadClass();    // A18-4-1: raw new/delete
    Derived d;
    d.doSomething();

    int* p = NULL;                     // A11-0-1: NULL instead of nullptr

    if (p != NULL) {
        cout << *p << endl;
    }
    cout<<b<<endl;
    int value = SQR(++globalVar);      // Macro side effect

    foo();                             // A15-3-1: exception not caught

    delete obj;                        // delete without virtual destructor
    int a{10};
    return 0;
}
