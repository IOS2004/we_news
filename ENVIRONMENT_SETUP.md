# Environment Setup

## Required Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

### Environment Variables

- `EXPO_PUBLIC_NEWS_API_KEY`: Your API key from thenewsapi.com
- `EXPO_PUBLIC_NEWS_API_BASE_URL`: Base URL for the news API (default: https://api.thenewsapi.com/v1)
- `EXPO_PUBLIC_API_BASE_URL`: Your backend API URL (default: https://wenews.onrender.com/api)
- `NODE_ENV`: Environment (development/production)

### Getting API Keys

1. **News API**: Register at [thenewsapi.com](https://thenewsapi.com) to get your API key
2. **Backend API**: Update the URL if you're using a different backend server

### Security Notes

- **NEVER** commit `.env` files to version control
- **NEVER** hardcode API keys in source code
- Use `EXPO_PUBLIC_` prefix for variables that need to be accessible in the client
- The `.env` file is already added to `.gitignore`

### Development

After setting up your `.env` file, restart your development server:

```bash
npm start
```
