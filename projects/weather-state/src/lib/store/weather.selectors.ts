import { createSelector } from '@ngrx/store';
import type { CityWeather } from './weather.models';
import { weatherFeature } from './weather.reducer';

export const {
  selectCities,
  selectCitiesLoading,
  selectCitiesError,
  selectCityWeatherByName,
  selectRefreshAllInFlight,
} = weatherFeature;


export const selectCityCardsVm = createSelector(
  selectCities,
  selectCityWeatherByName,
  (cities, byName: Record<string, CityWeather>) =>
    cities.map((city) => {
      const w = byName[city];
      return {
        city,
        temperature: w?.temperature ?? null,
        loading: w?.loading ?? false,
        errorMessage: w?.error ?? null,
        lastUpdatedAt: w?.lastUpdatedAt ?? null,
      };
    }),
);
