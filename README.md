# Trojan Command Center

Mobile-first USC Trojans football tracker for [usctrojansfb.com](https://usctrojansfb.com).

## Features

- Home: record, AP/Coaches rank, next-game countdown, last result, stat leaders
- Schedule + individual game pages with TV outlet and countdown
- Roster search, position filters, player profiles
- Team and player statistics
- Recruiting class and team ranking

Data: College Football Data API.

## Local setup

```bash
npm install
cp .env.example .env.local
# add CFBD_API_KEY
npm run dev
```

## Deploy

Vercel project with env `CFBD_API_KEY`. Domain: usctrojansfb.com.
