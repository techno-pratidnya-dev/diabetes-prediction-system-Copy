/**
 * predict.js — Diabetes Prediction Form Logic
 * Handles: form validation, prediction simulation, result display
 * NOTE: This is a frontend demo. Real predictions require the Flask backend.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Backend API endpoint URL.
 * Leave as '' (empty string) to run in offline client-side DEMO mode.
 * Set to e.g. 'http://localhost:5000' when connecting the Flask Python backend.
 */
const BACKEND_URL = '';

/**
 * Field configuration rules for diabetes feature inputs.
 * Defines input ID, human-readable label, allowed range, required status, and data type.
 */
const FIELDS_CONFIG = [
    {
        id: 'pregnancies',
        label: 'Pregnancies',
        min: 0,
        max: 20,
        required: true,
        type: 'int'
    },
    {
        id: 'glucose',
        label: 'Glucose',
        min: 0,
        max: 300,
        required: true,
        type: 'float'
    },
    {
        id: 'bloodPressure',
        label: 'Blood Pressure',
        min: 0,
        max: 200,
        required: true,
        type: 'float'
    },
    {
        id: 'skinThickness',
        label: 'Skin Thickness',
        min: 0,
        max: 100,
        required: true,
        type: 'float'
    },
    {
        id: 'insulin',
        label: 'Insulin',
        min: 0,
        max: 900,
        required: true,
        type: 'float'
    },
    {
        id: 'bmi',
        label: 'BMI',
        min: 0,
        max: 70,
        required: true,
        type: 'float'
    },
    {
        id: 'dpf',
        label: 'Diabetes Pedigree Function',
        min: 0.0,
        max: 2.5,
        required: true,
        type: 'float'
    },
    {
        id: 'age',
        label: 'Age',
        min: 1,
        max: 120,
        required: true,
        type: 'int'
    }
];

// Constant disclaimer text displayed with all results
const DISCLAIMER_TEXT =
    'This demo uses a simplified rule for illustration only. Connect the Python backend for actual KNN model predictions.';

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const clearBtn = document.getElementById('clear-btn');

    if (!form) return;

    // Attach real-time validation on input and blur events for each field
    FIELDS_CONFIG.forEach((fieldConfig) => {
        const input = document.getElementById(fieldConfig.id);
        if (input) {
            input.addEventListener('input', () => validateField(fieldConfig));
            input.addEventListener('blur', () => validateField(fieldConfig));
        }
    });

    // Form submit handler
    form.addEventListener('submit', handleFormSubmit);

    // Clear / Reset button handler
    if (clearBtn) {
        clearBtn.addEventListener('click', handleFormReset);
    }
});

// ============================================================================
// VALIDATION LOGIC
// ============================================================================

/**
 * Finds or creates an associated error message element for an input field.
 * Looks for an existing #id-error element or .form-error inside the same group.
 * @param {HTMLInputElement} inputEl
 * @param {string} fieldId
 * @returns {HTMLElement} Error container element
 */
function getOrCreateErrorElement(inputEl, fieldId) {
    // 1. Check for specific id e.g. "pregnancies-error"
    let errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) return errorEl;

    // 2. Check within the parent container (e.g. .form-group)
    const formGroup = inputEl.closest('.form-group') || inputEl.parentElement;
    if (formGroup) {
        errorEl = formGroup.querySelector('.form-error');
        if (errorEl) return errorEl;
    }

    // 3. Create a fallback error span dynamically after input if none exists
    errorEl = document.createElement('span');
    errorEl.id = `${fieldId}-error`;
    errorEl.className = 'form-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.style.display = 'none';
    inputEl.insertAdjacentElement('afterend', errorEl);
    return errorEl;
}

/**
 * Validates a single field against its configuration rules.
 * Handles required checks, integer/float type checks, and min/max boundaries.
 * @param {Object} fieldConfig - Configuration object from FIELDS_CONFIG
 * @returns {boolean} True if valid, false if invalid
 */
