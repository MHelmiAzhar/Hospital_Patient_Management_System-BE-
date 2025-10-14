# Hospital Management System - Backend

This is the backend for a hospital management application, built using Node.js, Express, and Sequelize ORM.

## Main Features

- **User Management**: Registration, login, and user authorization (admin, doctor, patient).
- **Patient Management**: CRUD patient data.
- **Doctor Management**: CRUD doctor data.
- **Appointment Management**: Booking, updating, and managing appointments between patients and doctors.
- **Examination Management**: Recording patient examination results.

## Folder Structure

- `src/controllers/` — API endpoint logic
- `src/routes/` — API route definitions
- `src/services/` — Business logic
- `src/repositories/` — Database queries
- `src/commons/` — Helpers, middleware, and error handling
- `models/` — Sequelize model definitions
- `migrations/` — Database migration files
- `seeders/` — Initial data (seeder)
- `config/` — Database configuration

## Installation & Setup

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd hospital-management/be
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure database**
   - Edit the `config/config.js` file according to your environment (development/production).
4. **Migration & Seeder**
   Run migration and seeder to set up the database:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
5. **Run server**
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file for configuration such as:

```
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Auth

- `POST /api/v1/auth/register-patient` — Register for patient, returns JWT
- `POST /api/v1/auth/login` — Login for all users, returns JWT

### Users

- `POST /api/v1/user/create-doctor` — Create doctor (ADMIN only)
- `PUT /api/v1/user/update-doctor/:user_id` — Update doctor profile (ADMIN or DOCTOR)
- `PUT /api/v1/user/update-patient/:user_id` — Update patient profile (ADMIN or PATIENT)
- `DELETE /api/v1/user/delete-doctor/:user_id` — Delete doctor (ADMIN only)
- `DELETE /api/v1/user/delete-patient/:user_id` — Delete patient (ADMIN or PATIENT)
- `GET /api/v1/user/` — List all users, doctors and patients (ADMIN only)

### Appointments

- `POST /api/v1/appointment` — Create appointment (PATIENT or ADMIN)
- `PUT /api/v1/appointment/:id` — Update appointment (PATIENT or ADMIN)
- `GET /api/v1/appointment` — List appointments, including examination results if any, filtered by logged-in user (pagination, search, filter by date/status)
- `PATCH /api/v1/appointment/:id/status` — Update status (DOCTOR/ADMIN)
- `DELETE /api/v1/appointment/:id` — Delete appointment (ADMIN)

### Examinations

- `POST /api/v1/examination` — Create examination result (DOCTOR or ADMIN)

---

## Data Model (Simplified)

- **User**: user_id, name, email, password, role
- **Patient**: patient_id, user_id (FK), address, birth_date, gender, contact_number
- **Doctor**: doctor_id, user_id (FK), specialization
- **Appointment**: appointment_id, patient_user_id (FK), doctor_user_id (FK), date, status
- **Examination**: examination_id, appointment_id (FK), diagnosis, notes, treatment

---

## Example Request: Create Appointment

```json
{
  "patient_id": 1,
  "doctor_id": 2,
  "date": "2025-10-14T06:00:00.000Z",
  "complaint": "Headache and fever"
}
```

## Example Request: Fill Examination

```json
{
  "appointment_id": 101,
  "diagnosis": "Hypertension",
  "notes": "Patient is advised to have regular check-ups and a low-salt diet."
}
```

---

## Pagination Response Example

```json
{
  "pagination": {
    "totalItems": 15,
    "totalPages": 8,
    "currentPage": 1,
    "itemsPerPage": 2
  },
  "users": [ ... ]
}
```

---

## Technology

- Node.js
- Express
- Sequelize
- MySQL/PostgreSQL
- JWT (JSON Web Token)

## Contribution

Pull requests and issues are welcome for further development.

## License

MIT
