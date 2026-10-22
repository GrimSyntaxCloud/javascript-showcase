# Field weather: free provider and deployment notes

Verified against official provider documentation on October 21, 2026.

## What replaced the old integration

Original `weatherWidget` used Dark Sky plus a Google reverse-geocoding key and a local Express server. Field replaces this with **MET Norway Locationforecast 2.0**, through an identified caching Node proxy. It retains location-based weather and icon/summary behavior, adds a manual city lookup, and displays temperature, wind, humidity, pressure and next-hour precipitation. Model times are shown explicitly in UTC.

The nearest forecast hour is selected; values are forecasts, not observations. Data more than three hours from the current time is rejected rather than presented as current. The optional browser-location action rounds coordinates to two decimals before transmitting them. It displays “Near you” instead of inventing a reverse-geocoded city name. Automated testing does not request location permission.

## Why this provider fits the free constraint

- [MET Norway licensing](https://api.met.no/doc/License): weather data under CC BY 4.0/NLOD. Attribution is visible in the footer, including a license link and notice that presentation/unit conversions are changes. No copied weather icons are needed; all artwork is CSS.
- [MET Norway FAQ](https://api.met.no/doc/FAQ): publicly funded service with no high-volume paid pricing tier; no API key/account/billing is used here.
- [MET Norway service terms](https://api.met.no/doc/TermsOfService): requires application identification, caching, responsible traffic, HTTPS, and limited coordinate precision. There is no uptime guarantee. Requests exceeding 20 per second across the application need a special agreement; this application stays much lower.
- The managed Node 22 API identifies `FieldWeatherPortfolioDemo/1.0 (https://github.com/GrimSyntaxCloud/javascript-showcase; https://grimsyntaxcloud.github.io/)`. All API instances use the existing shared Cosmos Mongo database: 64 fixed hashed cache slots plus one atomic gate. It honors provider `Expires`, revalidates with `Last-Modified`, and limits upstream starts globally to one per 1.5 seconds. A 403/429 pauses the gate for at least a minute, or longer when requested by the provider. There is no automatic refresh loop. Cache entries have a hard 96-hour expiry and a Cosmos `_ts` TTL of 96 hours. No raw coordinates or provider geometry are stored. See [deployment details](../DEPLOYMENT.md).
- [Locationforecast documentation](https://api.met.no/weatherapi/locationforecast/2.0/documentation) describes global coverage, units, nearest-hour forecast data and symbol codes. Wind is originally metres/second; Field converts to mph or km/h. Temperature converts Celsius to Fahrenheit. Humidity remains percent, pressure hPa, and precipitation mm/inches.

## City lookup without a geocoding service

`cities.json` is a reduced and population-sorted extract of [GeoNames cities15000.zip](https://download.geonames.org/export/dump/cities15000.zip), downloaded October 21, 2026. It has 34,174 entries: name, ASCII name, country code, latitude/longitude rounded to two decimals, and population. The data is loaded from this app's own origin. Searches stay in the browser.

[GeoNames export terms](https://www.geonames.org/export/) expressly allow commercial use with attribution. The [extract README](https://download.geonames.org/export/dump/readme.txt) licenses the data under CC BY 4.0. Attribution is displayed in Field's footer. This uses the downloadable dataset, not the metered GeoNames web service. Search supports name prefixes and an optional two-letter country qualifier, e.g. `Paris, FR`. It does not promise full worldwide addresses or every small settlement.

No Nominatim service is used. Open-Meteo was evaluated but not used because its free service excludes commercial promotional activity, an unnecessary ambiguity for a recruiter-facing portfolio.

## Managed deployment

The frontend calls its same-origin `/api/weather` managed Azure Function. The API uses an existing approved free Cosmos Mongo database for shared cache and rate-limit state; static GitHub Pages alone cannot execute it. The deployment workflow creates no Azure resource and requires an existing Static Web Apps Free resource, scoped database credential, environment-specific deployment token and explicit deployment enable variable. No client can select an arbitrary upstream endpoint.

MET Norway permits low-volume simple browser CORS requests under conditions, but recommends a caching backend. This implementation uses that backend to make identification and cache compliance explicit. Provider terms can change; recheck them before materially increasing traffic. No service-level guarantee is provided. Nothing here enables paid resources or accepts a new paid agreement.

## Atmospheric interface redesign

The frontend uses a decorative aurora, curved horizon, native CSS weather symbols and large temperature typography. The sky illustration is explicitly an atmospheric impression, not additional forecast data. No map, paid assets, remote fonts or animation libraries are used. A sky-motion control pauses the continuous decorative effect; the operating system’s reduced-motion setting disables it automatically.

City search, the bundled GeoNames catalog, manual location choice, optional browser geolocation, Fahrenheit/Celsius conversions, metrics, API error handling and provider attribution remain intact. No backend, cache, credential, retention or throughput configuration changed for this design.
