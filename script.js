const $=s=>document.querySelector(s);
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length>1){e.preventDefault();$(id)?.scrollIntoView({behavior:'smooth'});}}));
$('#save')?.addEventListener('click',()=>{$('#saved').textContent='✓ Demo settings saved: Lot '+$('#lot').value+' · SL '+$('#sl').value+' · TP '+$('#tp').value;});
$('#buy')?.addEventListener('click',()=>{$('#tradeMsg').textContent='DEMO BUY selected — no real order was sent.';});
$('#sell')?.addEventListener('click',()=>{$('#tradeMsg').textContent='DEMO SELL selected — no real order was sent.';});
setInterval(()=>{const b=10000+(Math.random()*40-20);$('#balance').textContent='$'+b.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});},4000);