/*******************************************************
 * File: autosar_violation_zoo.cpp
 * Purpose: Intentionally violate AUTOSAR C++14 rules
 *******************************************************/

#include <iostream>
#include <cstdlib>
#include <cstring>

using namespace std;                  // A7-3-6: using-directive at global scope

#define MAX 100                       // A2-5-1: macro instead of constexpr
#define SQR(x) ((x)*(x))              // A2-5-1 + side-effect risk

int globalVar;                        // A3-1-1: non-const global variable

void foo();                           // Declaration without definition nearby

void bar(int a, int b = 10);          // A8-4-10: default argument in function declaration

class BadClass {
public:
    int *ptr;                         // A12-0-1: raw pointer ownership unclear

    BadClass() {
        ptr = (int*)malloc(sizeof(int));  // A18-1-1: malloc in C++
        *ptr = 42;
    }

    ~BadClass() {
        // Memory leak: free missing
    }

    virtual void doSomething() { }    // A10-1-1: virtual without override usage
};

class Derived : public BadClass {
public:
    void doSomething() {               // A10-3-1: missing override keyword
        cout << *ptr << endl;
    }
};

void foo()
{
    int i = 0;

start:                                 // A1-1-1: goto label
    i++;

    if (i < 3)
        goto start;                    // suppress-line: A1-1-1

    int arr[10];                       // A18-1-2: C-style array

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

    int value = SQR(++globalVar);      // Macro side effect

    foo();                             // A15-3-1: exception not caught

    delete obj;                        // delete without virtual destructor

    return 0;
}
