# Managed free-demo deployment

Each app is its own Azure Static Web Apps **Free** resource with managed Node.js 22 Functions. No separate paid compute, storage account or monitoring service is created by these workflows. Keep the Azure subscription spending limit enabled.

| App | GitHub environment | Repository enable variable | Managed API endpoints |
|---|---|---|---|
| Interval | `azure-interval` | `AZURE_INTERVAL_DEPLOY_ENABLED=true` | `/api/health`, `/api/statistics`, POST `/api/registration` |
| FIELD | `azure-field` | `AZURE_FIELD_DEPLOY_ENABLED=true` | `/api/health`, `/api/weather?lat=...&lon=...` |

Store each existing SWA deployment token as `AZURE_STATIC_WEB_APPS_API_TOKEN` in its own named GitHub environment. Never put tokens in source, workflow text, frontend settings or documentation.

Interval requires no application settings or database. The original app performed a mock POST and returned fixed statistics; this remains explicit in its UI. Use fictional details. The server does not log or save submitted names/contact details.

FIELD settings, stored only in the Azure backend's environment:

- `MONGODB_URI`: credential scoped to the approved existing Cosmos Mongo database. Use TLS and `retryWrites=false`; never print this value.
- `MONGODB_DATABASE=portfolio-demos`
- `MONGODB_COLLECTION=field_cache`

FIELD uses no new reserved throughput. The root deployment operator must verify the shared Free account/database capacity, provision the unsharded collection, and add its Cosmos Mongo TTL index `{_ts:1}` with `expireAfterSeconds:345600` (96 hours). This differs from ordinary MongoDB date-field TTL. The API does not create collections or indexes on startup. See [Cosmos Mongo TTL documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/time-to-live).

Cache storage is bounded to 64 hashed slots plus one global gate document. Documents contain weather data, a hash of rounded coordinates and provider cache metadata; they omit provider geometry, raw coordinates and user identifiers. The code also checks hard `expiresAt` values, so delayed TTL removal cannot serve expired entries. The gate is system state and can remain as requests refresh it.

All API instances share one atomic gate: at most one upstream request starts per 1.5 seconds. Valid cache hits do not contact MET Norway. The provider's Expires/Last-Modified headers are respected, and a 403/429 pauses the shared gate for at least one minute. The API only fetches a fixed HTTPS MET Norway endpoint; clients cannot choose an upstream URL. User-facing errors contain no connection strings or private fields.

The FIELD source identifies this public application in its User-Agent and gives MET Norway/GeoNames credit in the UI. The dataset uses GeoNames CC BY 4.0, which permits commercial use; MET data uses CC BY 4.0/NLOD. No Open-Meteo or Nominatim service is used.

## Checks

```sh
npm ci --prefix apps/interval/api
npm test --prefix apps/interval/api
npm audit --prefix apps/interval/api --audit-level=low
npm ci --prefix apps/field/api
npm test --prefix apps/field/api
npm audit --prefix apps/field/api --audit-level=low
```

FIELD integration tests use a disposable local MongoDB instance, never the Azure database. They verify concurrency across independent instances, shared backoff, provider revalidation, no geometry retention and fixed cache-slot replacement. The CI workflow uses Node.js 22. After deployment, verify the health route, an Interval fictional registration and a FIELD city forecast in a browser before announcing the demo as live.

FIELD pins MongoDB driver 6.21 because the existing Cosmos endpoint is Mongo 4.2. Driver 7.6+ requires MongoDB 4.4/wire version 9; major driver proposals are held until the backend supports them. Patch/minor updates and vulnerability alerts remain enabled. See the [official compatibility tables](https://www.mongodb.com/docs/drivers/compatibility/).
