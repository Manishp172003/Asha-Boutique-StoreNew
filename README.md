# Asha Boutique Store

A full-stack e-commerce application for Asha Boutique, featuring a modern React frontend and Spring Boot backend.

## Project Structure

This is a monorepo containing:

- **frontend/** - React + Vite frontend application
- **backend/** - Spring Boot REST API backend

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Shadcn/ui components
- React Hook Form + Zod validation
- Sonner (toast notifications)
- Google OAuth integration

### Backend
- Spring Boot 3.x
- Spring Security with JWT
- PostgreSQL database
- Maven for dependency management
- RESTful API architecture

## Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Asha-Boutique-Store
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Configure your database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ashaboutique
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
```

Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Environment Variables

### Backend
Configure in `src/main/resources/application.properties`:
- Database connection details
- JWT secret key
- Google OAuth client ID

### Frontend
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/google` - Google OAuth login

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/{id}` - Update product (Admin)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update cart item
- `DELETE /api/v1/cart/remove` - Remove item from cart

## Running Tests

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your production domain
6. Add authorized redirect URIs if needed
7. Copy the Client ID to your frontend `.env` file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software for Asha Boutique.

## Support

For support, please contact the development team.