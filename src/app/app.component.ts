import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { loadWeatherElementsBundle } from './load-weather-elements-bundle';
import { WEATHER_ELEMENTS_SCRIPT_URL } from './weather-elements-script.token';

@Component({
  selector: 'app-root',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementsBundleUrl = inject(WEATHER_ELEMENTS_SCRIPT_URL);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    loadWeatherElementsBundle(this.doc, this.elementsBundleUrl);
  }
}
