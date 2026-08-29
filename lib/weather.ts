import { findVenue } from "./cfbd";
import type { Game, Venue } from "./types";

// Open-Meteo is free and keyless. Its forecast only reaches ~16 days out —
// a kickoff beyond that (or already in the past) has no hourly match, which
// callers should treat the same as "no forecast available" rather than an
// error.
const FORECAST_DAYS = 16;
// Forecasts move a few times a day, not every minute like live scores — no
// need for CACHE.LIVE-style 60s revalidation here.
const WEATHER_REVALIDATE = 60 * 60;

export type KickoffWeather = {
  tempF: number;
  precipChance: number;
  windMph: number;
};

type OpenMeteoResponse = {
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
  };
};

export async function getKickoffWeather(
  latitude: number,
  longitude: number,
  kickoffIso: string
): Promise<KickoffWeather | null> {
  const kickoff = new Date(kickoffIso);
  const daysOut = (kickoff.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysOut < 0 || daysOut > FORECAST_DAYS) return null;

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("hourly", "temperature_2m,precipitation_probability,wind_speed_10m");
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("timezone", "UTC");
    url.searchParams.set("forecast_days", String(FORECAST_DAYS));

    const res = await fetch(url, { next: { revalidate: WEATHER_REVALIDATE } });
    if (!res.ok) {
      console.warn(`[weather] forecast request failed: ${res.status}`);
      return null;
    }

    const data = (await res.json()) as OpenMeteoResponse;
    const hourly = data.hourly;
    if (!hourly) return null;

    // Kickoff rounded down to the hour, formatted to match Open-Meteo's
    // "YYYY-MM-DDTHH:00" UTC time strings exactly.
    const target = new Date(kickoff);
    target.setUTCMinutes(0, 0, 0);
    const targetKey = `${target.toISOString().slice(0, 13)}:00`;
    const index = hourly.time.indexOf(targetKey);
    if (index === -1) return null;

    return {
      tempF: Math.round(hourly.temperature_2m[index]),
      precipChance: Math.round(hourly.precipitation_probability[index]),
      windMph: Math.round(hourly.wind_speed_10m[index]),
    };
  } catch (err) {
    console.warn("[weather] forecast fetch threw", err);
    return null;
  }
}

// Resolves a game's venue (by name, against CFBD's /venues list) and fetches
// its kickoff forecast. Returns null — not an error — for anything that
// makes weather meaningless: a completed game, a TBD kickoff time, no venue
// on record, an unmatched/domed venue, or a kickoff outside Open-Meteo's
// forecast window.
export async function weatherForGame(game: Game, venues: Venue[]): Promise<KickoffWeather | null> {
  if (game.completed || game.startTimeTbd || !game.venue) return null;

  const venue = findVenue(venues, game.venue);
  if (!venue || venue.dome || venue.latitude == null || venue.longitude == null) return null;

  return getKickoffWeather(venue.latitude, venue.longitude, game.startDate);
}

export function formatWeather(w: KickoffWeather): string {
  return `${w.tempF}°F · ${w.precipChance}% rain · ${w.windMph} mph wind`;
}
