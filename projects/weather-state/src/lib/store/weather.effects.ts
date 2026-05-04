import { Injectable, inject } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { WeatherService } from 'weather-data';
import { catchError, endWith, filter, from, map, merge, mergeMap, of, retry, startWith, switchMap, take, timer } from 'rxjs';
import { WeatherActions } from './weather.actions';
import { selectCities } from './weather.selectors';

@Injectable()
export class WeatherEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly weatherService = inject(WeatherService);

  // load cities
  init$ = createEffect(() => this.actions$.pipe(ofType(ROOT_EFFECTS_INIT), map(() => WeatherActions.loadCities())));

  // Load cities from service
  loadCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WeatherActions.loadCities),
      switchMap(() =>
        this.weatherService.getCities().pipe(
          map((cities) => WeatherActions.loadCitiesSuccess({ cities })),
          catchError((err: unknown) =>
            of(WeatherActions.loadCitiesFailure({ error: String(err) }))
          )
        )
      )
    )
  );

  // After cities load -> initial refresh
  afterCitiesLoaded$ = createEffect(() =>
    this.actions$.pipe(ofType(WeatherActions.loadCitiesSuccess), map(() => WeatherActions.refreshAll({ source: 'init' })))
  );

  // Refresh All: cancel previous batch, run up to 3 requests at a time
  refreshAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WeatherActions.refreshAll),
      switchMap(() =>
        this.citiesOnce$().pipe(
          switchMap((cities) =>
            from(cities).pipe(
              mergeMap((city) => this.fetchCityTemperature$(city), 3),
              endWith(WeatherActions.refreshAllFinished())
            )
          )
        )
      )
    )
  );

  // Retry a single city
  retryCity$ = createEffect(() =>
    this.actions$.pipe(ofType(WeatherActions.retryCity), mergeMap(({ city }) => this.fetchCityTemperature$(city)))
  );

  // Poll every 30s manual refresh resets the timer
  polling$ = createEffect(() =>
    merge(
      this.actions$.pipe(ofType(WeatherActions.loadCitiesSuccess)),
      this.actions$.pipe(
        ofType(WeatherActions.refreshAll),
        filter(({ source }) => source === 'manual')
      )
    ).pipe(
      switchMap(() => timer(30_000, 30_000).pipe(map(() => WeatherActions.refreshAll({ source: 'poll' }))))
    )
  );

  private citiesOnce$() {
    return this.store.select(selectCities).pipe(
      filter((cities) => cities.length > 0),
      take(1)
    );
  }

  private fetchCityTemperature$(city: string) {
    return this.weatherService.getTemperature(city).pipe(
      retry({ count: 2, delay: (_err, retryCount) => timer(400 * retryCount) }),
      map((temperature) => WeatherActions.temperatureFetchSuccess({ city, temperature, receivedAt: Date.now() })),
      catchError((err: unknown) =>
        of(WeatherActions.temperatureFetchFailure({ city, error: String(err) }))
      ),
      startWith(WeatherActions.temperatureFetchStart({ city }))
    );
  }
}

