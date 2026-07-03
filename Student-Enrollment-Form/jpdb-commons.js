// ========================== */
// JsonPowerDB Commons Library
// ========================== */

/**
 * Base URL for JsonPowerDB API
 * Using local proxy server to bypass CORS issues
 */
const BASE_URL = "http://localhost:3000";

/**
 * ApiKey and DbName - These are default values for the project
 * Get your token from: http://api.login2explore.com:5577/
 * In production, these should be managed securely
 */
const API_KEY = "90935084|-31949246484510594|90903558";
const DB_NAME = "SCHOOL-DB";
const RELATION_NAME = "STUDENT-TABLE";

/**
 * Makes an AJAX request to JsonPowerDB via the proxy server
 * All JPDB API calls use HTTP POST method.
 * @param {string} endpoint - The JPDB API endpoint path (e.g., "/api/iml", "/api/irl")
 * @param {object} requestBody - Data to be sent in the request body
 * @param {function} callback - Callback function to handle response
 */
function executeCommand(endpoint, requestBody, callback) {
    var httpRequest = new XMLHttpRequest();
    
    // Handle response
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            try {
                var response = JSON.parse(httpRequest.responseText);
                console.log('API Response:', response);
                
                // Parse the nested 'data' field if it's a JSON string
                if (response.data && typeof response.data === 'string' && response.data.trim() !== '') {
                    try {
                        response.data = JSON.parse(response.data);
                    } catch (e) {
                        // data is not JSON, leave as-is
                    }
                }
                
                callback(response);
            } catch (e) {
                console.error('Parse error:', e, 'Response text:', httpRequest.responseText);
                callback({
                    status: 0,
                    message: "Error parsing response",
                    error: e
                });
            }
        }
    };

    // Handle errors
    httpRequest.onerror = function () {
        console.error('Network error occurred');
        callback({
            status: 0,
            message: "Network error occurred. Make sure the proxy server is running (node server.js)."
        });
    };

    // Handle timeout
    httpRequest.ontimeout = function () {
        console.error('Request timeout');
        callback({
            status: 0,
            message: "Request timeout"
        });
    };

    // Prepare request - all JPDB requests use POST
    var dataString = JSON.stringify(requestBody);
    console.log('Sending request to:', endpoint, requestBody);
    
    httpRequest.open("POST", BASE_URL + endpoint, true);
    httpRequest.timeout = 10000;
    
    // Set headers
    httpRequest.setRequestHeader("Content-Type", "application/json");
    
    // Send request
    httpRequest.send(dataString);
}

/**
 * Gets a record from JsonPowerDB by primary key (Roll-No)
 * Uses IRL (Index Retrieval Language) endpoint with GET_BY_KEY command
 * @param {string|number} rollNo - Roll number to retrieve
 * @param {function} callback - Callback function
 */
function getRecord(rollNo, callback) {
    var requestBody = {
        token: API_KEY,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        cmd: "GET_BY_KEY",
        jsonStr: {
            "Roll-No": parseInt(rollNo)
        }
    };
    
    executeCommand("/api/irl", requestBody, function(response) {
        // Normalize the IRL response format for script.js
        // IRL returns: { data: { rec_no: N, record: {...} }, status: 200 }
        if (response && response.status === 200 && response.data && response.data.record) {
            // Add the rec_no as '-1' key for update operations
            var normalizedData = response.data.record;
            normalizedData['-1'] = response.data.rec_no;
            response.data = [normalizedData];
        }
        callback(response);
    });
}

/**
 * Inserts a new record into JsonPowerDB using PUT command
 * Uses IML (Index Manipulation Language) endpoint
 * @param {string|object} record - Record as JSON string or object
 * @param {function} callback - Callback function
 */
function insertRecord(record, callback) {
    // Parse the record if it's a string
    var recordObj = typeof record === 'string' ? JSON.parse(record) : record;
    
    // Ensure Roll-No is stored as a number for proper indexing
    if (recordObj['Roll-No']) {
        recordObj['Roll-No'] = parseInt(recordObj['Roll-No']);
    }
    
    var requestBody = {
        token: API_KEY,
        cmd: "PUT",
        dbName: DB_NAME,
        rel: RELATION_NAME,
        jsonStr: recordObj  // Must be an object, NOT a stringified string
    };
    
    executeCommand("/api/iml", requestBody, callback);
}

/**
 * Updates an existing record in JsonPowerDB using UPDATE command
 * Uses IML endpoint with rec_no-based update format
 * @param {string|object} record - Record as JSON string or object (must include '-1' key with rec_no)
 * @param {function} callback - Callback function
 */
function updateRecord(record, callback) {
    // Parse the record if it's a string
    var recordObj = typeof record === 'string' ? JSON.parse(record) : record;
    
    // JPDB UPDATE format: jsonStr = { "rec_no": { fields_to_update } }
    var recNo = recordObj['-1'];
    if (!recNo) {
        callback({ status: 400, message: "Record number (-1) not found. Cannot update." });
        return;
    }
    
    // Remove the '-1' key and Roll-No (primary key shouldn't be updated)
    var updateFields = {};
    for (var key in recordObj) {
        if (key !== '-1' && key !== 'Roll-No') {
            updateFields[key] = recordObj[key];
        }
    }
    
    var updateJsonStr = {};
    updateJsonStr[String(recNo)] = updateFields;
    
    var requestBody = {
        token: API_KEY,
        cmd: "UPDATE",
        dbName: DB_NAME,
        rel: RELATION_NAME,
        jsonStr: updateJsonStr
    };
    
    executeCommand("/api/iml", requestBody, callback);
}

/**
 * Deletes a record from JsonPowerDB using REMOVE command
 * Uses IML endpoint
 * @param {number} recNo - Record number to delete
 * @param {function} callback - Callback function
 */
function deleteRecord(recNo, callback) {
    var requestBody = {
        token: API_KEY,
        cmd: "REMOVE",
        dbName: DB_NAME,
        rel: RELATION_NAME,
        record: recNo
    };
    
    executeCommand("/api/iml", requestBody, callback);
}
