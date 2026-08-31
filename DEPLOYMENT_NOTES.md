# Deployment Notes

These notes describe the release state intended for the tagged fork.

## What this fork expects

- Brevo for transactional email
- Supabase for PostgreSQL
- Railway or Render for hosting the web service

## Required environment values

Set the following values for production:

- `NEXTAUTH_SECRET`
- `NEXT_PRIVATE_ENCRYPTION_KEY`
- `NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY`
- `NEXT_PUBLIC_WEBAPP_URL`
- `NEXT_PRIVATE_INTERNAL_WEBAPP_URL`
- `NEXT_PRIVATE_DATABASE_URL`
- `NEXT_PRIVATE_DIRECT_DATABASE_URL`
- `NEXT_PRIVATE_SMTP_TRANSPORT=brevo`
- `NEXT_PRIVATE_BREVO_API_KEY`
- `NEXT_PRIVATE_SMTP_FROM_NAME`
- `NEXT_PRIVATE_SMTP_FROM_ADDRESS`

Do not commit real secrets. Keep only placeholder values in `.env.example`.

## Supabase database setup

Use the Supabase dashboard under Settings > Database > Connection string.

- `NEXT_PRIVATE_DATABASE_URL`: use the pooled connection string
- `NEXT_PRIVATE_DIRECT_DATABASE_URL`: use the direct connection string

This matches the existing Supabase guidance in the self-hosting database docs.

## Brevo email setup

Set the email transport to Brevo and provide the Brevo API key.

- `NEXT_PRIVATE_SMTP_TRANSPORT=brevo`
- `NEXT_PRIVATE_BREVO_API_KEY=<placeholder>`
- `NEXT_PRIVATE_SMTP_FROM_NAME=<sender name>`
- `NEXT_PRIVATE_SMTP_FROM_ADDRESS=<sender address>`

## Railway deployment

The repository already includes `railway.toml`, which points Railway at the Dockerfile:

```toml
[build]

builder = "DOCKERFILE"
dockerfilePath = "/docker/Dockerfile"
```

For Railway, deploy the repo, attach a PostgreSQL service or point the app at Supabase, and set the variables above.

## Render deployment

The repository already includes `render.yaml`, which defines the web service build and start commands:

```yaml
buildCommand: npm ci --include=dev && npm run build
startCommand: npx prisma migrate deploy --schema packages/prisma/schema.prisma && npx turbo run start --filter=@documenso/remix
```

For Render, create the web service from this repo, connect Supabase or another PostgreSQL instance, and set the same environment variables.

## Reproducibility checklist

- Deploy from the tagged commit that matches production
- Keep the public source in sync with any hotfixes
- Keep build and migration commands in the repo
- Keep deployment variables documented in this file and `.env.example`