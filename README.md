# login_explore
Student Enrollment Form using HTML, CSS, JavaScript, AJAX and JsonPowerDB (JPDB).
## Description

The Student Enrollment Form is a web-based application developed using HTML, CSS, JavaScript, AJAX, Bootstrap 5, and JsonPowerDB. The project demonstrates the implementation of CRUD (Create, Read, Update, and Reset) operations using JsonPowerDB REST APIs.

The application stores student information in the STUDENT-TABLE relation of the SCHOOL-DB database. Each student is uniquely identified using the Roll Number, which serves as the primary key.

When a user enters a Roll Number, the application first checks whether the record already exists in the database. If the Roll Number is not found, the user can enter the remaining student details and save a new record. If the Roll Number already exists, the application automatically retrieves the stored information, displays it in the form, and allows the user to update the existing record.

The application includes client-side validation to ensure that all mandatory fields are completed before data is saved or updated. The interface is responsive, user-friendly, and follows the workflow specified in the JsonPowerDB Beginner Micro Project guidelines.
