# Trojan Command Center

Mobile-first USC Trojans football tracker for [usctrojansfb.com](https://usctrojansfb.com).

## Local setup

```bash
npm install
cp .env.example .env.local
# add your CFBD_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

## Deploy

1. Import this repo in Vercel
2. Add env var `CFBD_API_KEY`
3. Point usctrojansfb.com at the Vercel project
