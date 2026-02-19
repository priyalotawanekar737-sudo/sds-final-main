# Smart Donation System - Backend (Demo)
## Quick start
1. Install Node.js (16+)
2. Open backend folder and run:
   ```bash
   npm install
   cp .env.example .env
   # edit .env if needed
   npm run seed   # optional - creates demo users and a donation
   npm run dev    # or npm start
   ```
3. API endpoints:
   - `POST /api/auth/register` {name,email,password,role,city,pincode}
   - `POST /api/auth/login` {email,password}
   - `GET /api/donations`
   - `POST /api/donations` (auth header required)
   - `POST /api/donations/:id/accept` (auth)
   - `POST /api/donations/:id/status` (auth)
