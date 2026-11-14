(function(root){
  'use strict';
  function validDate(s){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;
    const d=new Date(s+'T12:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===s;
  }
  function review({task='',owner='',due='',today=''}){
    const issues=[];
    const add=(code,severity,message)=>issues.push({code,severity,message});
    if(!task.trim())add('EMPTY_TASK','required','أضيفي تكليفًا يمكن مراجعته.');
    if(!owner.trim())add('MISSING_OWNER','required','حددي مسؤولًا واحدًا عن التسليم.');
    if(!due.trim())add('MISSING_DUE','required','حددي تاريخ تسليم صريحًا.');
    else if(!validDate(due))add('INVALID_DATE','required','استخدمي تاريخًا صالحًا بصيغة YYYY-MM-DD.');
    else if(validDate(today)&&due<today)add('PAST_DUE','review','التاريخ يسبق يوم المراجعة؛ تحققي هل المهمة متأخرة أم التاريخ غير صحيح.');
    if(/(?:تحسين|تطوير|متابعة|التنسيق|enhance|improve|follow\s*up)/iu.test(task))add('VAGUE_SCOPE','review','الصياغة قد تكون واسعة: حددي مخرجًا ومعيار انتهاء يمكن التحقق منه.');
    if(/(?:غد[ًاا]|بكرة|الأسبوع القادم|قريب[ًاا]|tomorrow|next week|soon)/iu.test(task))add('RELATIVE_DATE','review','يوجد موعد نسبي داخل النص؛ استبدليه بتاريخ صريح بعد تأكيد المقصود.');
    if(/[؛;\n]/u.test(task.trim()))add('MULTIPLE_ACTIONS','review','قد يحتوي النص على أكثر من تكليف؛ راجعي الحاجة إلى الفصل.');
    return {issues,required:issues.filter(i=>i.severity==='required').length,review:issues.filter(i=>i.severity==='review').length,readyForHumanReview:issues.length===0,record:{task:task.trim(),owner:owner.trim(),due:validDate(due)?due:null}};
  }
  const api={review,validDate};if(typeof module!=='undefined')module.exports=api;root.Actions=api;
})(typeof window==='undefined'?globalThis:window);
