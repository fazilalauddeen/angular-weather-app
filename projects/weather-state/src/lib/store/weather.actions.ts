import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { RefreshSource } from './weather.models';

export const WeatherActions = createActionGroup({
  source: 'Weather',
  events: {
    'Load Cities': emptyProps(),
    'Load Cities Success': props<{ cities: string[] }>(),
    'Load Cities Failure': props<{ error: string }>(),

    'Refresh All': props<{ source: RefreshSource }>(),
    'Refresh All Finished': emptyProps(),
    'Retry City': props<{ city: string }>(),

    'Temperature Fetch Start': props<{ city: string }>(),
    'Temperature Fetch Success': props<{ city: string; temperature: number; receivedAt: number }>(),
    'Temperature Fetch Failure': props<{ city: string; error: string }>()
  }
});

