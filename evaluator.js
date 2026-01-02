/**
 * CodeLearn Evaluation Engine
 * Evaluates student code by checking structure, capturing output, and comparing with expected results
 * Provides detailed educational feedback for learning improvement
 */

const vm = require('vm');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class CodeEvaluator {
  constructor(options = {}) {
    this.timeout = options.timeout || 5000; // 5 seconds default
    this.maxOutputLength = options.maxOutputLength || 10000; // Max output chars
    this.verbose = options.verbose || false;
    this.feedback = [];
    this.score = 0;
    this.maxScore = 100;
  }

  /**
   * Reset evaluator state for new evaluation
   */
  reset() {
    this.feedback = [];
    this.score = 0;
  }

  /**
   * Main evaluation method - orchestrates all checks
   * @param {string} code - Student's code to evaluate
   * @param {object} config - Evaluation configuration
   * @returns {object} - Evaluation results with feedback and score
   */
  async evaluate(code, config = {}) {
    this.reset();

    // Merge with defaults
    const evaluationConfig = {
      language: 'javascript',
      testCases: [],
      expectedOutput: '',
      structureChecks: {},
      timeLimit: this.timeout,
      ...config
    };

    const results = {
      passed: false,
      score: 0,
      feedback: [],
      details: {
        structureCheck: {},
        outputCheck: {},
        testCases: []
      },
      execution: {
        success: false,
        output: '',
        error: null,
        executionTime: 0
      }
    };

    try {
      // Step 1: Structure Analysis
      const structureResults = this.checkCodeStructure(code, evaluationConfig.structureChecks);
      results.details.structureCheck = structureResults;
      this.addFeedback('Structure Check', structureResults.messages, structureResults.passed);

      // Step 2: Execute Code and Capture Output
      const executionResults = await this.executeCode(code, evaluationConfig);
      results.execution = executionResults;

      if (!executionResults.success) {
        this.addFeedback(
          'Execution Error',
          [executionResults.error],
          false,
          20 // Penalty points
        );
      } else {
        this.addFeedback(
          'Code Execution',
          ['Code executed successfully'],
          true,
          10 // Bonus points
        );

        // Step 3: Compare Output with Expected
        if (evaluationConfig.testCases && evaluationConfig.testCases.length > 0) {
          const testResults = this.runTestCases(
            executionResults.output,
            evaluationConfig.testCases
          );
          results.details.testCases = testResults;
          this.processTestResults(testResults);
        } else if (evaluationConfig.expectedOutput) {
          const outputMatch = this.compareOutput(
            executionResults.output,
            evaluationConfig.expectedOutput
          );
          results.details.outputCheck = outputMatch;
          this.addFeedback(
            'Output Verification',
            outputMatch.messages,
            outputMatch.passed,
            outputMatch.passed ? 30 : -15
          );
        }
      }

      // Calculate final score
      results.score = Math.max(0, Math.min(100, this.score));
      results.feedback = this.feedback;
      results.passed = results.score >= 70; // 70% is passing

    } catch (error) {
      results.execution.error = error.message;
      this.addFeedback('Evaluation Error', [error.message], false);
      results.feedback = this.feedback;
    }

    return results;
  }

  /**
   * Check code structure for required elements
   * @param {string} code - Code to analyze
   * @param {object} checks - Structure checks configuration
   * @returns {object} - Structure analysis results
   */
  checkCodeStructure(code, checks = {}) {
    const results = {
      passed: true,
      issues: [],
      messages: [],
      details: {}
    };

    // Default structure checks
    const defaultChecks = {
      requiresFunctions: false,
      requiresComments: false,
      requiresVariables: false,
      requiresConditionals: false,
      requiresLoops: false,
      forbiddenPatterns: [],
      ...checks
    };

    // Check for functions
    if (defaultChecks.requiresFunctions) {
      const hasFunctions = /function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>/.test(code);
      if (!hasFunctions) {
        results.issues.push('Missing function definitions');
        results.passed = false;
      } else {
        results.messages.push('✓ Contains function definitions');
      }
    }

    // Check for comments
    if (defaultChecks.requiresComments) {
      const hasComments = /\/\/|\/\*/.test(code);
      if (!hasComments) {
        results.issues.push('Missing comments or documentation');
        results.passed = false;
      } else {
        results.messages.push('✓ Contains comments');
      }
    }

    // Check for variables
    if (defaultChecks.requiresVariables) {
      const hasVariables = /const\s+\w+|let\s+\w+|var\s+\w+/.test(code);
      if (!hasVariables) {
        results.issues.push('Missing variable declarations');
        results.passed = false;
      } else {
        results.messages.push('✓ Contains variable declarations');
      }
    }

    // Check for conditionals
    if (defaultChecks.requiresConditionals) {
      const hasConditionals = /if\s*\(|switch\s*\(|ternary/.test(code);
      if (!hasConditionals) {
        results.issues.push('Missing conditional statements');
        results.passed = false;
      } else {
        results.messages.push('✓ Contains conditional statements');
      }
    }

    // Check for loops
    if (defaultChecks.requiresLoops) {
      const hasLoops = /for\s*\(|while\s*\(|forEach|map\s*\(|reduce\s*\(/.test(code);
      if (!hasLoops) {
        results.issues.push('Missing loop structures');
        results.passed = false;
      } else {
        results.messages.push('✓ Contains loop structures');
      }
    }

    // Check for forbidden patterns
    if (defaultChecks.forbiddenPatterns.length > 0) {
      defaultChecks.forbiddenPatterns.forEach(pattern => {
        const regex = new RegExp(pattern);
        if (regex.test(code)) {
          results.issues.push(`Forbidden pattern detected: ${pattern}`);
          results.passed = false;
        }
      });
    }

    // Check for basic code quality
    const codeLength = code.trim().length;
    if (codeLength === 0) {
      results.issues.push('Code is empty');
      results.passed = false;
    } else if (codeLength < 20) {
      results.issues.push('Code is too short to be meaningful');
      results.passed = false;
    } else {
      results.messages.push(`✓ Code length is adequate (${codeLength} characters)`);
    }

    results.details = {
      codeLength,
      hasComments: /\/\/|\/\*/.test(code),
      hasFunctions: /function|=>/.test(code),
      hasVariables: /const|let|var/.test(code)
    };

    return results;
  }

  /**
   * Execute code in a sandboxed environment with timeout
   * @param {string} code - Code to execute
   * @param {object} config - Execution configuration
   * @returns {Promise<object>} - Execution results
   */
  async executeCode(code, config = {}) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let output = '';
      let error = null;
      let success = false;

      try {
        // Create a sandbox context with console output capture
        const sandbox = {
          console: {
            log: (...args) => {
              output += args.join(' ') + '\n';
              if (output.length > this.maxOutputLength) {
                output = output.slice(0, this.maxOutputLength) + '\n[Output truncated]';
              }
            },
            error: (...args) => {
              output += 'ERROR: ' + args.join(' ') + '\n';
            },
            warn: (...args) => {
              output += 'WARNING: ' + args.join(' ') + '\n';
            }
          },
          require: require,
          setTimeout: setTimeout,
          setInterval: setInterval,
          Math: Math,
          JSON: JSON,
          Array: Array,
          Object: Object,
          String: String,
          Number: Number,
          Boolean: Boolean,
          Date: Date,
          RegExp: RegExp,
          Error: Error,
          parseInt: parseInt,
          parseFloat: parseFloat,
          isNaN: isNaN,
          isFinite: isFinite,
          undefined: undefined
        };

        // Create and run the script with timeout
        const script = new vm.Script(code);
        const context = vm.createContext(sandbox);

        const timeoutHandle = setTimeout(() => {
          error = `Code execution exceeded timeout of ${config.timeLimit}ms`;
        }, config.timeLimit || this.timeout);

        script.runInContext(context, { timeout: config.timeLimit || this.timeout });
        clearTimeout(timeoutHandle);

        if (!error) {
          success = true;
        }
      } catch (e) {
        error = e.message || String(e);
      }

      const executionTime = Date.now() - startTime;

      resolve({
        success: success && !error,
        output: output.trim(),
        error: error,
        executionTime: executionTime
      });
    });
  }

  /**
   * Run test cases against the code output
   * @param {string} output - Code output
   * @param {array} testCases - Array of test case objects
   * @returns {array} - Test results
   */
  runTestCases(output, testCases) {
    const results = [];

    testCases.forEach((testCase, index) => {
      const result = {
        testNumber: index + 1,
        input: testCase.input || 'N/A',
        expected: testCase.expected,
        passed: false,
        message: '',
        similarity: 0
      };

      if (testCase.type === 'output') {
        const match = this.compareOutput(output, testCase.expected);
        result.passed = match.passed;
        result.message = match.messages.join('; ');
        result.similarity = match.similarity;
      } else if (testCase.type === 'contains') {
        result.passed = output.includes(testCase.expected);
        result.message = result.passed
          ? `Output contains expected text: "${testCase.expected}"`
          : `Output does not contain expected text: "${testCase.expected}"`;
      } else if (testCase.type === 'regex') {
        const regex = new RegExp(testCase.expected);
        result.passed = regex.test(output);
        result.message = result.passed
          ? `Output matches pattern: ${testCase.expected}`
          : `Output does not match pattern: ${testCase.expected}`;
      }

      results.push(result);
    });

    return results;
  }

  /**
   * Compare actual output with expected output
   * @param {string} actual - Actual output
   * @param {string} expected - Expected output
   * @returns {object} - Comparison results
   */
  compareOutput(actual, expected) {
    const normalizeOutput = (str) => {
      return str.trim().replace(/\s+/g, ' ').toLowerCase();
    };

    const actualNormalized = normalizeOutput(actual);
    const expectedNormalized = normalizeOutput(expected);

    const exactMatch = actualNormalized === expectedNormalized;
    const containsMatch = actualNormalized.includes(expectedNormalized);
    const similarity = this.calculateSimilarity(actualNormalized, expectedNormalized);

    const passed = exactMatch || (similarity > 0.85);
    const messages = [];

    if (exactMatch) {
      messages.push('✓ Output matches expected result exactly');
    } else if (similarity > 0.85) {
      messages.push(`✓ Output matches with ${(similarity * 100).toFixed(1)}% similarity`);
    } else if (containsMatch) {
      messages.push('⚠ Output contains expected result but has extra content');
    } else {
      messages.push(`✗ Output does not match. Similarity: ${(similarity * 100).toFixed(1)}%`);
      messages.push(`  Expected: "${expectedNormalized}"`);
      messages.push(`  Got: "${actualNormalized}"`);
    }

    return {
      passed,
      similarity,
      exactMatch,
      messages,
      actual: actualNormalized,
      expected: expectedNormalized
    };
  }

  /**
   * Calculate similarity between two strings (Levenshtein distance)
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} - Similarity score (0-1)
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} - Edit distance
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Process test case results and update feedback
   * @param {array} testResults - Test results array
   */
  processTestResults(testResults) {
    const passedCount = testResults.filter(t => t.passed).length;
    const totalCount = testResults.length;
    const passPercentage = (passedCount / totalCount) * 100;

    const messages = testResults.map(t =>
      `Test ${t.testNumber}: ${t.passed ? '✓ PASS' : '✗ FAIL'} - ${t.message}`
    );

    this.addFeedback(
      'Test Cases',
      messages,
      passedCount === totalCount,
      Math.round(passPercentage / 10) // Points based on test pass rate
    );
  }

  /**
   * Add feedback entry with optional score adjustment
   * @param {string} category - Feedback category
   * @param {array} messages - Feedback messages
   * @param {boolean} passed - Whether this check passed
   * @param {number} points - Points to add/subtract
   */
  addFeedback(category, messages, passed, points = 0) {
    this.feedback.push({
      category,
      passed,
      messages: Array.isArray(messages) ? messages : [messages],
      timestamp: new Date().toISOString()
    });

    this.score += points;
  }

  /**
   * Format evaluation results for display
   * @param {object} results - Evaluation results
   * @returns {string} - Formatted results
   */
  formatResults(results) {
    let output = '';
    output += `\n${'='.repeat(60)}\n`;
    output += `EVALUATION RESULTS\n`;
    output += `${'='.repeat(60)}\n\n`;

    output += `STATUS: ${results.passed ? '✓ PASSED' : '✗ FAILED'}\n`;
    output += `SCORE: ${results.score}/100\n\n`;

    output += `FEEDBACK:\n`;
    output += '-'.repeat(60) + '\n';

    results.feedback.forEach(entry => {
      output += `\n[${entry.category}] ${entry.passed ? '✓' : '✗'}\n`;
      entry.messages.forEach(msg => {
        output += `  ${msg}\n`;
      });
    });

    output += `\n${'='.repeat(60)}\n`;

    if (results.execution.output) {
      output += `\nCODE OUTPUT:\n`;
      output += '-'.repeat(60) + '\n';
      output += results.execution.output + '\n';
      output += '-'.repeat(60) + '\n';
    }

    if (results.execution.error) {
      output += `\nEXECUTION ERROR:\n`;
      output += results.execution.error + '\n';
    }

    return output;
  }
}

// Export for use as module
module.exports = CodeEvaluator;

/**
 * Example usage:
 * 
 * const CodeEvaluator = require('./evaluator');
 * 
 * const evaluator = new CodeEvaluator({ timeout: 5000 });
 * 
 * const config = {
 *   language: 'javascript',
 *   structureChecks: {
 *     requiresFunctions: true,
 *     requiresComments: true,
 *     requiresVariables: true
 *   },
 *   testCases: [
 *     {
 *       type: 'output',
 *       input: '5',
 *       expected: '120'
 *     },
 *     {
 *       type: 'contains',
 *       expected: 'factorial'
 *     }
 *   ],
 *   expectedOutput: '120'
 * };
 * 
 * const studentCode = `
 *   // Calculate factorial
 *   function factorial(n) {
 *     if (n <= 1) return 1;
 *     return n * factorial(n - 1);
 *   }
 *   
 *   console.log(factorial(5));
 * `;
 * 
 * evaluator.evaluate(studentCode, config).then(results => {
 *   console.log(evaluator.formatResults(results));
 * });
 */
