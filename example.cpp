// Sample C++ file to demonstrate AUTOSAR Checker extension
// Open this file to see real-time AUTOSAR warnings

#include <iostream>

// A18-1-1: C-style arrays are flagged
int numbers[10];  // Warning: C-style array detected

// A5-1-1: Magic numbers are flagged
void setSpeed() {
    int speed; 
}


void errorHandling() {// A1-1-1: goto statements are flagged
    if (true) {
        goto cleanup;  // Error: Usage of goto statement
    }
    cleanup:
    return;
}

// A15-1-1: Non-exception types should not be thrown
void throwExample() {
    throw 42;  // Error: Throwing non-exception type
}

// Example of suppressing warnings
void suppressedExample() {
    // autosar-disable-next-line A5-1-1
    int timeout = 5000;  // This magic number warning is suppressed
    
    int delay = 1000; // autosar-disable-line A5-1-1 - Suppressed on this line
}

// M0-1-1: Unreachable code
int unreachableCode() {
    return 0;
    int x = 10;  // Warning: Unreachable code after return
}

int main() {
    std::cout << "AUTOSAR Checker Demo" << std::endl;
    return 0;

    int a = 10;


}
