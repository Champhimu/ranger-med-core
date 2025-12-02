---

# Database Schema — Ranger Med-Core

## 1. **Users**

| Field       | Type     | Notes                                        |
| ----------- | -------- | -------------------------------------------- |
| _id         | ObjectId | Primary Key                                  |
| name        | String   | Full name of Ranger/Doctor/Admin             |
| email       | String   | Unique email                                 |
| password    | String   | Hashed password                              |
| role        | String   | `ranger` / `doctor` / `admin`                |
| created_at  | Date     | Record creation timestamp                    |
| modified_at | Date     | Last modified timestamp                      |
| created_by  | ObjectId | User who created the record (optional)       |
| modified_by | ObjectId | User who last modified the record (optional) |

---

## 2. **Capsules**

| Field       | Type        | Notes                         |
| ----------- | ----------- | ----------------------------- |
| _id         | ObjectId    | Primary Key                   |
| user_id     | ObjectId    | Reference to `users._id`      |
| name        | String      | Capsule name                  |
| dosage      | String      | Dosage amount                 |
| frequency   | Number      | Times per day                 |
| schedule    | Array[Date] | Array of scheduled dose times |
| created_at  | Date        | Record creation timestamp     |
| modified_at | Date        | Last modified timestamp       |

---

## 3. **Dose Logs**

| Field       | Type     | Notes                          |
| ----------- | -------- | ------------------------------ |
| _id         | ObjectId | Primary Key                    |
| capsule_id  | ObjectId | Reference to `capsules._id`    |
| timestamp   | Date     | Time of the dose               |
| status      | String   | `taken` / `missed` / `snoozed` |
| created_at  | Date     | Record creation timestamp      |
| modified_at | Date     | Last modified timestamp        |

---

## 4. **Symptoms**

| Field       | Type     | Notes                                  |
| ----------- | -------- | -------------------------------------- |
| _id         | ObjectId | Primary Key                            |
| user_id     | ObjectId | Reference to `users._id`               |
| type        | String   | Symptom type (e.g., fatigue, headache) |
| severity    | Number   | Scale 1–5                              |
| notes       | String   | Optional notes                         |
| timestamp   | Date     | Time symptom was logged                |
| created_at  | Date     | Record creation timestamp              |
| modified_at | Date     | Last modified timestamp                |

---

## 5. **Appointments**

| Field       | Type     | Notes                                    |
| ----------- | -------- | ---------------------------------------- |
| _id         | ObjectId | Primary Key                              |
| user_id     | ObjectId | Reference to `users._id`                 |
| doctor_id   | ObjectId | Reference to `users._id` (role = doctor) |
| datetime    | Date     | Scheduled appointment time               |
| status      | String   | `scheduled` / `completed` / `canceled`   |
| created_at  | Date     | Record creation timestamp                |
| modified_at | Date     | Last modified timestamp                  |

---

## 6. **AI Insights**

| Field       | Type     | Notes                     |
| ----------- | -------- | ------------------------- |
| _id         | ObjectId | Primary Key               |
| user_id     | ObjectId | Reference to `users._id`  |
| message     | String   | User query sent to AI     |
| response    | String   | AI response               |
| created_at  | Date     | Record creation timestamp |
| modified_at | Date     | Last modified timestamp   |

---

## 7. **Notifications**

| Field       | Type     | Notes                         |
| ----------- | -------- | ----------------------------- |
| _id         | ObjectId | Primary Key                   |
| user_id     | ObjectId | Reference to `users._id`      |
| title       | String   | Notification title            |
| body        | String   | Notification message          |
| type        | String   | `reminder` / `alert` / `info` |
| status      | String   | `sent` / `read`               |
| created_at  | Date     | Record creation timestamp     |
| modified_at | Date     | Last modified timestamp       |

---

## 8. **Timeline Events**

| Field        | Type     | Notes                                                              |
| ------------ | -------- | ------------------------------------------------------------------ |
| _id          | ObjectId | Primary Key                                                        |
| user_id      | ObjectId | Reference to `users._id`                                           |
| type         | String   | `dose` / `symptom` / `appointment`                                 |
| reference_id | ObjectId | Links to relevant record (`dose_logs`, `symptoms`, `appointments`) |
| timestamp    | Date     | Event time                                                         |
| created_at   | Date     | Record creation timestamp                                          |
| modified_at  | Date     | Last modified timestamp                                            |

---

## 9. **Prediction History**

| Field       | Type     | Notes                                 |
| ----------- | -------- | ------------------------------------- |
| _id         | ObjectId | Primary Key                           |
| user_id     | ObjectId | Reference to `users._id`              |
| capsule_id  | ObjectId | Reference to `capsules._id`           |
| probability | Number   | Predicted chance of missing next dose |
| risk_level  | String   | `low` / `medium` / `high`             |
| created_at  | Date     | Record creation timestamp             |
| modified_at | Date     | Last modified timestamp               |

---
