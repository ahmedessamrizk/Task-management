# 📌 Task Management System

A secure and scalable **Task Management API** designed to handle users, tasks, and categories with strong access control, efficient querying, and clean architecture.

---

## 🚀 Features

- 🔐 Token-based Authentication & Authorization  
- 👤 User Management  
- ✅ Task CRUD with filtering & sorting  
- 🗂️ Category CRUD with ownership control  
- 🔍 Pagination support  
- 🔒 Public / Private task visibility  
- 🧂 Password hashing & salting  

---

## 🧭 ERD (Entity Relationship Diagram)
![ERD](https://drive.google.com/uc?export=view&id=1USMhSEcwGSySIit5uyHwIhNGu7kvZB7b)

### 🔗 Relationships
- A **User** can have many **Tasks**
- A **User** can have many **Categories**
- A **Category** can have many **Tasks**
- Each **Task** belongs to one **User** and one **Category**

---

## 🔐 Security

- **Authentication:** Token-based (sent in headers)  
- **Authorization:** Access control based on ownership & visibility  
- **Password Protection:** Hashing + Salting  

---

## ⚙️ Key Functionalities

- Filtering  
- Pagination  
- Sorting  
- Access Control  

---

## 🔒 Access Rules

- Users can view:
  - Their **own tasks** (public & private)
  - **Other users' public tasks only**
- Private tasks are strictly restricted to their owners

---

## 🛠️ Technologies Used

- **ExpressJs** - as the backend framework to handle routing and server logic.  
- **MongoDB** - for managing user, task, and category data.  
- **cookie-parser** - for handling cookies in Express.  
- **bcryptjs** - for hashing passwords.  
- **nodemailer** - for sending emails to users.  
- **yup** - for schema-based validation of request data.  
