const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const start=document.getElementById("start"),stop=document.getElementById("stop");
const process=document.getElementById("process"),clear=document.getElementById("clear");
const text=document.getElementById("text"),status=document.getElementById("status");
const response=document.getElementById("response"),type=document.getElementById("type");
let rec,finalText="";

if(!SR){
 status.textContent="Speech Recognition is not supported. Please use Google Chrome.";
 start.disabled=true;
}else{
 rec=new SR(); rec.continuous=true; rec.interimResults=true; rec.lang="en-IN";
 rec.onstart=()=>{status.textContent="Listening... Speak now.";start.disabled=true;stop.disabled=false};
 rec.onresult=e=>{
  let interim="";
  for(let i=e.resultIndex;i<e.results.length;i++){
   let t=e.results[i][0].transcript;
   if(e.results[i].isFinal) finalText+=t+" "; else interim+=t;
  }
  text.value=finalText+interim;
 };
 rec.onerror=e=>{status.textContent="Error: "+e.error;start.disabled=false;stop.disabled=true};
 rec.onend=()=>{status.textContent="Listening stopped. Press Process Command.";start.disabled=false;stop.disabled=true};
 start.onclick=()=>rec.start(); stop.onclick=()=>rec.stop();
}
process.onclick=()=>handle(text.value.trim());
clear.onclick=()=>{finalText="";text.value="";response.innerHTML='<div class="welcome">Your request result will appear here.</div>';type.textContent="Waiting";status.textContent="Cleared."};

function handle(t){
 if(!t){status.textContent="Please speak a command first.";return}
 let s=t.toLowerCase(), result;
 if(/emergency|help me|danger|fall|accident/i.test(s))
   result=make("🆘 Emergency", "Emergency request detected.", [["Action","Alert family / emergency contact"],["Status","Priority: HIGH"],["Next step","Contact a trusted person or local emergency service immediately if this is a real emergency."]]);
 else if(/medicine|tablet|pill|medicin/i.test(s))
   result=make("💊 Medicine Reminder","Medicine reminder request detected.",[["Request",t],["Time",findTime(t)],["Action","Create reminder"]]);
 else if(/call|phone|son|daughter|family|brother|sister/i.test(s))
   result=make("📞 Family Call","Family call request detected.",[["Request",t],["Action","Open family contact / call screen"],["Status","Ready for confirmation"]]);
 else if(/buy|shopping|milk|rice|vegetable|grocery|groceries/i.test(s))
   result=make("🛒 Shopping List","Shopping item detected.",[["Item / Request",t],["Action","Add to shopping list"],["Status","Saved for review"]]);
 else if(/tomorrow|today|task|work|remember|remind/i.test(s))
   result=make("📅 Daily Task","Daily task request detected.",[["Task",t],["Action","Add to task list"],["Status","Pending"]]);
 else if(/hospital|doctor|cab|taxi|travel|bus|train/i.test(s))
   result=make("🚕 Travel / Hospital Help","Travel assistance request detected.",[["Request",t],["Action","Prepare travel/cab request"],["Status","Ready for confirmation"]]);
 else
   result=make("🗣️ General Voice Request","Speech was successfully recognized.",[["Recognized text",t],["Action","No specific command detected"],["Tip","Try saying medicine, call, shopping, task, hospital, or emergency."]]);
 response.innerHTML=result.html; type.textContent=result.label; status.textContent="Command processed successfully.";
}
function findTime(t){let m=t.match(/\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/i);return m?m[0]:"Not detected"}
function make(label,msg,items){
 return {label,html:`<div class="answer">${msg}</div><div class="data">${items.map(x=>`<div><b>${esc(x[0])}:</b> ${esc(x[1])}</div>`).join("")}</div>`}
}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
