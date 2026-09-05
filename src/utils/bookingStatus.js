const transitions={Reserved:["Confirmed","Cancelled"],Confirmed:["Checked-in","Cancelled"],"Checked-in":["Checked-out"],"Checked-out":[],Cancelled:[]};
const canTransition=(a,b)=>Array.isArray(transitions[a])&&transitions[a].includes(b); module.exports={transitions,canTransition};
