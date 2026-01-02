/**
 * CodeLearn - Main Application Logic
 * Handles problem loading, code submission, and result display
 * Date: 2026-01-02
 */

// Application Configuration
const APP_CONFIG = {
  problemsEndpoint: '/api/problems',
  submitEndpoint: '/api/submit',
  resultsEndpoint: '/api/results',
  defaultLanguage: 'javascript',
  supportedLanguages: ['javascript', 'python', 'java', 'cpp', 'csharp']
};

// Application State
let appState = {
  currentProblem: null,
  userCode: '',
  submissionHistory: [],
  isSubmitting: false,
  selectedLanguage: APP_CONFIG.defaultLanguage
};

// DOM Elements
const problemContainer = document.getElementById('problem-container');
const codeEditor = document.getElementById('code-editor');
const submitButton = document.getElementById('submit-btn');
const resultDisplay = document.getElementById('result-display');
const languageSelector = document.getElementById('language-selector');
const problemsList = document.getElementById('problems-list');
const loadingSpinner = document.getElementById('loading-spinner');

/**
 * Initialize the application
 */
async function initializeApp() {
  console.log('Initializing CodeLearn Application...');
  
  try {
    setupEventListeners();
    setupEditorTheme();
    await loadProblems();
  } catch (error) {
    console.error('Error initializing application:', error);
    showErrorMessage('Failed to initialize application. Please refresh the page.');
  }
}

/**
 * Setup event listeners for UI interactions
 */
function setupEventListeners() {
  if (submitButton) {
    submitButton.addEventListener('click', handleSubmitCode);
  }
  
  if (languageSelector) {
    languageSelector.addEventListener('change', handleLanguageChange);
  }
  
  if (codeEditor) {
    codeEditor.addEventListener('input', handleCodeInput);
  }
  
  // Add keyboard shortcut: Ctrl+Enter to submit
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSubmitCode();
    }
  });
}

/**
 * Setup code editor theme and configuration
 */
function setupEditorTheme() {
  if (codeEditor) {
    codeEditor.style.fontFamily = 'Monaco, Menlo, Ubuntu Mono, Consolas, monospace';
    codeEditor.style.fontSize = '14px';
    codeEditor.style.lineHeight = '1.6';
    codeEditor.style.padding = '15px';
    codeEditor.style.backgroundColor = '#f5f5f5';
    codeEditor.style.color = '#333';
    codeEditor.style.borderRadius = '4px';
  }
}

/**
 * Load all available problems
 */
