# Deployment Guide

## Netlify Deployment

This guide explains how to deploy ArabTree to Netlify.

### Prerequisites

Before deploying, ensure you have:

1. A MongoDB database (MongoDB Atlas recommended)
2. A Netlify account
3. Environment variables configured

### Environment Variables

Configure the following environment variables in Netlify:

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/arabtree` |
| `NEXTAUTH_SECRET` | ✅ | Random string for session encryption | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Base URL of your deployed app | `https://your-app.netlify.app` |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID (if using Google auth) | — |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret (if using Google auth) | — |

### Deployment Steps

#### Option 1: Deploy via Netlify Dashboard

1. **Connect Repository**
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npx prisma generate && npm run build` (already configured in `netlify.toml`)
   - Publish directory: Leave empty (Netlify auto-detects Next.js)
   
3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all required environment variables from the table above

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

#### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify project
netlify init

# Set environment variables
netlify env:set DATABASE_URL "your-mongodb-url"
netlify env:set NEXTAUTH_SECRET "your-secret"
netlify env:set NEXTAUTH_URL "https://your-app.netlify.app"

# Deploy
netlify deploy --prod
```

### Build Configuration

The build configuration is defined in `netlify.toml`:

```toml
[build]
  command = "npx prisma generate && npm run build"
```

This ensures:
- Prisma Client is generated before the build
- Next.js optimized production build is created

### Troubleshooting

#### 502 Bad Gateway Error

If you encounter a 502 error:

1. **Check build logs**: Look for build failures in the Netlify dashboard
2. **Verify environment variables**: Ensure all required variables are set
3. **Check database connection**: Verify your DATABASE_URL is correct and accessible
4. **Review function logs**: Check Netlify Functions logs for runtime errors

#### Build Failures

Common build issues:

- **Prisma Client not generated**: Ensure the postinstall script runs (`npm install` generates the client)
- **TypeScript errors**: Fix any TypeScript compilation errors
- **Missing dependencies**: Run `npm install` locally to verify all dependencies are installed

#### Database Connection Issues

- Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Netlify's IP ranges
- Verify the DATABASE_URL format is correct
- Check that the database user has proper permissions

### Post-Deployment

After successful deployment:

1. **Initialize Database**
   - If this is the first deployment, you may need to seed the database
   - You can run Prisma migrations/seeds from your local machine connected to the production database

2. **Test Authentication**
   - Try logging in to verify NextAuth is working
   - Test Google OAuth if configured

3. **Monitor Performance**
   - Check Netlify Analytics for performance metrics
   - Monitor function execution times

### Continuous Deployment

Netlify automatically deploys when you push to your main branch. To customize:

1. Go to Site settings → Build & deploy → Deploy contexts
2. Configure which branches trigger deployments
3. Set up deploy previews for pull requests

### Custom Domain

To use a custom domain:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

## Other Deployment Platforms

### Vercel

ArabTree can also be deployed to Vercel:

1. Import your repository in Vercel
2. Add environment variables
3. Deploy

The build will work automatically as Vercel has native Next.js support.

### Docker

For self-hosting, you can use Docker:

```bash
# Build the image
docker build -t arabtree .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-mongodb-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  arabtree
```

Note: You'll need to create a `Dockerfile` first.

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/z3by/arabtree/issues)
2. Review Netlify's [Next.js deployment guide](https://docs.netlify.com/frameworks/next-js/)
3. Open a new issue if your problem isn't covered
