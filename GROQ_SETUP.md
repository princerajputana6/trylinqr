# Groq API Setup for Blog Generation

## What is Groq?

Groq provides fast AI inference for LLMs. TryLinqr uses Groq's API to generate blog content using the Llama 3.3 70B model.

## Setup Instructions

### 1. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign in or create a free account
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. Copy the generated API key (starts with `gsk_`)

### 2. Add to Environment Variables

Open your `.env.local` file and add/update:

```bash
# Groq AI (for blog generation)
GROQ_API_KEY=your_api_key_here
```

### 3. Restart Your Development Server

After updating the `.env.local` file, restart your Next.js server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Troubleshooting

### Error: "Invalid API Key"

**Cause:** Your API key is invalid, expired, or missing.

**Solution:**
1. Check that `GROQ_API_KEY` is set in `.env.local`
2. Verify the key is correct (no extra spaces)
3. Generate a new key from https://console.groq.com/keys
4. Restart your dev server after updating

### Error: "Rate limit exceeded"

**Cause:** You've exceeded Groq's free tier limits.

**Solution:**
- Wait a few minutes and try again
- Upgrade to a paid plan for higher limits
- Check your usage at https://console.groq.com/

### Error: "Groq API key not configured"

**Cause:** The `GROQ_API_KEY` environment variable is not set.

**Solution:**
1. Make sure you have a `.env.local` file in the project root
2. Add the `GROQ_API_KEY=your_key` line
3. Restart the server

## Free Tier Limits

Groq's free tier includes:
- 14,400 requests per day
- 30 requests per minute
- Enough for most small-to-medium sites

## Need Help?

- [Groq Documentation](https://console.groq.com/docs)
- [Groq API Reference](https://console.groq.com/docs/api-reference)
- [Groq Pricing](https://groq.com/pricing/)
