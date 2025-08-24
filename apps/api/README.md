```
npm install
npm run dev
```

```
open http://localhost:3000
```

# Env template
```env
NODE_ENV=development

FRONTEND_URL=

BETTER_AUTH_URL=
BETTER_AUTH_SECRET=A

DATABASE_URL=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=

AUTH_MICROSOFT_ENTRA_ID_ID=
# AUTH_MICROSOFT_ENTRA_ID_ISSUER=
AUTH_MICROSOFT_ENTRA_ID_ISSUER=
AUTH_MICROSOFT_ENTRA_ID_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

SMTP_EMAIL_VERIFY_FROM=
```

# SOP

## Changing better-auth schema
1. Change the better-auth adaptor to `pg`
2. Run `npm run auth:generate`
3. Run the generated migration sql file in the database
4. Change the adaptor back to `mikroOrmAdapter`

