import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { WeatherEffects, weatherFeature } from 'weather-state';
import { WeatherDashboardComponent } from 'weather-ui';

async function defineWeatherDashboardElement() {
  const app = await createApplication({
    providers: [provideStore(), provideState(weatherFeature), provideEffects(WeatherEffects)]
  });

  const element = createCustomElement(WeatherDashboardComponent, { injector: app.injector });
  if (!customElements.get('weather-dashboard')) {
    customElements.define('weather-dashboard', element);
  }
}

defineWeatherDashboardElement().catch((err) => console.error(err));
