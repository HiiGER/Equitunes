# Frontend (live demo)

This folder runs the Equitunes frontend and is configured to connect to your Supabase instance.

Environment
- Copy or create `.env.local` in this folder with the following Vite variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

Note: The Service Role key (supabase service role) is secret and must never be put into client-side code or committed.

Current project values (already set in `.env.local`):
- Supabase URL: https://ackqlwzwngmaefufimfq.supabase.co
- Supabase anon key: (public anon key)

Database
- The Supabase project currently has no tables. Create the following suggested tables and columns in your Supabase dashboard or using SQL migrations:
  - profiles (id PK, business_name, address, phone, logo_url, created_at, updated_at)
  - genres (id PK, name, description, price_monthly, price_yearly, image_url, preview_track_url, is_active, created_at)
  - tracks (id PK, genre_id FK, title, artist, file_url, duration, album_art_url, created_at)
  - subscriptions (id PK, user_id FK, genre_id FK, start_date, end_date, status, subscription_type, created_at)
  - payments (id PK, user_id FK, subscription_id FK, amount, payment_method, status, transaction_id, invoice_url, created_at)
  - play_history (id PK, user_id FK, track_id FK, played_at)

Auth
- The app uses Supabase Auth. Make sure to enable Email sign-up in your Supabase Auth settings.

Payments
- Payments are mocked for the demo. Do not wire production payment methods until you add server-side logic and secure keys.

Run
- From the `Frontend/` directory:

  npm install
  npm run dev

Support
- If components fail due to missing DB schema, create the tables listed above or adapt the code to match your schema.
