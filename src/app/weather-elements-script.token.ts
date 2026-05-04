import { InjectionToken } from '@angular/core';

declare global {
  interface Window {
    __WEATHER_ELEMENTS_URL__?: string;
  }
}

export function weatherElementsScriptUrl(): string {
  const fromWindow = typeof window !== 'undefined' ? window.__WEATHER_ELEMENTS_URL__ : undefined;
  if (fromWindow?.trim()) return fromWindow.trim();
  return 'http://localhost:4202/main.js';
}

export const WEATHER_ELEMENTS_SCRIPT_URL = new InjectionToken<string>('WEATHER_ELEMENTS_SCRIPT_URL', {
  providedIn: 'root',
  factory: weatherElementsScriptUrl,
});
