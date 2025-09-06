# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

EcoSwap is a sustainable marketplace application with blockchain-powered ownership tracking. It consists of a React/TypeScript frontend with a Node.js/Express backend, MySQL database, and Ethereum smart contracts for product ownership verification.

## Development Commands

### Backend Commands
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run database migrations
npm run migrate

# Environment setup
cp .env.example .env
# Edit .env with your database credentials and configuration
```

### Frontend Commands
```bash
# Navigate to frontend directory  
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Database Setup
```bash
# Start MySQL server (ensure MySQL is installed)
# Create database and run migrations from backend directory
cd backend
npm run migrate
```

## Architecture Overview

### Backend Architecture (Node.js/Express)
- **Entry Point**: `server.js` initializes the application and handles database connections
- **Application Logic**: `app.js` configures middleware, routing, and security
- **Database Layer**: MySQL with connection pooling via `mysql2/promise`
- **Models**: Class-based models in `/models/` (User, Product, Cart, Order)
- **Routes**: RESTful API endpoints in `/routes/` for auth, products, orders, cart, recommendations, blockchain
- **Blockchain Integration**: Smart contract interaction via `web3` and `ethers` libraries
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Security**: Helmet, CORS, rate limiting, input validation with Joi

### Frontend Architecture (React/TypeScript)
- **Framework**: Vite + React 18 + TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom eco-themed color palette
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: React Router DOM with protected routes
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with SWC for fast compilation

### Smart Contract Architecture (Solidity)
- **Contract**: `ProductOwnership.sol` deployed on Polygon network
- **Features**: Product registration, ownership transfers, ownership history tracking
- **Security**: OpenZeppelin contracts for access control and reentrancy protection
- **Events**: Comprehensive event logging for frontend integration

### Database Schema
- **Users**: Authentication and profile data
- **Products**: Marketplace items with seller relationships and blockchain IDs
- **Orders/Order Items**: Purchase transaction records
- **Carts**: Shopping cart functionality
- **Ownership History**: Blockchain transaction tracking

## Key Integration Points

### Frontend-Backend Communication
- API calls use axios with TanStack Query for caching and error handling
- Base API URL configured for development (`localhost:5000`)
- JWT tokens stored and managed for authenticated requests

### Backend-Blockchain Integration  
- Smart contract deployment and interaction via Web3/Ethers
- Product ownership verification and transfer tracking
- Event listening for blockchain state changes

### Database-Blockchain Sync
- Blockchain ownership IDs stored in products table
- Ownership history tracked both on-chain and in database
- Transaction hashes recorded for audit trail

## Development Workflow

### Running Full Stack Locally
1. Start MySQL database server
2. Backend: `cd backend && npm run dev` (runs on port 5000)
3. Frontend: `cd frontend && npm run dev` (runs on port 8080)
4. Access application at `http://localhost:8080`

### Testing API Endpoints
- Health check: `GET /api/health`
- Authentication: `POST /api/auth/login`, `POST /api/auth/register`
- Products: `GET /api/products`, `POST /api/products`, etc.

### Smart Contract Development
- Contracts located in `/backend/contracts/`
- Uses OpenZeppelin for security patterns
- Configured for Polygon testnet deployment

## Environment Configuration

### Backend Environment Variables
Key variables needed in `.env`:
- Database connection: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- JWT secrets: `JWT_SECRET`, `JWT_REFRESH_SECRET`
- Blockchain RPC: `BLOCKCHAIN_RPC_URL`, `BLOCKCHAIN_CONTRACT_ADDRESS`
- Security: `BCRYPT_ROUNDS`, rate limiting settings

### Frontend Configuration
- Development server runs on port 8080
- API proxy configuration in `vite.config.ts`
- Path aliases configured: `@/*` maps to `./src/*`

## Common Issues and Solutions

### Database Connection Issues
- Ensure MySQL server is running
- Verify credentials in `.env` file
- Run migrations: `npm run migrate`

### Frontend Build Issues  
- Check TypeScript configuration in `tsconfig.json`
- Verify all dependencies are installed
- Clear node_modules and reinstall if needed

### Blockchain Integration
- Ensure correct RPC URL for target network
- Verify contract deployment and addresses
- Check wallet connection for transaction signing
