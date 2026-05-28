# Hostel Management System (MySQL)

Production-style full-stack web app for hostel discovery and owner listings.

## Tech Stack

- Frontend: React + Vite + Bootstrap + custom modern CSS
- Backend: Node.js + Express
- Database: MySQL
- Authentication: JWT + bcrypt
- Maps: Leaflet + OpenStreetMap

## Core Features

- User and owner signup/login
- JWT protected routes
- Owner dashboard:
  - Create, update, delete own hostels
  - View subscription status
  - Listing blocked unless active subscription exists
- User flow:
  - Search/filter hostels by city, area, room type, rent
  - View hostel details with map, rooms, facilities
  - Save/remove favorites
  - Profile page with saved hostels

## Project Structure

- Frontend: `src/` (pages, layouts, components, API client)
- Backend: `server/` (routes, middleware, db access, schema)

## Setup

1. Install frontend dependencies:
	- `npm install`
2. Install backend dependencies:
	- `npm --prefix server install`
3. Configure backend env:
	- Copy `server/.env.example` to `server/.env`
	- Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
4. Initialize database:
	- Run `server/schema.sql` in MySQL
5. Start backend:
	- `npm --prefix server run dev`
6. Start frontend:
	- `npm run dev`

Frontend runs on `http://localhost:5173` and proxies `/api` to backend `http://localhost:5000`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/hostels`
- `GET /api/hostels/:id`
- `GET /api/hostels/owner/mine` (owner)
- `POST /api/hostels` (owner + active subscription)
- `PUT /api/hostels/:id` (owner)
- `DELETE /api/hostels/:id` (owner)
- `GET /api/users/me`
- `GET /api/users/favorites`
- `POST /api/users/favorites/:hostelId`
- `DELETE /api/users/favorites/:hostelId`
- `GET /api/subscriptions/me`

## Optional Payments

Current flow supports manual owner subscription submission via JazzCash/EasyPaisa endpoints.
Stripe can be integrated later by replacing the subscription payment handler.
