// Basic nav
document.querySelectorAll('.nav-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    const tool = b.dataset.tool;
    document.querySelectorAll('.tool').forEach(s=> s.classList.add('hidden'));
    document.getElementById(tool).classList.remove('hidden');
  });
});
// Show stopwatch on load
document.querySelector('[data-tool="stopwatch"]').click();

/* -------- STOPWATCH -------- */
let swInterval, swStartTime, swRunning=false;
const swDisplay = document.getElementById('sw-display');
function fmtTime(ms) {
  let cent = Math.floor(ms/10)%100;
  let sec = Math.floor(ms/1000)%60;
  let min = Math.floor(ms/60000);
  return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(cent).padStart(2,'0')}`;
}
document.getElementById('sw-start').onclick = () => {
  if(swRunning) return;
  swRunning = true;
  swStartTime = Date.now() - (swInterval ? parseInt(swDisplay.dataset.ms||0) : 0);
  swInterval = setInterval(()=> {
    const ms = Date.now() - swStartTime;
    swDisplay.textContent = fmtTime(ms);
    swDisplay.dataset.ms = ms;
  }, 50);
};
document.getElementById('sw-stop').onclick = () => {
  if(!swRunning) return;
  swRunning = false;
  clearInterval(swInterval);
  swInterval = null;
};
document.getElementById('sw-reset').onclick = () => {
  swRunning = false;
  clearInterval(swInterval);
  swInterval = null;
  swDisplay.textContent = "00:00:00.00";
  swDisplay.dataset.ms = 0;
};

/* -------- COUNTER -------- */
let cnt = 0;
const cntDisplay = document.getElementById('counter-display');
document.getElementById('count-increment').onclick = ()=> { cnt++; cntDisplay.textContent = cnt; };
document.getElementById('count-decrement').onclick = ()=> { cnt--; cntDisplay.textContent = cnt; };
document.getElementById('count-reset').onclick = ()=> { cnt=0; cntDisplay.textContent = cnt; };

/* -------- TEXT CONVERTER -------- */
const input = document.getElementById('text-input');
const output = document.getElementById('text-output');
document.getElementById('to-upper').onclick = ()=> { output.textContent = input.value.toUpperCase(); };
document.getElementById('to-lower').onclick = ()=> { output.textContent = input.value.toLowerCase(); };
document.getElementById('count-words').onclick = ()=> {
  const text = input.value.trim();
  if(!text){ output.textContent = 'Words: 0'; return; }
  const words = text.split(/\s+/).filter(Boolean).length;
  output.textContent = `Words: ${words}`;
};

/* -------- UNIT CONVERTER -------- */
function metersToFeet(m){ return m * 3.280839895; }
function feetToMeters(ft){ return ft / 3.280839895; }
document.getElementById('unit-convert').onclick = ()=> {
  const v = parseFloat(document.getElementById('unit-value').value || 0);
  const from = document.getElementById('unit-from').value;
  const to = document.getElementById('unit-to').value;
  let res = v;
  if(from===to){ document.getElementById('unit-output').textContent = `${v} ${to}`; return; }
  if(from==='m' && to==='ft') res = metersToFeet(v);
  if(from==='ft' && to==='m') res = feetToMeters(v);
  document.getElementById('unit-output').textContent = `${parseFloat(res.toFixed(4))} ${to}`;
};

/* -------- FOCUSFLOW TIMER -------- */
let focusInterval=null, focusRemaining=0, focusState='idle'; // 'work' or 'break'
const focusDisplay = document.getElementById('focus-display');
function secsToMMSS(s){ const m = Math.floor(s/60); const sec = s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }
document.getElementById('focus-start').onclick = ()=> {
  if(focusInterval) return;
  const mins = parseInt(document.getElementById('focus-min').value || 25);
  const bmins = parseInt(document.getElementById('break-min').value || 5);
  focusState = 'work';
  focusRemaining = mins * 60;
  focusInterval = setInterval(()=> {
    if(focusRemaining<=0){
      if(focusState==='work'){ focusState='break'; focusRemaining = bmins*60; alert('Break time!'); }
      else { focusState='work'; focusRemaining = mins*60; alert('Work time!'); }
    } else {
      focusRemaining--;
    }
    focusDisplay.textContent = secsToMMSS(focusRemaining);
  }, 1000);
};
document.getElementById('focus-stop').onclick = ()=> {
  clearInterval(focusInterval); focusInterval=null;
};
document.getElementById('focus-reset').onclick = ()=> {
  clearInterval(focusInterval); focusInterval=null;
  const mins = parseInt(document.getElementById('focus-min').value || 25);
  focusDisplay.textContent = secsToMMSS(mins*60);
};
