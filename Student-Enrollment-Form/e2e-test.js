/**
 * End-to-end test script for Student Enrollment Form
 * Simulates the exact API calls that the browser would make
 * Run with: node e2e-test.js
 */

const http = require('http');

const PROXY_URL = 'http://localhost:3000';

function makeRequest(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const url = new URL(PROXY_URL + path);
        
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', chunk => responseBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseBody);
                    // Parse nested data string (like jpdb-commons.js does)
                    if (parsed.data && typeof parsed.data === 'string' && parsed.data.trim() !== '') {
                        try { parsed.data = JSON.parse(parsed.data); } catch(e) {}
                    }
                    resolve(parsed);
                } catch(e) {
                    reject(new Error(`Parse error: ${responseBody}`));
                }
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function runTests() {
    const TOKEN = "90935084|-31949246484510594|90903558";
    const DB = "SCHOOL-DB";
    const REL = "STUDENT-TABLE";
    
    console.log('========================================');
    console.log('  Student Enrollment Form E2E Tests');
    console.log('========================================\n');
    
    let passed = 0;
    let failed = 0;
    
    function assert(condition, testName, details) {
        if (condition) {
            console.log(`  ✅ PASS: ${testName}`);
            passed++;
        } else {
            console.log(`  ❌ FAIL: ${testName}`);
            if (details) console.log(`         ${JSON.stringify(details).substring(0, 200)}`);
            failed++;
        }
    }
    
    // --- TEST 1: Insert a new record ---
    console.log('\n--- Test 1: Insert New Record (Roll-No: 200) ---');
    try {
        const insertBody = {
            token: TOKEN,
            cmd: "PUT",
            dbName: DB,
            rel: REL,
            jsonStr: {
                "Roll-No": 200,
                "Full-Name": "E2E Test Student",
                "Class": "11",
                "Birth-Date": "2009-06-15",
                "Address": "123 Test Street, Test City",
                "Enrollment-Date": "2026-07-03"
            }
        };
        const insertRes = await makeRequest('/api/iml', insertBody);
        assert(insertRes.status === 200, 'Insert returns status 200', insertRes);
        assert(insertRes.message && insertRes.message.includes('INSERTED'), 'Insert message confirms data inserted', insertRes);
        
        // Extract rec_no for later update test
        var insertedRecNo = null;
        if (insertRes.data && insertRes.data.rec_no) {
            insertedRecNo = insertRes.data.rec_no[0] || insertRes.data.rec_no;
            console.log(`  📋 Inserted rec_no: ${insertedRecNo}`);
        }
    } catch(e) {
        console.log(`  ❌ FAIL: Insert threw error: ${e.message}`);
        failed++;
    }
    
    // --- TEST 2: Retrieve the inserted record ---
    console.log('\n--- Test 2: Retrieve Record (Roll-No: 200) ---');
    try {
        const getBody = {
            token: TOKEN,
            dbName: DB,
            rel: REL,
            cmd: "GET_BY_KEY",
            jsonStr: { "Roll-No": 200 }
        };
        const getRes = await makeRequest('/api/irl', getBody);
        assert(getRes.status === 200, 'GET returns status 200', getRes);
        assert(getRes.data && getRes.data.record, 'Response contains record data', getRes);
        
        if (getRes.data && getRes.data.record) {
            const record = getRes.data.record;
            assert(record['Full-Name'] === 'E2E Test Student', 'Full-Name matches', record);
            assert(record['Class'] === '11', 'Class matches', record);
            assert(record['Roll-No'] === 200, 'Roll-No matches', record);
            assert(record['Address'] === '123 Test Street, Test City', 'Address matches', record);
            
            // Verify rec_no from getRecord (used by the normalized response in jpdb-commons.js)
            insertedRecNo = getRes.data.rec_no;
            console.log(`  📋 Retrieved rec_no: ${insertedRecNo}`);
        }
    } catch(e) {
        console.log(`  ❌ FAIL: Get threw error: ${e.message}`);
        failed++;
    }
    
    // --- TEST 3: Update the record ---
    console.log('\n--- Test 3: Update Record ---');
    try {
        if (!insertedRecNo) {
            console.log('  ⚠️  SKIP: No rec_no available from previous tests');
        } else {
            const updateJsonStr = {};
            updateJsonStr[String(insertedRecNo)] = {
                "Full-Name": "E2E Updated Student",
                "Address": "456 Updated Avenue, New City"
            };
            
            const updateBody = {
                token: TOKEN,
                cmd: "UPDATE",
                dbName: DB,
                rel: REL,
                jsonStr: updateJsonStr
            };
            const updateRes = await makeRequest('/api/iml', updateBody);
            assert(updateRes.status === 200, 'Update returns status 200', updateRes);
            assert(updateRes.message === 'Success', 'Update message is "Success"', updateRes);
        }
    } catch(e) {
        console.log(`  ❌ FAIL: Update threw error: ${e.message}`);
        failed++;
    }
    
    // --- TEST 4: Verify the update ---
    console.log('\n--- Test 4: Verify Update ---');
    try {
        const verifyBody = {
            token: TOKEN,
            dbName: DB,
            rel: REL,
            cmd: "GET_BY_KEY",
            jsonStr: { "Roll-No": 200 }
        };
        const verifyRes = await makeRequest('/api/irl', verifyBody);
        assert(verifyRes.status === 200, 'Verify GET returns status 200', verifyRes);
        
        if (verifyRes.data && verifyRes.data.record) {
            const record = verifyRes.data.record;
            assert(record['Full-Name'] === 'E2E Updated Student', 'Full-Name was updated', record);
            assert(record['Address'] === '456 Updated Avenue, New City', 'Address was updated', record);
            assert(record['Class'] === '11', 'Class unchanged', record);
        }
    } catch(e) {
        console.log(`  ❌ FAIL: Verify threw error: ${e.message}`);
        failed++;
    }
    
    // --- TEST 5: Search for non-existent record ---
    console.log('\n--- Test 5: Search Non-Existent Record (Roll-No: 99999) ---');
    try {
        const notFoundBody = {
            token: TOKEN,
            dbName: DB,
            rel: REL,
            cmd: "GET_BY_KEY",
            jsonStr: { "Roll-No": 99999 }
        };
        const notFoundRes = await makeRequest('/api/irl', notFoundBody);
        assert(notFoundRes.status === 400, 'Not-found returns status 400 (in JSON body)', notFoundRes);
        assert(notFoundRes.message === 'DATA NOT FOUND', 'Message is "DATA NOT FOUND"', notFoundRes);
    } catch(e) {
        console.log(`  ❌ FAIL: Not-found search threw error: ${e.message}`);
        failed++;
    }
    
    // --- Summary ---
    console.log('\n========================================');
    console.log(`  Results: ${passed} passed, ${failed} failed`);
    console.log('========================================\n');
    
    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(e => {
    console.error('Test runner error:', e);
    process.exit(1);
});
