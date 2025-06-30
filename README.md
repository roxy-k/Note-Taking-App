# 📝 Note-Taking App

A web-based application that allows users to sign in with Google or Facebook and create, edit, and delete personal notes. Each user sees only their own notes and can customize the interface style.

---

## 🚀 Features

- ✏️ CRUD operations on notes (Create, Read, Update, Delete)
- 🔐 OAuth Authentication (Google & Facebook)
- 🎨 User preferences: font size, font family, font color, note background
- 🌗 Day/Night mode toggle
- ✅ Toast notifications after saving preferences
- 📊 Stats page (notes count and login time)
- 📱 Responsive UI with Bootstrap
- ⚠️ Error handling for invalid data or failed requests

---

## 🛠 Tech Stack

- Backend: Node.js, Express.js
- Frontend: HTML, CSS, EJS, Bootstrap 5
- Database: MongoDB (via Mongoose)
- Authentication: Passport.js (Google & Facebook strategies)
- Testing: Mocha & Chai

---

## 📁 Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/roxy-k/Note-Taking-App
   cd Note-Taking-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   MONGODB_URI=your_mongodb_uri
   SESSION_SECRET=your_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_secret
   ```

4. Start the app:
   ```bash
   npm start
   ```

5. Open in browser:
   ```
   http://localhost:3000
   ```

---

## 📌 API Endpoints

### Notes
- `GET /notes` – View all notes for current user
- `GET /notes/:id` – View a single note
- `POST /notes` – Create a new note
- `PUT /notes/:id` – Update a note
- `DELETE /notes/:id` – Delete a note

### Preferences
- `GET /preferences` – View UI preferences
- `POST /preferences` – Update UI preferences

---

## ❗ Known Limitations

- No password-based login — only OAuth
- Basic validation (client- and server-side)


---

## 🧠 What I Learned

- How to structure a full-stack Express app
- Working with EJS templates and forms
- Secure OAuth implementation via Passport
- Managing state (preferences) in MongoDB
- Implementing user-based access control

---


