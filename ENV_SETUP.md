# Environment Configuration Management

## Local Development

### Frontend (.env.local)

```
VITE_API_BASE_URL=http://localhost:5005
```

### Backend (.env)

```
PORT=5005
DATABASE_URL="file:./dev.db"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
GITHUB_TOKEN=your_token_here
GITHUB_USERNAME=your_username
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
NODE_ENV=development
```

## Production Deployment

### Netlify (Frontend)

Set environment variables in Netlify dashboard:

- `VITE_API_BASE_URL` → Your Railway backend URL
- `NODE_ENV` → `production`

### Railway (Backend)

Set environment variables in Railway dashboard:

- `DATABASE_URL` → PostgreSQL connection string
- `CORS_ORIGIN` → Your Netlify frontend URL
- `GITHUB_TOKEN` → Your GitHub PAT
- `GITHUB_USERNAME` → Your GitHub username
- `EMAIL_USER` → Sender email address
- `EMAIL_PASSWORD` → Gmail app password
- `NODE_ENV` → `production`
- `PORT` → 8080 (default)

## Security Notes

1. **Never commit `.env` files** - they contain secrets
2. **Use GitHub Secrets** for CI/CD workflows
3. **Email passwords**: Use Gmail App Passwords (2FA required)
4. **GitHub Token**: Generate with `repo` scope only
5. **Rotate tokens regularly** and revoke old ones

## Environment Variables Reference

| Variable            | Purpose                   | Required | Example                                       |
| ------------------- | ------------------------- | -------- | --------------------------------------------- |
| `VITE_API_BASE_URL` | Backend API URL           | Frontend | `https://api.example.com`                     |
| `DATABASE_URL`      | PostgreSQL connection     | Backend  | `postgresql://user:pass@host/db`              |
| `CORS_ORIGIN`       | Allowed frontend URLs     | Backend  | `https://example.com,https://www.example.com` |
| `GITHUB_TOKEN`      | GitHub API authentication | Backend  | `ghp_xxxxx...`                                |
| `GITHUB_USERNAME`   | GitHub username for sync  | Backend  | `ardidrizi`                                   |
| `EMAIL_USER`        | Sender email address      | Backend  | `your@gmail.com`                              |
| `EMAIL_PASSWORD`    | Gmail app password        | Backend  | `xxxx xxxx xxxx xxxx`                         |
| `NODE_ENV`          | Environment mode          | Both     | `production` or `development`                 |
| `PORT`              | Server port               | Backend  | `5005` or `8080`                              |