async function loadProblems() {
  try {
    showLoadingSpinner(true);
    
    const response = await fetch(APP_CONFIG.problemsEndpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const problems = await response.json();
    appState.submissionHistory = [];
    
    displayProblems(problems);
    
    // Load the first problem by default
    if (problems.length > 0) {
      await loadProblem(problems[0].id);
    }
  } catch (error) {
    console.error('Error loading problems:', error);
    showErrorMessage('Failed to load problems. Please try again.');
  } finally {
    showLoadingSpinner(false);
  }
}

/**
 * Display available problems in the sidebar
 */
function displayProblems(problems) {
  if (!problemsList) return;
  
  problemsList.innerHTML = '';
  
  problems.forEach((problem) => {
    const problemElement = document.createElement('div');
    problemElement.className = 'problem-item';
    problemElement.innerHTML = `
      <h3>${problem.title}</h3>
      <p class="difficulty difficulty-${problem.difficulty}">${problem.difficulty}</p>
      <p class="description">${problem.description.substring(0, 100)}...</p>
    `;
    
    problemElement.addEventListener('click', () => loadProblem(problem.id));
    problemsList.appendChild(problemElement);
  });
}

/**
 * Load a specific problem by ID
 */
async function loadProblem(problemId) {
  try {
    showLoadingSpinner(true);
    
    const response = await fetch(`${APP_CONFIG.problemsEndpoint}/${problemId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const problem = await response.json();
    appState.currentProblem = problem;
    
    displayProblem(problem);
    resetCodeEditor();
  } catch (error) {
    console.error('Error loading problem:', error);
    showErrorMessage('Failed to load problem. Please try again.');
  } finally {
    showLoadingSpinner(false);
  }
}

/**
 * Display problem details
 */
function displayProblem(problem) {
  if (!problemContainer) return;
  
  problemContainer.innerHTML = `
    <div class="problem-header">
      <h1>${problem.title}</h1>
      <span class="difficulty difficulty-${problem.difficulty}">${problem.difficulty}</span>
    </div>
    
    <div class="problem-content">
      <div class="section">
        <h2>Description</h2>
        <p>${problem.description}</p>
      </div>
      
      <div class="section">
        <h2>Examples</h2>
        <div class="examples">
          ${problem.examples.map((example, index) => `
            <div class="example">
              <h3>Example ${index + 1}:</h3>
              <p><strong>Input:</strong> <code>${example.input}</code></p>
              <p><strong>Output:</strong> <code>${example.output}</code></p>
              ${example.explanation ? `<p><strong>Explanation:</strong> ${example.explanation}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      ${problem.constraints ? `
        <div class="section">
          <h2>Constraints</h2>
          <ul>
            ${problem.constraints.map(constraint => `<li>${constraint}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Handle code editor input
 */
function handleCodeInput(event) {
  appState.userCode = event.target.value;
}

/**
 * Handle language selection change
 */
function handleLanguageChange(event) {
  appState.selectedLanguage = event.target.value;
  console.log(`Language changed to: ${appState.selectedLanguage}`);
}

/**
 * Handle code submission
 */
async function handleSubmitCode() {
  if (!appState.currentProblem) {
    showErrorMessage('Please select a problem first.');
    return;
  }
  
  if (!appState.userCode.trim()) {
    showErrorMessage('Please write some code before submitting.');
    return;
  }
  
  if (appState.isSubmitting) {
    return; // Prevent duplicate submissions
  }
  
  try {
    appState.isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    showLoadingSpinner(true);
    clearResultDisplay();
    
    const submission = {
      problemId: appState.currentProblem.id,
      code: appState.userCode,
      language: appState.selectedLanguage,
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch(APP_CONFIG.submitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submission)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Store submission in history
    appState.submissionHistory.push({
      submission,
      result,
      timestamp: new Date()
    });
    
    displayResult(result);
  } catch (error) {
    console.error('Error submitting code:', error);
    showErrorMessage('Failed to submit code. Please try again.');
  } finally {
    appState.isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Code';
    showLoadingSpinner(false);
  }
}

/**
 * Display submission result
 */
function displayResult(result) {
  if (!resultDisplay) return;
  
  const statusClass = result.status === 'accepted' ? 'success' : 'error';
  const statusIcon = result.status === 'accepted' ? '✓' : '✗';
  
  let resultHTML = `
    <div class="result-header ${statusClass}">
      <span class="status-icon">${statusIcon}</span>
      <span class="status-text">${result.status.toUpperCase()}</span>
    </div>
  `;
  
  if (result.status === 'accepted') {
    resultHTML += `
      <div class="result-details">
        <p><strong>Runtime:</strong> ${result.runtime}ms</p>
        <p><strong>Memory:</strong> ${result.memory}MB</p>
        <p><strong>All test cases passed!</strong></p>
      </div>
    `;
  } else {
    resultHTML += `
      <div class="result-details error">
        <p><strong>Error:</strong> ${result.error}</p>
        ${result.failedTest ? `
          <p><strong>Failed Test:</strong></p>
          <p>Input: <code>${result.failedTest.input}</code></p>
          <p>Expected: <code>${result.failedTest.expected}</code></p>
          <p>Got: <code>${result.failedTest.got}</code></p>
        ` : ''}
      </div>
    `;
  }
  
  resultDisplay.innerHTML = resultHTML;
  resultDisplay.style.display = 'block';
}

/**
 * Clear result display
 */
function clearResultDisplay() {
  if (resultDisplay) {
    resultDisplay.innerHTML = '';
    resultDisplay.style.display = 'none';
  }
}

/**
 * Reset code editor to problem's template
 */
function resetCodeEditor() {
  if (codeEditor && appState.currentProblem) {
    const template = appState.currentProblem.template || 
                     getTemplateForLanguage(appState.selectedLanguage);
    codeEditor.value = template;
    appState.userCode = template;
  }
}

/**
 * Get code template for selected language
 */
function getTemplateForLanguage(language) {
  const templates = {
    javascript: `function solve() {
  // Write your solution here
  
}

// Test your solution`,
    python: `def solve():
    # Write your solution here
    pass

# Test your solution`,
    java: `public class Solution {
    public static void solve() {
        // Write your solution here
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
    csharp: `using System;

class Solution {
    static void Solve() {
        // Write your solution here
    }
}`
  };
  
  return templates[language] || templates['javascript'];
}

/**
 * Show loading spinner
 */
function showLoadingSpinner(show) {
  if (loadingSpinner) {
    loadingSpinner.style.display = show ? 'block' : 'none';
  }
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f8d7da;
    color: #721c24;
    padding: 12px 20px;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
  `;
  
  document.body.appendChild(errorElement);
  
  // Remove after 5 seconds
  setTimeout(() => {
    errorElement.remove();
  }, 5000);
}

/**
 * Get submission history
 */
function getSubmissionHistory() {
  return appState.submissionHistory;
}

/**
 * Clear submission history
 */
function clearSubmissionHistory() {
  appState.submissionHistory = [];
}

/**
 * Export for testing and external use
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApp,
    loadProblem,
    handleSubmitCode,
    getSubmissionHistory,
    clearSubmissionHistory,
    appState
  };
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
