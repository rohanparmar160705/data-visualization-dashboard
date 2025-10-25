# 📊 Data Visualization Dashboard

A full-stack web application for uploading, managing, and visualizing data from CSV and Excel files with user authentication and role-based access control.

## 🎯 Features

### Core Features
- ✅ **User Authentication**: Secure signup/signin with JWT tokens
- ✅ **File Upload**: Support for CSV and Excel files (up to 10MB)
- ✅ **Data Management**: View, search, sort, and filter uploaded datasets
- ✅ **Interactive Visualizations**: Bar, Line, Pie, and Area charts
- ✅ **Pagination**: Efficient data browsing with server-side pagination
- ✅ **Real-time Filtering**: Filter data by any column with instant updates
- ✅ **Responsive Design**: Mobile-friendly interface

### Bonus Features
- 🌓 **Light/Dark Theme**: Toggle between themes with persistence
- 👥 **Role-Based Access Control**: Admin and Member roles
- 🔐 **Admin Panel**: Manage users and change roles (Admin only)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Prisma ORM** for database management
- **JWT** for authentication
- **Multer** for file uploads
- **XLSX** for Excel parsing
- **csv-parser** for CSV parsing
- **bcryptjs** for password hashing

## 📁 Project Structure

```
data-visualization-dashboard/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── dataset.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── dataset.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── utils/
│   │   │   └── fileParser.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── DataTable.tsx
    │   │   ├── ChartView.tsx
    │   │   ├── FilterPanel.tsx
    │   │   └── PrivateRoute.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx
    │   │   └── ThemeContext.tsx
    │   ├── pages/
    │   │   ├── SignIn.tsx
    │   │   ├── SignUp.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── DatasetView.tsx
    │   │   └── Admin.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dashboard_db"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=5000
NODE_ENV=development
```

4. **Set up database**
```bash
# Create database
createdb dashboard_db

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

5. **Start the server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📊 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "MEMBER"  // Optional: MEMBER or ADMIN
}
```

#### POST `/api/auth/signin`
Sign in existing user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user (requires authentication)

### Dataset Endpoints

#### POST `/api/datasets/upload`
Upload a CSV or Excel file
- Content-Type: `multipart/form-data`
- Body: `file` (file), `name` (string, optional)

#### GET `/api/datasets`
Get all datasets for current user (Admin sees all)

#### GET `/api/datasets/:id`
Get specific dataset details

#### GET `/api/datasets/:id/data`
Get dataset records with pagination
- Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`

#### DELETE `/api/datasets/:id`
Delete a dataset

### Admin Endpoints (Require ADMIN role)

#### GET `/api/admin/users`
Get all users with dataset counts

#### DELETE `/api/admin/users/:id`
Delete a user

#### PUT `/api/admin/users/:id/role`
Update user role
```json
{
  "role": "ADMIN"  // or "MEMBER"
}
```

## 🎬 Demo Video Checklist

Record a video (2-5 minutes) demonstrating:

1. **User Authentication**
   - Sign up with both MEMBER and ADMIN roles
   - Sign in
   - Theme toggle

2. **File Upload**
   - Upload a CSV file
   - Upload an Excel file
   - Show error handling

3. **Data Table**
   - View paginated data
   - Search functionality
   - Sort by columns
   - Apply filters

4. **Visualizations**
   - Switch between chart types (Bar, Line, Pie, Area)
   - Change X and Y axes
   - Show real-time filter updates

5. **Admin Features**
   - View all users
   - Change user roles
   - Delete users

## 📝 Sample Datasets

You can use these sample datasets to test:

### Sales Data (sales.csv)
```csv
date,product,amount,region,salesperson
2024-01-01,Laptop,1200,North,John
2024-01-02,Phone,800,South,Jane
2024-01-03,Tablet,500,East,Bob
```

### Employee Data (employees.xlsx)
| Name | Department | Salary | JoiningDate |
|------|------------|--------|-------------|
| Alice | Engineering | 75000 | 2022-01-15 |
| Bob | Marketing | 65000 | 2021-06-20 |
| Charlie | Sales | 70000 | 2023-03-10 |

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Admin and Member permissions
- **File Validation**: Type and size checks
- **SQL Injection Protection**: Prisma ORM
- **CORS Configuration**: Controlled origin access

## 🎨 UI/UX Features

- **Responsive Design**: Mobile, tablet, and desktop
- **Dark Mode**: System preference + manual toggle
- **Loading States**: Skeletons and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: Semantic HTML and ARIA labels

## 📦 Database Schema

### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `name`: String
- `role`: Enum (ADMIN, MEMBER)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Dataset
- `id`: UUID (Primary Key)
- `name`: String
- `filename`: String
- `uploadedBy`: UUID (Foreign Key → User)
- `rowCount`: Integer
- `columnNames`: String[]
- `createdAt`: DateTime
- `updatedAt`: DateTime

### DataRecord
- `id`: UUID (Primary Key)
- `datasetId`: UUID (Foreign Key → Dataset)
- `rowData`: JSONB
- `createdAt`: DateTime

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using React, Express, and TypeScript**
