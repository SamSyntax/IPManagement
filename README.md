IP Addresses Management Tool
Welcome to the IP Addresses Management Tool! This tool is built with Next.js 14, TypeScript, Prisma, and PostgreSQL. It allows you to manage IP addresses efficiently.

Features
IP Address Management: Add, update, and delete IP addresses.
User Management: Assign IP addresses to users and track their usage.
Region and Type Filtering: Filter IP addresses by region and type.
Validation: Ensure data integrity and validity through input validation.
RESTful API: Access and manage IP addresses programmatically via REST API.
Technologies Used
Next.js 14: React framework for server-rendered React applications.
TypeScript: Typed superset of JavaScript for enhanced development experience.
Prisma: Modern database toolkit for Node.js and TypeScript.
PostgreSQL: Powerful open-source relational database management system.
Getting Started
Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js
npm or yarn
PostgreSQL
Installation
Clone the repository:

bash
Copy code
git clone <repository_url>
Navigate to the project directory:

```bash
Copy code
cd ip-addresses-management-tool
```
Install dependencies:

```bash
Copy code
npm install
```

Configuration
Set up your PostgreSQL database and configure the connection in the .env file.

Run database migrations:

```bash
Copy code
npx prisma migrate dev
```
