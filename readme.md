# 💸 Pension Payment App

A Node.js RESTful API for managing pension transactions, user authentication, and admin oversight. Built with Express and MongoDB. Includes test coverage reports using Mocha, Chai, and NYC.

---

## 🚀 Features

- 👥 User registration & login with JWT authentication  
- 👮 Admin role with privileged access to all users and transactions  
- 💰 Transaction initiation, approval (with auto-payments), and rejection  
- 🔁 Auto-payment cron job triggered every 3 minutes  
- 📄 Full CRUD for transactions  
- 🧪 Unit tests with Mocha + Chai  
- 📊 Code coverage reporting with NYC  

---

## 📁 Project Structure

```
honorPay/
├── src/
│   ├── app.js              # Express app setup
│   ├── models/             # Mongoose models (User, Transaction)
│   ├── controllers/        # Route controller logic
│   ├── routes/             # API routes
│   ├── middleware/         # JWT and role-based auth
├── tests/                  # Mocha & Chai test files
├── coverage/               # NYC coverage reports
├── index.js                # Server + MongoDB + cron setup
├── .env                    # Environment variables
```

---

## 🧪 Running Tests

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run with coverage report:

```bash
npm run coverage
```

View HTML report:

```bash
open coverage/index.html
```

---

## 🛠️ Environment Variables (`.env`)

```
PORT=3001
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
```

---

## ✅ Test Coverage Summary

Example output:

```
Statements   : 75% (186/248)
Branches     : 56.71%
Functions    : 69.56%
Lines        : 76.85%
```

HTML report available at: `./coverage/index.html`

---

## 📬 API Endpoints

### 🔐 Auth

- `POST /api/user/register` – Register user (with image)
- `POST /api/user/login` – Login and get token

### 👥 Users

- `GET /api/user` – Get all users (admin)
- `GET /api/user/:id` – Get user by ID
- `PUT /api/user/:id` – Update user
- `DELETE /api/user/:id` – Delete user

### 💰 Transactions

- `POST /api/transactions` – Initiate transaction (user)
- `GET /api/transactions/my` – Get my transactions (user)
- `GET /api/transactions` – Get all transactions (admin)
- `PUT /api/transactions/:id/approve` – Approve transaction (admin)
- `PUT /api/transactions/:id/reject` – Reject transaction (admin)
- `DELETE /api/transactions/user/:userId` – Delete user’s transactions (admin)

---

## 📅 Cron Job

- Runs every 3 minutes
- Automatically creates follow-up payments (up to 5) after approval

---

## 🧑‍💻 Tech Stack

- **Backend**: Node.js, Express  
- **Database**: MongoDB (Mongoose)  
- **Auth**: JWT  
- **Testing**: Mocha, Chai, NYC  
- **Cron**: node-cron  

---

## 📄 License

MIT

---

## 🤝 Contributors

- **Clement Pascal Nshimiye Rugwiro** – Developer & Maintainer