function validateField(fieldConfig) {
    const input = document.getElementById(fieldConfig.id);
    if (!input) return true;

    const errorEl = getOrCreateErrorElement(input, fieldConfig.id);
    const rawValue = input.value.trim();

    // 1. Required Check
    if (fieldConfig.required && rawValue === '') {
        showFieldError(input, errorEl, `${fieldConfig.label} is required.`);
        return false;
    }

    // If optional and empty, clear errors
    if (!fieldConfig.required && rawValue === '') {
        clearFieldError(input, errorEl);
        return true;
    }

    const numValue = Number(rawValue);

    // 2. Check if valid number
    if (isNaN(numValue)) {
        showFieldError(input, errorEl, `${fieldConfig.label} must be a valid number.`);
        return false;
    }

    // 3. Integer Check
    if (fieldConfig.type === 'int') {
        if (!Number.isInteger(numValue) || rawValue.includes('.')) {
            showFieldError(input, errorEl, `${fieldConfig.label} must be a whole number (integer).`);
            return false;
        }
    }

    // 4. Min / Max Range Check
    if (numValue < fieldConfig.min || numValue > fieldConfig.max) {
        showFieldError(
            input,
            errorEl,
            `${fieldConfig.label} must be between ${fieldConfig.min} and ${fieldConfig.max}.`
        );
        return false;
    }

    // All checks passed
    clearFieldError(input, errorEl);
    return true;
}

/**
 * Displays error styling on an input and sets error message text.
 */
