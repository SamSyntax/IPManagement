IP Addresses Management Tool
Welcome to the IP Addresses Management Tool! This tool is built with Next.js 14, TypeScript, Prisma, and PostgreSQL. It allows you to manage IP addresses efficiently.

Features
• IP Address Management: Add, update, and delete IP addresses. <br/>
• User Management: Assign IP addresses to users and track their usage. <br/>
• Region and Type Filtering: Filter IP addresses by region and type. <br/>
• Validation: Ensure data integrity and validity through input validation. <br/>
• RESTful API: Access and manage IP addresses programmatically via REST API. <br/>
• Technologies Used <br/>
• Next.js 14: React framework for server-rendered React applications. <br/>
• TypeScript: Typed superset of JavaScript for enhanced development experience. <br/>
• Prisma: Modern database toolkit for Node.js and TypeScript. <br/>
• PostgreSQL: Powerful open-source relational database management system. <br/>
• Getting Started <br/>
• Prerequisites <br/>
• Before you begin, ensure you have the following installed on your local machine: <br/>

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

cd ip-addresses-management-tool
```
Install dependencies:

With npm:
```bash

npm install
```

With yarn:

```bash

yarn install
```

Configuration
Set up your PostgreSQL database and configure the connection in the .env file.

Run database migrations:

```bash

npx prisma migrate dev
```
