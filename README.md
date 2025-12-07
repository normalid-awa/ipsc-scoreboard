# Development Setup
1. run `npm install` in the root directory.
2. Generate SSL certificate and place `server.crt`, `server.key` and `ca.crt` files in the root directory.
> You can use `generateDevCert.cmd` to generate the SSL certificate.
3. Create a `.env.development` file in the each app directory and add the env var following each app's README.
4. Run `npm run dev:api` to start the development api server.
5. Run `npm run dev:web` to start the development web server.

# Server-side setup

# Client-side setup

# Deployment
## Frontend
### Cloudflare worker
1. Create a cloudflare worker.
2. Fill in the client side environment variable in **build time environment variable**
3. Fill in the server side environment variable in **runtime environment variable**

# Contributing
1. Commit messages should follow the [conventional commit standard](https://www.conventionalcommits.org/en/v1.0.0/).
