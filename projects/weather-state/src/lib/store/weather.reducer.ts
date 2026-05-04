import { createFeature, createReducer, on } from '@ngrx/store';
import { WeatherActions } from './weather.actions';
import type { CityWeather } from './weather.models';

const row = (city: string): CityWeather => ({
  city,
  temperature: null,
  loading: false,
  error: null,
  lastUpdatedAt: null,
});

const patchCity = (
  s: WeatherState,
  city: string,
  p: Partial<CityWeather>,
): WeatherState => ({
  ...s,
  cityWeatherByName: {
    ...s.cityWeatherByName,
    [city]: { ...(s.cityWeatherByName[city] ?? row(city)), ...p },
  },
});

const initialState = {
  cities: [] as string[],
  citiesLoading: false,
  citiesError: null as string | null,
  refreshAllInFlight: false,
  cityWeatherByName: {} as Record<string, CityWeather>,
};

export type WeatherState = typeof initialState;



export const weatherFeature = createFeature({
  name: 'weather',
  reducer: createReducer(
    initialState,
    on(WeatherActions.loadCities, (state) => ({
      ...state,
      citiesLoading: true,
      citiesError: null,
    })),

    on(WeatherActions.loadCitiesSuccess, (state, { cities }) => {
      const cityWeatherByName = { ...state.cityWeatherByName };
      for (const city of cities)
        cityWeatherByName[city] = cityWeatherByName[city] ?? row(city);
      return {
        ...state,
        cities,
        citiesLoading: false,
        citiesError: null,
        cityWeatherByName,
      };
    }),

    on(WeatherActions.loadCitiesFailure, (state, { error }) => ({
      ...state,
      citiesLoading: false,
      citiesError: error,
    })),

    on(WeatherActions.refreshAll, (state) => ({
      ...state,
      refreshAllInFlight: true,
    })),

    on(WeatherActions.refreshAllFinished, (state) => ({
      ...state,
      refreshAllInFlight: false,
    })),

    on(WeatherActions.temperatureFetchStart, (state, { city }) =>
      patchCity(state, city, { loading: true, error: null }),
    ),

    on(
      WeatherActions.temperatureFetchSuccess,
      (state, { city, temperature, receivedAt }) =>
        patchCity(state, city, {
          loading: false,
          error: null,
          temperature,
          lastUpdatedAt: receivedAt,
        }),
    ),

    on(WeatherActions.temperatureFetchFailure, (state, { city, error }) =>
      patchCity(state, city, { loading: false, error }),
    ),
  ),
});
