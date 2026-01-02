/**
 * CodeLearn - Coding Problems Database
 * A comprehensive collection of coding problems with test cases for learning
 * Last Updated: 2026-01-02
 */

const problems = [
  {
    id: 1,
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    category: "Mathematics",
    description: `
      Write a function that takes two numbers as input and returns their sum.
      
      This is a basic problem to get started with function writing and 
      understanding input/output in programming.
    `,
    constraints: [
      "Numbers can be positive or negative",
      "Numbers can be integers or decimals"
    ],
    examples: [
      {
        input: "2, 3",
        output: 5
      },
      {
        input: "-5, 10",
        output: 5
      }
    ],
    testCases: [
      {
        input: [2, 3],
        expectedOutput: 5
      },
      {
        input: [-5, 10],
        expectedOutput: 5
      },
      {
        input: [0, 0],
        expectedOutput: 0
      },
      {
        input: [-10, -5],
        expectedOutput: -15
      },
      {
        input: [3.5, 2.5],
        expectedOutput: 6
      }
    ],
    sampleSolution: `
function sumTwoNumbers(a, b) {
  return a + b;
}
    `,
    hints: [
      "Use the addition operator (+)",
      "Return the result directly"
    ]
  },

  {
    id: 2,
    title: "Check if Number is Even",
    difficulty: "Easy",
    category: "Conditional Logic",
    description: `
      Write a function that determines whether a given number is even or odd.
      Return true if the number is even, false if it's odd.
      
      This problem teaches you about conditional statements and 
      the modulo operator.
    `,
    constraints: [
      "Input will be an integer",
      "Can be positive or negative"
    ],
    examples: [
      {
        input: "4",
        output: true
      },
      {
        input: "7",
        output: false
      }
    ],
    testCases: [
      {
        input: [4],
        expectedOutput: true
      },
      {
        input: [7],
        expectedOutput: false
      },
      {
        input: [0],
        expectedOutput: true
      },
      {
        input: [-2],
        expectedOutput: true
      },
      {
        input: [-3],
        expectedOutput: false
      },
      {
        input: [100],
        expectedOutput: true
      }
    ],
    sampleSolution: `
function isEven(num) {
  return num % 2 === 0;
}
    `,
    hints: [
      "Use the modulo operator (%) to find remainder",
      "If remainder is 0, the number is even",
      "If remainder is 1 or -1, the number is odd"
    ]
  },

  {
    id: 3,
    title: "Find Maximum of Three Numbers",
    difficulty: "Easy",
    category: "Conditional Logic",
    description: `
      Write a function that takes three numbers as input and returns 
      the maximum (largest) number among them.
      
      This problem helps you practice nested conditionals and 
      comparison operators.
    `,
    constraints: [
      "Input will be three integers",
      "Numbers can be positive, negative, or zero",
      "All three numbers may be equal"
    ],
    examples: [
      {
        input: "5, 10, 3",
        output: 10
      },
      {
        input: "-1, -5, -3",
        output: -1
      }
    ],
    testCases: [
      {
        input: [5, 10, 3],
        expectedOutput: 10
      },
      {
        input: [-1, -5, -3],
        expectedOutput: -1
      },
      {
        input: [0, 0, 0],
        expectedOutput: 0
      },
      {
        input: [100, 50, 75],
        expectedOutput: 100
      },
      {
        input: [5, 5, 5],
        expectedOutput: 5
      },
      {
        input: [1, 2, 3],
        expectedOutput: 3
      }
    ],
    sampleSolution: `
function findMax(a, b, c) {
  return Math.max(a, b, c);
}

// Alternative solution using conditionals:
function findMaxAlternative(a, b, c) {
  if (a >= b && a >= c) return a;
  if (b >= a && b >= c) return b;
  return c;
}
    `,
    hints: [
      "Compare all three numbers",
      "You can use Math.max() or nested if-else statements",
      "Ensure all cases are covered (including when numbers are equal)"
    ]
  },

  {
    id: 4,
    title: "Count Vowels in a String",
    difficulty: "Easy",
    category: "String Manipulation",
    description: `
      Write a function that counts and returns the total number of 
      vowels in a given string.
      
      Vowels are: a, e, i, o, u (both uppercase and lowercase).
      
      This problem teaches you about loops and string operations.
    `,
    constraints: [
      "String can contain spaces and special characters",
      "Both uppercase and lowercase vowels should be counted",
      "Empty string should return 0"
    ],
    examples: [
      {
        input: "hello",
        output: 2
      },
      {
        input: "JavaScript",
        output: 3
      }
    ],
    testCases: [
      {
        input: ["hello"],
        expectedOutput: 2
      },
      {
        input: ["JavaScript"],
        expectedOutput: 3
      },
      {
        input: ["aEiOu"],
        expectedOutput: 5
      },
      {
        input: [""],
        expectedOutput: 0
      },
      {
        input: ["xyz"],
        expectedOutput: 0
      },
      {
        input: ["Hello World"],
        expectedOutput: 3
      },
      {
        input: ["Programming"],
        expectedOutput: 3
      }
    ],
    sampleSolution: `
function countVowels(str) {
  const vowels = "aeiouAEIOU";
  let count = 0;
  
  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  
  return count;
}

// Alternative using regular expressions:
function countVowelsRegex(str) {
  const vowelRegex = /[aeiou]/gi;
  const matches = str.match(vowelRegex);
  return matches ? matches.length : 0;
}
    `,
    hints: [
      "Iterate through each character in the string",
      "Check if the character is a vowel",
      "Use a counter to track the number of vowels",
      "Make sure to check both uppercase and lowercase vowels"
    ]
  },

  {
    id: 5,
    title: "Factorial of a Number",
    difficulty: "Medium",
    category: "Mathematics",
    description: `
      Write a function that calculates the factorial of a given number.
      
      The factorial of n (denoted as n!) is the product of all positive 
      integers less than or equal to n.
      
      Example: 5! = 5 × 4 × 3 × 2 × 1 = 120
      
      This problem teaches you about loops and mathematical computations.
    `,
    constraints: [
      "Input will be a non-negative integer",
      "0! = 1 (by definition)",
      "Factorial grows very quickly"
    ],
    examples: [
      {
        input: "5",
        output: 120
      },
      {
        input: "0",
        output: 1
      }
    ],
    testCases: [
      {
        input: [5],
        expectedOutput: 120
      },
      {
        input: [0],
        expectedOutput: 1
      },
      {
        input: [1],
        expectedOutput: 1
      },
      {
        input: [3],
        expectedOutput: 6
      },
      {
        input: [10],
        expectedOutput: 3628800
      },
      {
        input: [6],
        expectedOutput: 720
      }
    ],
    sampleSolution: `
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}

// Alternative recursive solution:
function factorialRecursive(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorialRecursive(n - 1);
}
    `,
    hints: [
      "Handle the base cases (0! = 1, 1! = 1)",
      "Use a loop to multiply numbers from 1 to n",
      "Remember that 0! = 1 by definition",
      "You can also solve this recursively"
    ]
  },

  {
    id: 6,
    title: "Reverse a String",
    difficulty: "Easy",
    category: "String Manipulation",
    description: `
      Write a function that takes a string and returns a new string 
      with the characters in reverse order.
      
      Example: "hello" becomes "olleh"
      
      This problem helps you understand string operations and loops.
    `,
    constraints: [
      "Empty string should return empty string",
      "String can contain spaces and special characters"
    ],
    examples: [
      {
        input: "hello",
        output: "olleh"
      },
      {
        input: "JavaScript",
        output: "tpircSavaJ"
      }
    ],
    testCases: [
      {
        input: ["hello"],
        expectedOutput: "olleh"
      },
      {
        input: ["JavaScript"],
        expectedOutput: "tpircSavaJ"
      },
      {
        input: [""],
        expectedOutput: ""
      },
      {
        input: ["a"],
        expectedOutput: "a"
      },
      {
        input: ["Hello World"],
        expectedOutput: "dlroW olleH"
      },
      {
        input: ["12345"],
        expectedOutput: "54321"
      }
    ],
    sampleSolution: `
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Alternative using loop:
function reverseStringLoop(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
    `,
    hints: [
      "You can use split(), reverse(), and join() methods",
      "Alternatively, use a loop to iterate backwards",
      "Build the reversed string character by character"
    ]
  },

  {
    id: 7,
    title: "Check if String is Palindrome",
    difficulty: "Easy",
    category: "String Manipulation",
    description: `
      Write a function that determines if a given string is a palindrome.
      
      A palindrome is a word, phrase, or sequence that reads the same 
      backwards as forwards (ignoring spaces and special characters).
      
      Example: "racecar" is a palindrome
      
      For this problem, only consider alphanumeric characters and 
      ignore case.
    `,
    constraints: [
      "Ignore spaces and special characters",
      "Case-insensitive comparison",
      "Empty string is considered a palindrome"
    ],
    examples: [
      {
        input: "racecar",
        output: true
      },
      {
        input: "hello",
        output: false
      }
    ],
    testCases: [
      {
        input: ["racecar"],
        expectedOutput: true
      },
      {
        input: ["hello"],
        expectedOutput: false
      },
      {
        input: ["A man a plan a canal Panama"],
        expectedOutput: true
      },
      {
        input: [""],
        expectedOutput: true
      },
      {
        input: ["a"],
        expectedOutput: true
      },
      {
        input: ["ab"],
        expectedOutput: false
      },
      {
        input: ["level"],
        expectedOutput: true
      }
    ],
    sampleSolution: `
function isPalindrome(str) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleaned = str.replace(/[^a-z0-9]/gi, '').toLowerCase();
  
  // Check if it's equal to its reverse
  return cleaned === cleaned.split('').reverse().join('');
}

// Alternative using two pointers:
function isPalindromePointers(str) {
  const cleaned = str.replace(/[^a-z0-9]/gi, '').toLowerCase();
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  
  return true;
}
    `,
    hints: [
      "Remove all non-alphanumeric characters",
      "Convert to lowercase for case-insensitive comparison",
      "Compare the string with its reverse",
      "You can use two pointers approach for optimization"
    ]
  },

  {
    id: 8,
    title: "Find the Sum of Array Elements",
    difficulty: "Easy",
    category: "Arrays",
    description: `
      Write a function that takes an array of numbers and returns 
      the sum of all elements in the array.
      
      Example: [1, 2, 3, 4, 5] returns 15
      
      This problem helps you practice array iteration.
    `,
    constraints: [
      "Array can contain positive and negative numbers",
      "Empty array should return 0",
      "Array can contain decimals"
    ],
    examples: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: 15
      },
      {
        input: "[-1, -2, 3]",
        output: 0
      }
    ],
    testCases: [
      {
        input: [[1, 2, 3, 4, 5]],
        expectedOutput: 15
      },
      {
        input: [[-1, -2, 3]],
        expectedOutput: 0
      },
      {
        input: [[]],
        expectedOutput: 0
      },
      {
        input: [[0]],
        expectedOutput: 0
      },
      {
        input: [[10, 20, 30]],
        expectedOutput: 60
      },
      {
        input: [[-5, -10, -15]],
        expectedOutput: -30
      }
    ],
    sampleSolution: `
function sumArray(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}

// Alternative using loop:
function sumArrayLoop(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum;
}
    `,
    hints: [
      "Use a loop to iterate through the array",
      "Accumulate the sum in a variable",
      "You can use reduce() method for a more functional approach",
      "Handle empty array by returning 0"
    ]
  },

  {
    id: 9,
    title: "Find Largest Element in Array",
    difficulty: "Easy",
    category: "Arrays",
    description: `
      Write a function that takes an array of numbers and returns 
      the largest (maximum) element in the array.
      
      Example: [3, 1, 4, 1, 5] returns 5
      
      This problem teaches array traversal and comparison.
    `,
    constraints: [
      "Array will have at least one element",
      "Array can contain negative numbers",
      "Array can contain duplicates"
    ],
    examples: [
      {
        input: "[3, 1, 4, 1, 5]",
        output: 5
      },
      {
        input: "[-10, -5, -20]",
        output: -5
      }
    ],
    testCases: [
      {
        input: [[3, 1, 4, 1, 5]],
        expectedOutput: 5
      },
      {
        input: [[-10, -5, -20]],
        expectedOutput: -5
      },
      {
        input: [[1]],
        expectedOutput: 1
      },
      {
        input: [[5, 5, 5]],
        expectedOutput: 5
      },
      {
        input: [[100, 50, 75, 200, 25]],
        expectedOutput: 200
      }
    ],
    sampleSolution: `
function findMax(arr) {
  return Math.max(...arr);
}

// Alternative using loop:
function findMaxLoop(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
    `,
    hints: [
      "Use Math.max() with spread operator",
      "Or iterate through array and track the maximum",
      "Initialize max with the first element"
    ]
  },

  {
    id: 10,
    title: "Remove Duplicates from Array",
    difficulty: "Medium",
    category: "Arrays",
    description: `
      Write a function that takes an array and returns a new array 
      with all duplicate elements removed.
      
      Example: [1, 2, 2, 3, 1, 4] returns [1, 2, 3, 4]
      
      The order of elements should be maintained (first occurrence).
      
      This problem teaches you about sets and array filtering.
    `,
    constraints: [
      "Preserve the order of first occurrence",
      "Empty array should return empty array",
      "Works with any data type"
    ],
    examples: [
      {
        input: "[1, 2, 2, 3, 1, 4]",
        output: "[1, 2, 3, 4]"
      },
      {
        input: "[5, 5, 5]",
        output: "[5]"
      }
    ],
    testCases: [
      {
        input: [[1, 2, 2, 3, 1, 4]],
        expectedOutput: [1, 2, 3, 4]
      },
      {
        input: [[5, 5, 5]],
        expectedOutput: [5]
      },
      {
        input: [[]],
        expectedOutput: []
      },
      {
        input: [[1, 2, 3, 4]],
        expectedOutput: [1, 2, 3, 4]
      },
      {
        input: [[1, 1, 1, 1]],
        expectedOutput: [1]
      }
    ],
    sampleSolution: `
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Alternative using filter:
function removeDuplicatesFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
    `,
    hints: [
      "Use Set to store unique elements",
      "Convert Set back to array using spread operator",
      "Alternatively, use filter with indexOf",
      "Maintain the order of first occurrence"
    ]
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = problems;
}
