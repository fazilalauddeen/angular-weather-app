export function loadWeatherElementsBundle(doc: Document, url: string): void {
  const id = 'weather-elements-bundle';
  if (doc.getElementById(id)) return;

  const script = doc.createElement('script');
  script.type = 'module';
  script.src = url;
  script.id = id;
  script.async = true;
  doc.body.appendChild(script);
}
