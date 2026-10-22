export const KEY='still.tasks.v1';
export function normalizeTasks(value){if(!Array.isArray(value))throw new Error('Invalid saved list');return value.filter(t=>t&&typeof t.task==='string'&&typeof t.isComplete==='boolean').map((t,i)=>({id:typeof t.id==='string'?t.id:`migrated-${i}`,task:t.task.slice(0,240),isComplete:t.isComplete}));}
export function addTask(tasks,text,id){text=text.trim();if(!text||text.length>240)throw new Error('Use between 1 and 240 characters.');return [...tasks,{id,task:text,isComplete:false}];}
export function toggleTask(tasks,id){return tasks.map(t=>t.id===id?{...t,isComplete:!t.isComplete}:t);}
export function deleteTask(tasks,id){return tasks.filter(t=>t.id!==id);}
