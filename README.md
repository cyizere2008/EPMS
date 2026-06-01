# 💼 Employee Payroll Management System (EPMS)

![EPMS Banner](https://img.shields.io/badge/Employee-Payroll%20Management%20System-blue?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=flat-square)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

---

## 🌍 Overview

The **Employee Payroll Management System (EPMS)** is a modern web-based application developed for **PayMaster Ltd**, a transportation and logistics company located in Rubavu District, Rwanda.

The system digitizes employee records, department management, payroll processing, and reporting. It replaces the company's manual payroll process with an automated solution that improves efficiency, accuracy, and data management.

---

## 🚀 Key Features

### 👨‍💼 Employee Management

* Register new employees
* View employee details
* Manage employee information
* Store employment records digitally
* Search employee records

### 🏢 Department Management

* Create departments
* Manage department information
* Assign employees to departments
* Track department records

### 💰 Salary Management

* Generate payroll automatically
* Calculate gross salary
* Calculate deductions
* Compute net salary
* Manage monthly salary records

### 📊 Reports & Analytics

* Employee reports
* Department reports
* Salary reports
* Daily reports
* Weekly reports
* Monthly reports

### 🔐 User Authentication

* User registration
* Secure login system
* Protected routes
* Password encryption

---

## 🎯 Project Objectives

* Automate payroll management processes
* Reduce human errors in salary calculations
* Improve employee record management
* Generate accurate reports efficiently
* Enhance data security and accessibility
* Improve operational productivity

---

## 🧱 System Architecture

```text
Frontend (React.js)
         │
         ▼
REST API (Express.js)
         │
         ▼
Backend (Node.js)
         │
         ▼
Database (MongoDB / MySQL)
```

---

## 🛠️ Tech Stack

### Frontend

* React.js ⚛️
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT Authentication 🔐

### Database

* MongoDB / MySQL

### Development Tools

* Git & GitHub
* VS Code
* Postman

---

## 📦 Core Modules

### 🔐 Authentication Module

* User registration
* User login
* Password encryption
* Role management

### 👨‍💼 Employee Module

* Add employee
* View employees
* Manage employee details
* Employee reporting

### 🏢 Department Module

* Add departments
* Update department information
* Department reporting

### 💰 Salary Module

* Payroll generation
* Salary calculations
* Salary update
* Salary deletion
* Salary retrieval

### 📊 Reporting Module

* Daily reports
* Weekly reports
* Monthly reports
* Employee reports
* Department reports
* Payroll reports

---

## 🔄 System Workflow

1. HR Officer logs into the system
2. Employee information is recorded
3. Departments are created and managed
4. Employees are assigned to departments
5. Payroll information is entered
6. System calculates salaries automatically
7. Reports are generated
8. Management reviews payroll data

---

## 🗄️ Database Structure

### Users

* id
* username
* password
* role

### Employees

* employeeNumber
* firstName
* lastName
* address
* position
* telephone
* gender
* hiredDate
* departmentId

### Departments

* departmentCode
* departmentName

### Salary

* salaryId
* employeeId
* grossSalary
* totalDeduction
* netSalary
* monthOfPayment

---

## 📈 Benefits of EPMS

✅ Automated payroll processing

✅ Reduced calculation errors

✅ Digital employee records

✅ Faster report generation

✅ Improved data security

✅ Better payroll management

✅ Increased organizational efficiency

---

## 🎨 User Interface Pages

### 📋 Navigation Menu

* Employee
* Department
* Salary
* Reports
* Logout

### 📱 Responsive Design

* Desktop Friendly
* Tablet Friendly
* Mobile Friendly

---

## 🌟 Future Enhancements

* 📧 Email salary slips
* 📄 PDF payroll reports
* 📱 Mobile application
* ☁️ Cloud deployment
* 🔔 Payroll notifications
* 📊 Advanced analytics dashboard

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/EPMS.git

# Backend setup
cd backend-project
npm install
npm run dev

# Frontend setup
cd frontend-project
npm install
npm start
```

---

## 📂 Project Structure

```text
EPMS
│
├── backend-project
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
├── frontend-project
│   ├── components
│   ├── pages
│   ├── services
│   ├── assets
│   └── App.jsx
│
└── README.md
```

---

## 👨‍💻 Author

**Cyizere**

💻 Full-Stack Developer

🚀 MERN Stack Enthusiast

🌍 Rwanda

GitHub: https://github.com/cyizere2008

---

## 📜 License

This project was developed for academic and educational purposes.

© 2026 Employee Payroll Management System (EPMS)

---

⭐ If you like this project, don't forget to give it a star on GitHub!
