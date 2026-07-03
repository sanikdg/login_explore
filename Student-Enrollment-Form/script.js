// ========================== */
// Student Enrollment Form Script
// ========================== */

/**
 * Global variables
 */
let isNewRecord = true; // Flag to track if it's a new record or existing
let existingRecord = null; // Store existing record data

/**
 * Initialize form on page load
 */
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    setupEventListeners();
    setTodayDateInEnrollmentDate();
});

/**
 * Initialize form state on page load
 * - Empty form should be displayed
 * - Only Roll-No field should be enabled
 * - All remaining fields should be disabled
 * - All buttons should be disabled
 * - Cursor must focus on Roll-No
 */
function initializeForm() {
    clearForm();
    disableAllFields();
    disableAllButtons();
    
    // Focus on Roll-No field
    document.getElementById('rollNo').focus();
    document.getElementById('rollNo').disabled = false;
}

/**
 * Setup event listeners for form elements
 */
function setupEventListeners() {
    // Roll No field - triggers record search on blur
    document.getElementById('rollNo').addEventListener('blur', function () {
        const rollNo = this.value.trim();
        if (rollNo) {
            searchRecord(rollNo);
        }
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', function () {
        if (validateForm()) {
            saveRecord();
        }
    });

    // Update button
    document.getElementById('updateBtn').addEventListener('click', function () {
        if (validateForm()) {
            updateRecordData();
        }
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', function () {
        resetForm();
    });

    // Enable all fields except Roll-No when user starts entering data
    const fields = ['fullName', 'class', 'birthDate', 'address', 'enrollmentDate'];
    fields.forEach(fieldId => {
        document.getElementById(fieldId).addEventListener('change', function () {
            if (isNewRecord) {
                enableSaveReset();
            }
        });
    });
}

/**
 * Clear all form fields
 */
function clearForm() {
    document.getElementById('enrollmentForm').reset();
    isNewRecord = true;
    existingRecord = null;
}

/**
 * Disable all input fields
 */
function disableAllFields() {
    const fields = ['fullName', 'class', 'birthDate', 'address', 'enrollmentDate'];
    fields.forEach(fieldId => {
        document.getElementById(fieldId).disabled = true;
    });
}

/**
 * Enable all input fields except Roll-No
 */
function enableAllFields() {
    const fields = ['fullName', 'class', 'birthDate', 'address', 'enrollmentDate'];
    fields.forEach(fieldId => {
        document.getElementById(fieldId).disabled = false;
    });
}

/**
 * Disable all buttons
 */
