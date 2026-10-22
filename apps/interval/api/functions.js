'use strict';
const {app}=require('@azure/functions');
const handlers=require('./handlers');
app.http('health',{methods:['GET'],authLevel:'anonymous',route:'health',handler:handlers.health});
app.http('statistics',{methods:['GET'],authLevel:'anonymous',route:'statistics',handler:handlers.statistics});
app.http('registration',{methods:['POST'],authLevel:'anonymous',route:'registration',handler:handlers.registration});
