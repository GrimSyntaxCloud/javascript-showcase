'use strict';
const {app}=require('@azure/functions');
const handlers=require('./handlers');
app.http('health',{methods:['GET'],authLevel:'anonymous',route:'health',handler:handlers.health});
app.http('weather',{methods:['GET'],authLevel:'anonymous',route:'weather',handler:handlers.weather});
