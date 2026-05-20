# Sprage Backend (NestJS + MongoDB)

A user-centric backend for learning idioms, vocabulary, and grammar using a Spaced Repetition System (SRS).

## What the App Does

Sprage helps users study language content — idioms, vocabulary, and grammar — through flashcards scheduled with a spaced repetition algorithm. Each user has their own private collection of decks and cards, and the system decides when each card should be reviewed next based on how well the user remembers it.

## Key Features

- **User Accounts**: Each user has an isolated workspace with their own decks, cards, and review history.
- **Flexible Card Content**: Cards support arbitrary fields beyond the base schema, allowing heterogeneous learning material (vocab, grammar, idioms) with varied metadata.
- **Decks / Collections**: Cards can be organized into decks for structured study.
- **Spaced Repetition Engine**: Implements the SM-2 algorithm to compute the next review date for each card based on recall quality.
- **Bulk Content Loading**: Supports importing pre-built card sets into a user's account.

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB Atlas (Mongoose)
- **Security**: Passport-JWT, Bcrypt
- **Language**: TypeScript
