# Employee Payroll Management System (EPMS) - PayMaster Ltd

Full-stack web application for managing employees, departments, and payroll.

## Tech Stack
- **Frontend:** React.js (Vite) + Tailwind CSS + Axios + React Router
- **Backend:** Node.js + Express.js + Mongoose
- **Database:** MongoDB
- **Auth:** JWT + bcrypt (Register / Login)

## Folder Structure
```
Firstname_Lastname_National_Practical_Exam_2026/
├── backend-project/
└── frontend-project/
```

## Setup

### 1. Backend
```bash
cd backend-project
npm install
# create .env (see .env.example)
npm run dev
```
Runs on http://localhost:5000

### 2. Frontend
```bash
cd frontend-project
npm install
npm run dev
```
Runs on http://localhost:5173

## Features
- Register & Login (JWT-protected routes)
- Employee form: **Insert**
- Department form: **Insert**
- Salary form: **Insert, Update, Delete, Retrieve (full CRUD)**
- Reports page: **Daily, Weekly, Monthly** reports for employees, departments and salaries
- Responsive UI with Tailwind CSS
- Menu bar: Employee | Department | Salary | Reports | Logout

## ERD (text representation)

```
Department (1) ────< (M) Employee (1) ────< (M) Salary

Department
  - departmentCode (PK)
  - departmentName

Employee
  - employeeNumber (PK)
  - firstName, lastName, address, position, telephone, gender, hiredDate
  - departmentCode (FK -> Department.departmentCode)

Salary
  - _id (PK)
  - employeeNumber (FK -> Employee.employeeNumber)
  - grossSalary, totalDeduction, netSalary, monthOfPayment
```

Cardinalities:
- One Department has Many Employees (1:M)
- One Employee has Many Salaries (1:M)