function showFieldError(input, errorEl, message) {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

/**
 * Clears error styling and hides error message for an input.
 */
function clearFieldError(input, errorEl) {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
}

/**
 * Validates all form fields in FIELDS_CONFIG.
 * Focuses the first invalid field for accessibility.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validateForm() {
    let isFormValid = true;
    let firstInvalidInput = null;

    FIELDS_CONFIG.forEach((fieldConfig) => {
        const isValid = validateField(fieldConfig);
        if (!isValid) {
            isFormValid = false;
            if (!firstInvalidInput) {
                firstInvalidInput = document.getElementById(fieldConfig.id);
            }
        }
    });

    if (firstInvalidInput) {
        firstInvalidInput.focus();
    }

    return isFormValid;
}

// ============================================================================
// FORM SUBMISSION & PREDICTION FLOW
// ============================================================================

/**
 * Handles form submission: validates, displays loading spinner,
 * queries backend or falls back to demo heuristic, and displays the result.
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    // 1. Validate all fields
    const isValid = validateForm();
    if (!isValid) return;

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]') || document.getElementById('submit-btn');

    // 2. Set loading state on the submit button
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Predict';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Analyzing...';
    }

    // 3. Collect parsed form values
    const formData = {
        pregnancies: parseInt(document.getElementById('pregnancies').value, 10),
        glucose: parseFloat(document.getElementById('glucose').value),
        bloodPressure: parseFloat(document.getElementById('bloodPressure').value),
        skinThickness: parseFloat(document.getElementById('skinThickness').value),
        insulin: parseFloat(document.getElementById('insulin').value),
        bmi: parseFloat(document.getElementById('bmi').value),
        dpf: parseFloat(document.getElementById('dpf').value),
        age: parseInt(document.getElementById('age').value, 10)
    };

    // 4. Simulated processing delay (1.5 seconds) to mimic model inference
    setTimeout(async () => {
        try {
            if (BACKEND_URL && BACKEND_URL.trim() !== '') {
                // Live Backend Mode: POST to Flask / FastAPI server
                await fetchBackendPrediction(formData);
            } else {
                // Client-side Demo Heuristic Mode (clearly NOT a real ML model)
                runDemoHeuristic(formData);
            }
        } catch (error) {
            console.error('Prediction request failed:', error);
            displayResult({
                isPositive: false,
                title: 'Backend Connection Error',
                description: `Could not connect to ${BACKEND_URL}. Ensure your Flask app is running. Error: ${error.message}`,
                isError: true
            });
        } finally {
            // Restore button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        }
    }, 1500);
}

/**
 * Sends form data to the Flask backend endpoint.
 * @param {Object} formData
 */
async function fetchBackendPrediction(formData) {
    const response = await fetch(`${BACKEND_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    // Handles formats: { prediction: 1|0 } or { result: 'Positive'|'Negative' }
    const isPositive = data.prediction === 1 || data.result === 'Positive' || data.isPositive === true;

    displayResult({
        isPositive: isPositive,
        title: isPositive ? 'High Risk — Diabetes Indicated' : 'Low Risk — Diabetes Unlikely',
        description: data.message || (isPositive
            ? 'The trained ML model predicts an elevated likelihood of diabetes. Clinical follow-up is recommended.'
            : 'The trained ML model predicts low probability of diabetes based on the provided clinical markers.'),
        probability: data.probability !== undefined ? data.probability : null
    });
}

/**
 * Runs a simple, explicit demo heuristic when no backend is connected.
 * Rule: glucose > 140 OR bmi > 35 OR (age > 50 AND glucose > 120)
 * @param {Object} data
 */
function runDemoHeuristic(data) {
    const isPositive =
        data.glucose > 140 ||
        data.bmi > 35 ||
        (data.age > 50 && data.glucose > 120);

    const title = isPositive ? 'High Risk — Diabetes Indicated' : 'Low Risk — Diabetes Unlikely';
    const description = isPositive
        ? 'Clinical markers indicate elevated glucose or BMI levels commonly associated with increased diabetic risk. Please consult a medical professional for diagnostic testing.'
        : 'Clinical markers are within standard baseline boundaries. Diabetes risk appears low based on the entered parameters. Maintain a balanced diet and regular exercise.';

    displayResult({
        isPositive: isPositive,
        title: title,
        description: description
    });
}

// ============================================================================
// RESULT PRESENTATION
// ============================================================================

/**
 * Displays prediction results inside #result-section and scrolls smoothly into view.
 * Dynamically updates or constructs UI elements for resilience across templates.
 * @param {Object} resultData - { isPositive, title, description, isError, probability }
 */
function displayResult({ isPositive, title, description, isError = false, probability = null }) {
    const resultSection = document.getElementById('result-section');
    if (!resultSection) return;

    // Remove previous state classes and hide attribute
    resultSection.classList.remove('result-positive', 'result-negative', 'result-error', 'hidden');
    resultSection.removeAttribute('hidden');
    resultSection.style.display = 'block';

    // Add corresponding status class
    if (isError) {
        resultSection.classList.add('result-error');
    } else if (isPositive) {
        resultSection.classList.add('result-positive');
    } else {
        resultSection.classList.add('result-negative');
    }

    const iconSymbol = isError ? '❌' : (isPositive ? '⚠️' : '✅');

    // Check for existing targeted child elements in the DOM
    const iconEl = resultSection.querySelector('#result-icon, .result-icon');
    const titleEl = resultSection.querySelector('#result-title, .result-title');
    const descEl = resultSection.querySelector('#result-description, .result-description');
    const disclaimerEl = resultSection.querySelector('#result-disclaimer, .result-disclaimer');

    if (iconEl && titleEl && descEl) {
        // Template has structured children: populate them directly
        iconEl.textContent = iconSymbol;
        titleEl.textContent = title;
        descEl.textContent = description;
        if (disclaimerEl) {
            disclaimerEl.textContent = DISCLAIMER_TEXT;
        }
    } else {
        // Fallback: render complete accessible result card into #result-section
        resultSection.innerHTML = `
            <div class="result-card ${isPositive ? 'result-positive' : 'result-negative'}">
                <div class="result-header">
                    <span class="result-icon" aria-hidden="true">${iconSymbol}</span>
                    <h3 class="result-title">${title}</h3>
                </div>
                <p class="result-description">${description}</p>
                ${probability !== null ? `<p class="result-probability">Confidence / Probability: <strong>${(probability * 100).toFixed(1)}%</strong></p>` : ''}
                <div class="result-disclaimer" role="note">
                    <small><strong>Note:</strong> ${DISCLAIMER_TEXT}</small>
                </div>
            </div>
        `;
    }

    // Scroll smoothly to the result section
    resultSection.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// ============================================================================
// RESET HANDLER
// ============================================================================

/**
 * Resets the form, clears all field errors, and hides the result section.
 */
function handleFormReset() {
    const form = document.getElementById('prediction-form');
    if (form) {
        form.reset();
    }

    // Clear validation error classes and messages
    FIELDS_CONFIG.forEach((fieldConfig) => {
        const input = document.getElementById(fieldConfig.id);
        if (input) {
            const errorEl = getOrCreateErrorElement(input, fieldConfig.id);
            clearFieldError(input, errorEl);
        }
    });

    // Hide result section
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
        resultSection.classList.remove('result-positive', 'result-negative', 'result-error');
        resultSection.classList.add('hidden');
        resultSection.style.display = 'none';
    }
}
