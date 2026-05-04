import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  getCities(): Observable<string[]> {
    return of(['London', 'Paris', 'Tokyo', 'New York', 'Sydney']).pipe(delay(500));
  }

  getTemperature(city: string): Observable<number> {
    const randomTemp = Math.floor(Math.random() * 30) + 5;
    const shouldFail = Math.random() < 0.3; 
    const source = shouldFail ? throwError(() => new Error(`Weather API failed for ${city}`)) : of(randomTemp);
    return source.pipe(delay(2000)); 
  }
}

