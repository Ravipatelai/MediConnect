# 🩺 Doctor Appointment Booking Platform

A full-stack **MERN application** that allows patients to book doctor appointments online, attend video consultations, make payments, and share reviews. Doctors can manage appointments, track earnings, and interact with patients through secure video consultations powered by Jitsi Meet.

## ✨ Features

### 👨‍⚕️ Doctor Dashboard
- View and manage patient appointments.
- Accept or cancel appointment requests.
- Automatically generate Jitsi Meet video consultation links.
- Track earnings from appointments.
- Receive and manage patient reviews.

### 🧑‍💼 Patient Dashboard
- Browse and book appointments with available doctors.
- View upcoming and past appointments.
- Pay online or update payment status where permitted.
- Join video consultations through secure meeting links.
- Submit reviews and ratings after consultations.

### 🔐 Authentication & Security
- Firebase Authentication with email/password and Google sign-in.
- Role-based access control for Patients, Doctors, and Admins.
- HTTP-only cookies for session protection.
- Protected routes and role-based authorization.
- Secure REST API communication.

### 🎥 Video Consultations
- Integration with Jitsi Meet.
- Unique meeting rooms for appointments.
- Convenient online doctor-patient consultations.

### 💳 Payment Management
- Track appointment payment status.
- Record appointment earnings.
- Architecture prepared for future Stripe payment integration.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Tailwind CSS | Responsive styling |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Database modeling |
| Firebase Authentication | User authentication |
| Jitsi Meet | Video consultations |
| Axios | HTTP requests |
| JWT | Token-based authentication |
| Git & GitHub | Version control |

## 📸 Screenshots

<!-- Add your project screenshots to a `screenshots/` folder in the repository.

Update the image paths below to match your actual screenshot filenames.

| Home Page | Appointment Booking |
|---|---|
| ![Home Page](./screenshots/home.png) | ![Appointment Booking](./screenshots/booking.png) |

| Doctor Dashboard | Patient Dashboard |
|---|---|
| ![Doctor Dashboard](./screenshots/doctor-dashboard.png) | ![Patient Dashboard](./screenshots/patient-dashboard.png) | -->

## 📁 Project Structure

```text
Midi/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── screenshots/
├── .gitignore
└── README.md
```

*Note: Adjust the folder structure to match your actual project.*

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB Community Server or a MongoDB Atlas account
- Git
- A Firebase project with Authentication enabled

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/doctor-app.git
cd doctor-app
```

Replace `YOUR_USERNAME/doctor-app` with your actual GitHub repository URL.

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/doctor-app
JWT_SECRET=your_strong_jwt_secret
```

Use the environment variable names expected by your backend code. If you use MongoDB Atlas, replace the local MongoDB URI with your Atlas connection string.

Start the backend:

```bash
npm run dev
```

Make sure the `dev` script is configured in your backend's `package.json`.

### 3. Set Up the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Add any other Firebase configuration variables required by your application.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal, usually:

```text
http://localhost:5173
```

## 🔌 API Endpoints

The following endpoints describe the application's main API operations. Update the paths and HTTP methods to match your implemented backend routes.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/doctor/schedule` | Retrieve doctor appointments |
| PUT | `/doctor/update-status` | Accept or cancel appointments |
| POST | `/doctor/earnings` | Record appointment earnings |
| POST | `/appointment/create` | Create a patient appointment |
| GET | `/patient/appointments` | Retrieve patient appointments |
| POST | `/review` | Submit a doctor review |

### Example API Workflow

1. A patient signs in.
2. The patient selects an available doctor and books an appointment.
3. The backend saves the appointment in MongoDB.
4. The doctor accepts or cancels the request.
5. The application provides a video consultation link for the appointment.
6. After the consultation, the patient submits a review.
7. The application records payment status and appointment earnings.

## 🎥 Video Consultation with Jitsi Meet

Jitsi Meet provides video conferencing functionality for online doctor-patient consultations.

Example meeting URL:

```text
https://meet.jit.si/your-unique-meeting-room
```

In a production application, generate unpredictable room identifiers and verify appointment permissions on the backend. A room name alone does not provide access control. Use appropriate Jitsi configuration or authentication if restricted meetings are required.

## 💰 Payment Integration

The application supports payment-status tracking and appointment earnings management.

**Planned enhancement:** Integrate Stripe to process online payments securely, verify payments on the backend, and update appointment payment status only after confirmation.

## 🚀 Future Enhancements

- [ ] Stripe payment gateway integration.
- [ ] Real-time notifications using Socket.IO.
- [ ] Email appointment confirmations and reminders.
- [ ] Doctor availability calendar.
- [ ] Appointment rescheduling.
- [ ] Advanced search and doctor filtering.
- [ ] Admin dashboard and analytics.
- [ ] Improved video consultation access control.
- [ ] Automated testing and API documentation.

## 🔒 Security Best Practices

- Validate and sanitize incoming API requests.
- Enforce role-based access control on the backend.
- Use secure, HTTP-only cookies with appropriate `SameSite` and `Secure` settings.
- Configure CORS and credential handling correctly.
- Store secrets in environment variables.
- Verify payment events on the server.
- Restrict appointment and review operations to authorized users.
- Never commit production credentials or private keys.

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

## 🙏 Acknowledgements

- [React.js](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase Authentication](https://firebase.google.com/products/auth)
- [Jitsi Meet](https://jitsi.org/)
- [Axios](https://axios-http.com/)

## 👨‍💻 Author

**Ravikant Kumar**

- GitHub: [Ravipatelai](https://github.com/Ravipatelai)
- Portfolio: [Visit Portfolio](https://ravi-patelcom.vercel.app/)
- LinkedIn: [Connect on LinkedIn](https://www.linkedin.com/in/ravikantkumarai/)

---

⭐ If you find this project useful, consider giving the repository a star!

*Built with the MERN stack to simplify doctor appointments and online healthcare consultations.*
