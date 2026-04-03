# Sprage Backend (NestJS + MongoDB)

A powerful, flexible, and user-centric backend for learning idioms, vocabulary, and grammar using a Spaced Repetition System (SRS).

## Key Features

- **User Authentication**: Secure JWT-based login and registration.
- **Flexible Card Schema**: Save any fields you want on a card (it will be saved to Mongo even if not in the schema).
- **Decks/Collections**: Organize your cards into decks.
- **SRS Engine**: Uses the SM-2 algorithm to calculate next review dates.
- **Bulk Import**: Import your existing `unified_data.json` directly into your account.

---

## 🚀 API Guide

### 1. Authentication
First, register or login to get your `access_token`.

**POST `/auth/register`**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "username": "learning_king"
}
```

---

### 2. Creating Cards (Manual)
You can create a card and save it directly to MongoDB. Any extra fields you add (like `difficulty`, `pronunciation`, `image_url`) will be saved automatically due to our flexible schema.

**POST `/cards`**
*Headers: `Authorization: Bearer <your_token>`*
```json
{
  "front": "to kick the bucket",
  "back": "to die",
  "type": "idiom",
  "tags": ["slang", "informal"],
  "example": "He finally kicked the bucket at age 90.",
  "any_other_field": "This will also be saved in Mongo!"
}
```

---

### 3. Bulk Import
If you have a `unified_data.json` in the root folder, you can import it to your account.

**POST `/cards/import`**
*Headers: `Authorization: Bearer <your_token>`*

---

### 4. Learning with SRS (Spaced Repetition)
Once you have cards, you can review them. The system will tell you when a card is "due".

**GET `/progress/due`**
*Headers: `Authorization: Bearer <your_token>`*
Returns all cards that are ready to be reviewed today.

**POST `/progress/review`**
*Headers: `Authorization: Bearer <your_token>`*
Submit your review quality (0-5) to update the card's next review date.
- `0`: Total blackout.
- `3`: Correct with difficulty.
- `5`: Perfect response.
```json
{
  "cardId": "65e...",
  "quality": 4
}
```

---

## 🛠️ Tech Stack
- **Framework**: NestJS
- **Database**: MongoDB Atlas (Mongoose)
- **Security**: Passport-JWT, Bcrypt
- **Language**: TypeScript
