import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { WeatherActions, selectCitiesError, selectCitiesLoading, selectCityCardsVm, selectRefreshAllInFlight } from 'weather-state';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-dashboard.component.html',
  styleUrl: './weather-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherDashboardComponent {
  private store = inject(Store);

  citiesLoading = this.store.selectSignal(selectCitiesLoading);
  citiesError = this.store.selectSignal(selectCitiesError);
  cards = this.store.selectSignal(selectCityCardsVm);
  refreshAllLoading = this.store.selectSignal(selectRefreshAllInFlight);

  lastUpdatedAt = computed(() => {
    const ms = this.cards().map((c) => c.lastUpdatedAt).filter((t): t is number => t != null);
    return ms.length ? Math.max(...ms) : null;
  });

  trackByCity = (_: number, c: { city: string }) => c.city;

  refreshAll() {
    this.store.dispatch(WeatherActions.refreshAll({ source: 'manual' }));
  }

  retryCity(city: string) {
    this.store.dispatch(WeatherActions.retryCity({ city }));
  }
}
