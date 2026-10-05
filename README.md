# CONCEPTOR Full Website

## Correct folder structure

Put the project like this:

D:\CAPECODE\
  frontend\
  backend\

DO NOT put backend inside frontend.

## 1. Backend setup

Open CMD:

cd D:\CAPECODE\backend
npm install

Edit .env and set:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/conceptor
JWT_SECRET=use_a_long_random_secret_here
CLIENT_URL=http://localhost:5173

Start MongoDB in another CMD:
mongod

Then backend:
cd D:\CAPECODE\backend
npm run dev

Check: http://localhost:5000/api/health

## 2. Frontend setup

Open another CMD:

cd D:\CAPECODE\frontend
npm install

Create .env from .env.example:
VITE_API_URL=http://localhost:5000/api

Then:
npm run dev

Open http://localhost:5173

## 3. What is persisted

MongoDB stores users, problems, submissions and learning progress.

Each submission stores language, code, output/error, status, exit code and detected concepts. Progress stores run counts, successful runs and concept frequency.

## 4. First run

1. Start mongod.
2. Start backend.
3. Start frontend.
4. Create an account.
5. Login.
6. Open Sandbox and run code.
7. Submission is saved to MongoDB.
8. Dashboard reads the user's real data.
9. Knowledge reads detected concepts from submissions.
