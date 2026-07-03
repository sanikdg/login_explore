# Student Enrollment Form using JsonPowerDB

## Table of Contents

* Description
* Features
* Technology Stack
* Database Details
* Benefits of JsonPowerDB
* Project Workflow
* Scope of Functionalities
* Screenshots
* Release History
* Future Enhancements
* Project Status
* Sources
* Author

---

# Description

The **Student Enrollment Form** is a web-based application developed using **HTML, CSS, Bootstrap 5, JavaScript, AJAX, and JsonPowerDB (JPDB)**. The application is designed to store and manage student enrollment information in the **STUDENT-TABLE** relation of the **SCHOOL-DB** database.

The project demonstrates the implementation of CRUD (Create, Read, Update, and Reset) operations using JsonPowerDB REST APIs. A student's **Roll Number** acts as the primary key. When a user enters a Roll Number, the application first checks whether the record already exists in the database. If the record is not found, the user can enter the remaining student details and save the new record. If the Roll Number already exists, the application automatically retrieves the stored information, displays it in the form, and allows the user to update the existing record.

The application includes input validation, dynamic enabling and disabling of form fields, and an intuitive user interface, ensuring a smooth and user-friendly experience while meeting all the requirements of the JsonPowerDB Beginner Micro Project.

---

# Features

* Student Enrollment Form
* Primary Key (Roll Number) Validation
* Save New Student Records
* Retrieve Existing Student Records
* Update Student Information
* Reset Form Functionality
* Client-side Input Validation
* AJAX-based Communication
* JsonPowerDB Integration
* Responsive User Interface

---

# Technology Stack

* HTML5
* CSS3
* Bootstrap 5
* JavaScript (ES6)
* AJAX
* JsonPowerDB (JPDB)
* jpdb-commons.js

---

# Database Details

**Database Name:** SCHOOL-DB

**Relation (Table):** STUDENT-TABLE

**Primary Key:** Roll-No

### Input Fields

* Roll-No
* Full-Name
* Class
* Birth-Date
* Address
* Enrollment-Date

---

# Benefits of using JsonPowerDB

* High Performance and Lightweight Database
* REST API-based Architecture
* Serverless Development
* Simple JSON-based Data Storage
* Schema-free Database
* Easy Integration with JavaScript Applications
* Fast CRUD Operations
* Reduced Development Time
* Multi-mode Database Support
* Minimal Configuration Required

---

# Project Workflow

1. The application loads with only the **Roll Number** field enabled.
2. The user enters a Roll Number.
3. The application checks whether the Roll Number exists in the database.
4. If the record does not exist:

   * The remaining fields become editable.
   * The **Save** button is enabled.
5. If the record already exists:

   * Student details are automatically fetched.
   * The **Update** button is enabled.
6. The user can save a new record or update an existing one.
7. After a successful operation, the form resets to its initial state.

---

# Scope of Functionalities

* Add New Student Records
* Retrieve Student Information
* Update Existing Student Details
* Validate User Inputs
* Reset Form
* Perform CRUD Operations using JsonPowerDB APIs


# Release History

## Version 1.0 – July 2026

* Developed Student Enrollment Form
* Integrated JsonPowerDB Database
* Implemented Save Functionality
* Implemented Update Functionality
* Added Client-side Validation
* Added Reset Functionality
* Published Project on GitHub

---

# Future Enhancements

* Delete Student Record
* Search Students by Name
* Advanced Search Filters
* User Authentication
* Dashboard for Student Records
* Export Student Data

---

# Project Status

✅ Completed

---

# Sources

* JsonPowerDB Documentation
* Login2Xplore Learning Resources
* Bootstrap Documentation
* MDN Web Docs

---

# Author

**Sanika Patil**

B.Tech Student | Web Development & Software Engineering Enthusiast

---