function disableAllButtons() {
    document.getElementById('saveBtn').disabled = true;
    document.getElementById('updateBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
}

/**
 * Enable Save and Reset buttons (for new records)
 */
function enableSaveReset() {
    document.getElementById('saveBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
}

/**
 * Enable Update and Reset buttons (for existing records)
 */
function enableUpdateReset() {
    document.getElementById('updateBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    document.getElementById('saveBtn').disabled = true;
}

/**
 * Set today's date in enrollment date field
 */
function setTodayDateInEnrollmentDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('enrollmentDate').value = today;
}

/**
 * Search for existing record by Roll No
 * @param {string} rollNo - Student Roll Number
 */
function searchRecord(rollNo) {
    if (!rollNo || isNaN(rollNo)) {
        showAlert('Please enter a valid Roll Number', 'warning');
        resetForm();
        return;
    }

    getRecord(rollNo, function (response) {
        if (response && response.status === 200) {
            // Record found - populate form for update
            const record = response.data[0];
            existingRecord = record;
            isNewRecord = false;

            document.getElementById('fullName').value = record['Full-Name'] || '';
            document.getElementById('class').value = record['Class'] || '';
            document.getElementById('birthDate').value = record['Birth-Date'] || '';
            document.getElementById('address').value = record['Address'] || '';
            document.getElementById('enrollmentDate').value = record['Enrollment-Date'] || '';

            enableAllFields();
            enableUpdateReset();
            showAlert('Record found! You can update it.', 'info');
        } else {
            // No record found - enable for new entry
            isNewRecord = true;
            existingRecord = null;
            clearForm();
            document.getElementById('rollNo').value = rollNo;
            enableAllFields();
            enableSaveReset();
            showAlert('No record found. You can create a new one.', 'info');
        }
    });
}

/**
 * Validate all form fields
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
    const rollNo = document.getElementById('rollNo').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const classVal = document.getElementById('class').value.trim();
    const birthDate = document.getElementById('birthDate').value.trim();
    const address = document.getElementById('address').value.trim();
    const enrollmentDate = document.getElementById('enrollmentDate').value.trim();

    if (!rollNo || isNaN(rollNo)) {
        showAlert('Roll Number must be a valid number', 'danger');
        return false;
    }

    if (!fullName || fullName.length < 2) {
        showAlert('Full Name is required and must be at least 2 characters', 'danger');
        return false;
    }

    if (!classVal) {
        showAlert('Please select a Class', 'danger');
        return false;
    }

    if (!birthDate) {
        showAlert('Birth Date is required', 'danger');
        return false;
    }

    if (!address || address.length < 5) {
        showAlert('Address is required and must be at least 5 characters', 'danger');
        return false;
    }

    if (!enrollmentDate) {
        showAlert('Enrollment Date is required', 'danger');
        return false;
    }

    // Validate date logic
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();

    if (age < 5 || age > 30) {
        showAlert('Student age should be between 5 and 30 years', 'danger');
        return false;
    }

    return true;
}

/**
 * Save a new record
 */
function saveRecord() {
    const record = {
        'Roll-No': document.getElementById('rollNo').value.trim(),
        'Full-Name': document.getElementById('fullName').value.trim(),
        'Class': document.getElementById('class').value.trim(),
        'Birth-Date': document.getElementById('birthDate').value.trim(),
        'Address': document.getElementById('address').value.trim(),
        'Enrollment-Date': document.getElementById('enrollmentDate').value.trim()
    };

    console.log('Saving record:', record);
    insertRecord(JSON.stringify(record), function (response) {
        console.log('Save response:', response);
        if (response && response.status === 200) {
            showAlert('Record saved successfully!', 'success');
            setTimeout(() => {
                resetForm();
                initializeForm();
            }, 1500);
        } else {
            const errorMsg = response?.message || 'Unknown error';
            console.error('Save error details:', response);
            showAlert(`Error saving record: ${errorMsg}`, 'danger');
        }
    });
}

/**
 * Update existing record
 */
function updateRecordData() {
    if (!existingRecord) {
        showAlert('No record to update', 'danger');
        return;
    }

    const recNo = existingRecord['-1'];
    if (!recNo) {
        showAlert('Cannot update: record number not found. Try searching again.', 'danger');
        return;
    }

    const record = {
        '-1': recNo,
        'Roll-No': document.getElementById('rollNo').value.trim(),
        'Full-Name': document.getElementById('fullName').value.trim(),
        'Class': document.getElementById('class').value.trim(),
        'Birth-Date': document.getElementById('birthDate').value.trim(),
        'Address': document.getElementById('address').value.trim(),
        'Enrollment-Date': document.getElementById('enrollmentDate').value.trim()
    };

    updateRecord(JSON.stringify(record), function (response) {
        console.log('Update response:', response);
        if (response && response.status === 200) {
            showAlert('Record updated successfully!', 'success');
            setTimeout(() => {
                resetForm();
                initializeForm();
            }, 1500);
        } else {
            const errorMsg = response?.message || 'Unknown error';
            console.error('Update error details:', response);
            showAlert(`Error updating record: ${errorMsg}`, 'danger');
        }
    });
}

/**
 * Reset form to initial state
 */
function resetForm() {
    clearForm();
    initializeForm();
    hideAlert();
}

/**
 * Show alert message
 * @param {string} message - Alert message to display
 * @param {string} type - Alert type (success, danger, warning, info)
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHTML;

    // Auto-hide success alerts after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideAlert();
        }, 3000);
    }
}

/**
 * Hide alert message
 */
function hideAlert() {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = '';
}
