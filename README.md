# Urugendo - Thousand Experiences

A web-based platform that connects tourists with local tourism operators in Rwanda, enabling authentic travel experiences and cultural connections.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Deployed App](#deployed-app)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [License](#license)
- [Video](#video)
- [Repo Zip File](#repo-zip-file)

## 📖 Project Overview

Urugendo is a comprehensive tourism platform that bridges the gap between international tourists and local Rwandan tourism operators. The platform leverages modern web technologies to provide a seamless booking and experience management system.

**Key Features:**

- User authentication with JWT tokens
- Experience browsing, booking, and review system
- Real-time calendar availability
- Payment processing integration
- Multi-language support (i18n)
- Integration with Google Maps API
- Cloud storage with Supabase
- Email notifications via Gmail API

## 🛠 Tech Stack

### Backend

- **Framework:** Django 6.0.2 with Django REST Framework 3.16.1
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** PostgreSQL with psycopg2
- **File Storage:** Supabase
- **APIs:** Google Maps, Gmail, Google Calendar, Azure Translator
- **Additional:** Python 3.x, pip

### Frontend

- **Framework:** React 19.2.0 with TypeScript 5.9.3
- **Build Tool:** Vite 7.2.4
- **Styling:** CSS, React Bootstrap
- **State Management:** Redux
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Map Integration:** Google Maps
- **Internationalization:** i18next
- **UI Components:** Lucide React Icons

### Infrastructure

- PostgreSQL Database
- Supabase (Backend-as-a-Service)
- Google Cloud APIs
- Azure Translator API

## Deployed App

This is the link to the deployed app: https://urugendo-app.southafricanorth.cloudapp.azure.com/

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** and **npm 9+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Optional but Recommended

- **Visual Studio Code** - Code editor
- **Postman** - For API testing
- **pgAdmin** - PostgreSQL management tool

### Verify Installations

Open a terminal/PowerShell and run:

```bash
python --version
node --version
npm --version
psql --version
```

## 🚀 Installation Guide

### Backend Setup

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Create Virtual Environment

```bash
python -m venv .venv
```

#### Step 3: Activate Virtual Environment

**On Windows (PowerShell):**

```bash
.\.venv\Scripts\Activate.ps1
```

**On Windows (Command Prompt):**

```bash
.venv\Scripts\activate.bat
```

**On macOS/Linux:**

```bash
source .venv/bin/activate
```

#### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install all required Python packages including Django, DRF, Supabase client, Google APIs, and other dependencies.

#### Step 5: Database Configuration

Ensure PostgreSQL is running on your system. The default configuration expects:

- **Host:** localhost
- **Port:** 5432
- **Database:** Urugendo
- **Username:** postgres
- **Password:** (as set in your .env file)

Create the database if it doesn't exist:

```bash
psql -U postgres -c "CREATE DATABASE Urugendo;"
```

#### Step 6: Environment Variables Configuration

The `.env` file is already present in the backend directory. It contains:

```text
# Django settings
DEBUG = True
FRONTEND_URL = http://localhost:5173

# Database configuration
DB_NAME = Urugendo
DB_USER = postgres
DB_PASSWORD = [Your DB Password]
DB_HOST = localhost
DB_PORT = 5432

# API Keys and Secrets
SECRET_KEY = [Django Secret Key]
JWT_SECRET_KEY = [JWT Secret]
GOOGLE_CLIENT_ID = [Gmail OAuth Client ID]
SUPABASE_URL = [Your Supabase URL]
SUPABASE_KEY = [Your Supabase API Key]
# ... other API keys
```

**Important:** The `.env` file contains sensitive information. Never commit it to version control.

#### Step 7: Run Database Migrations

Navigate to the Urugendo project directory:

```bash
cd Urugendo
python manage.py migrate
```

This command:

- Creates all necessary database tables
- Sets up the database schema
- Runs all migration files

#### Step 8: Create a Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account. You'll need:

- Username
- Email
- Password

This account can be used to access the Django admin panel at `http://localhost:8000/admin/`

### Frontend Setup

#### Step 1: Navigate to Frontend Directory

From the project root:

```bash
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

This installs all Node.js dependencies defined in `package.json`, including React, Vite, TypeScript, and other libraries.

#### Step 3: Verify Installation

```bash
npm --version
node --version
```

## 🎬 Running the Application

You need to run both the backend and frontend simultaneously. It's recommended to use separate terminal windows.

### Starting the Backend Server

#### Terminal 1 - Backend

```bash
# Navigate to backend Urugendo directory
cd backend/Urugendo

# Activate virtual environment (if not already active)
# On Windows PowerShell:
..\..\.venv\Scripts\Activate.ps1
# On Windows Command Prompt:
..\..\.venv\Scripts\activate.bat
# On macOS/Linux:
source ../../.venv/bin/activate

# Run the development server
python manage.py runserver
```

The backend will start on `http://localhost:8000/`

You'll see output similar to:

```text
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**Available Backend URLs:**

- API Root: `http://localhost:8000/`
- Admin Panel: `http://localhost:8000/admin/`
- API Documentation: Check your urls.py configuration

### Starting the Frontend Server

#### Terminal 2 - Frontend

```bash
# Navigate to frontend directory
cd frontend

# Start Vite development server
npm run dev
```

The frontend will start on `http://localhost:5173/`

You'll see output similar to:

```text
VITE v7.2.4  ready in 234 ms

➜  Local:   http://localhost:5173/
```

### Accessing the Application

Once both servers are running:

1. Open your web browser
2. Navigate to `http://localhost:5173/`
3. The frontend will communicate with the backend API at `http://localhost:8000/`

## 🔐 Environment Variables

The backend uses the following environment variables (defined in `.env`):

### Django Configuration

| Variable       | Purpose               | Default                 |
|----------------|-----------------------|-------------------------|
| `DEBUG`        | Debug mode            | `True`                  |
| `SECRET_KEY`   | Django secret key     | Pre-configured          |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Database Configuration

| Variable      | Purpose           | Default        |
|---------------|-------------------|----------------|
| `DB_NAME`     | Database name     | `Urugendo`     |
| `DB_USER`     | Database user     | `postgres`     |
| `DB_PASSWORD` | Database password | Pre-configured |
| `DB_HOST`     | Database host     | `localhost`    |
| `DB_PORT`     | Database port     | `5432`         |

### Authentication

| Variable                     | Purpose                       |
|------------------------------|-------------------------------|
| `JWT_SECRET_KEY`             | Secret key for JWT tokens     |
| `JWT_ALGORITHM`              | JWT algorithm                 |
| `JWT_ACCESS_TOKEN_LIFETIME`  | Token validity (minutes)      |
| `JWT_REFRESH_TOKEN_LIFETIME` | Refresh token validity (days) |

### Third-party APIs

| Variable                       | Purpose                   |
|--------------------------------|---------------------------|
| `SUPABASE_URL`                 | Supabase project URL      |
| `SUPABASE_KEY`                 | Supabase API key          |
| `GOOGLE_MAPS_API_KEY`          | Google Maps API key       |
| `GOOGLE_CLIENT_ID`             | Gmail OAuth client ID     |
| `GOOGLE_CLIENT_SECRET`         | Gmail OAuth client secret |
| `GOOGLE_CALENDAR_CLIENT_ID`    | Google Calendar OAuth ID  |
| `GOOGLE_CALENDAR_REDIRECT_URI` | Calendar OAuth redirect   |
| `AZURE_TRANSLATOR_KEY`         | Azure Translator API key  |
| `AZURE_TRANSLATOR_REGION`      | Azure region              |

## 🗄 Database Setup

### PostgreSQL Installation

**Windows:**

1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL typically runs on port 5432

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

Connect to PostgreSQL:

```bash
psql -U postgres
```

Create the Urugendo database:

```sql
CREATE DATABASE Urugendo;
\q
```

### Verify Connection

From the backend Urugendo directory:

```bash
python manage.py dbshell
```

This should open a connection to your database.

## 🐛 Troubleshooting

### Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'django'"

**Solution:** Make sure your virtual environment is activated and dependencies are installed:

```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

#### Issue: "psycopg2 error" or database connection refused

**Ensure:**

1. PostgreSQL is running:
   - Windows: Check Services (search "Services" in Start menu)
   - macOS: `brew services list | grep postgresql`
   - Linux: `sudo systemctl status postgresql`
2. Database configuration matches `.env` file
3. Database exists: `psql -U postgres -l | grep Urugendo`

#### Issue: "No such table" error

**Solution:** Run migrations:

```bash
python manage.py migrate
```

#### Issue: Port 8000 already in use

**Solution:** Kill the process using port 8000 or run on a different port:

```bash
python manage.py runserver 8001
```

Then update `FRONTEND_URL` in `.env` if necessary.

### Frontend Issues

#### Issue: "npm command not found"

**Solution:** Reinstall Node.js from [nodejs.org](https://nodejs.org/)

#### Issue: "Cannot find module" error

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port 5173 already in use

**Solution:** The dev server will automatically try the next available port. Check the terminal output for the correct URL.

#### Issue: CORS errors when calling backend API

**Solution:**

1. Ensure `FRONTEND_URL` in `.env` matches the frontend URL
2. Verify backend is running on `http://localhost:8000`
3. Check that django-cors-headers is installed: `pip list | grep cors`

### General Issues

#### Issue: Changes not reflecting

**Backend:**

```bash
# Restart the Django server (Ctrl+C and run again)
python manage.py runserver
```

**Frontend:**

```bash
# Vite usually auto-refreshes, but restart if needed (Ctrl+C and run again)
npm run dev
```

#### Issue: "Command not found" errors on Windows

- Use PowerShell instead of Command Prompt
- Or use full paths: `python.exe manage.py runserver`

## 📁 Project Structure

```chart
Capstone/
├── backend/
│   ├── .venv/                 # Python virtual environment
│   ├── .env                   # Environment variables
│   ├── requirements.txt        # Python dependencies
│   └── Urugendo/              # Django project root
│       ├── manage.py          # Django management script
│       ├── scheduler.py       # Django scheduler for auto updates
│       ├── Booking/           # Booking management app
│       ├── Choices/           # Choices/options app
│       ├── Experiences/       # Experience listings app
│       ├── Location/          # Location management app
│       ├── Payment/           # Payment processing app
│       ├── Pictures/          # Image management with Supabase
│       ├── Profile/           # User profile app
│       ├── Review/            # Review and rating app
│       ├── Users/             # User authentication app
│       ├── Utils/             # Utility functions
│       └── Urugendo/          # Main Django configuration
│           ├── settings.py    # Django settings
│           ├── urls.py        # URL routing
│           └── wsgi.py        # WSGI configuration
├── frontend/
│   ├── node_modules/          # Node.js dependencies
│   ├── public/                # Static assets
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── context/           # React context
│   │   ├── hooks/             # Custom React hooks
│   │   ├── routes/            # Route configurations
│   │   ├── App.tsx            # Main App component
│   │   ├── main.tsx           # Entry point
│   │   └── i18n/              # Internationalization
│   ├── package.json           # Node.js dependencies and scripts
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript configuration
├── ansible/                   # Ansible playbooks for deployment
├── terraform/                 # Terraform infrastructure code
├── README.md                  # This file
└── LICENSE                    # MIT License
```

## 🔗 Useful Commands

### Backend Commands

```bash
# Run development server
python manage.py runserver

# Run on custom port
python manage.py runserver 8001

# Create migration after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Open Django shell
python manage.py shell

# Collect static files
python manage.py collectstatic

# Run tests
python manage.py test
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Additional Resources

- **Figma Design:** [Rwanda Tourism Discovery App](https://www.figma.com/make/LeGLKBlq53YchNMJMscDuC/Tunisia-Tourism-Discovery-App--Community-)
- **Django Documentation:** <https://docs.djangoproject.com/>
- **React Documentation:** <https://react.dev/>
- **Vite Documentation:** <https://vite.dev/>
- **PostgreSQL Documentation:** <https://www.postgresql.org/docs/>

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages carefully
3. Check that all prerequisites are installed
4. Verify environment variables are correctly set
5. Ensure both Django and Node.js servers are running for full functionality

## Video

Link to the video: [See video](https://drive.google.com/file/d/1ABf9yYpko9BhnEIvtihVngv9ChbBwcrU/view?usp=sharing)

## Repo Zip File

The zip file for final submission attempt two. [See File](https://drive.google.com/file/d/1QV8LzYvaEaMP6dXQMDF-oTUoQtlLap14/view?usp=sharing)

---

**Last Updated:** March 2026
**Version:** 1.0.0
