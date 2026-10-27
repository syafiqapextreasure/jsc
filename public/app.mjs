import {sanitizeCart,orderMessage} from './cart-core.mjs';
const catalog=JSON.parse(document.querySelector('#catalog-data').textContent);
const key='jsc-cart-v1',detailKey='jsc-order-v1';
const $=s=>document.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let storageAvailable=true;
function read(k,fallback){try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}}
function write(k,value){try{localStorage.setItem(k,JSON.stringify(value));return true}catch{storageAvailable=false;notify('Storage tidak tersedia. Sila hantar pilihan terus melalui WhatsApp.');return false}}
let cart=sanitizeCart(read(key,[]),catalog);
let details=read(detailKey,{});if(!details||Array.isArray(details)||typeof details!=='object')details={};
function notify(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('visible'),3500)}
function count(){document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=cart.reduce((n,r)=>n+r.qty,0))}
function save(){cart=sanitizeCart(cart,catalog);write(key,cart);count()}
const picture=p=>`<img src="/assets/responsive-v1/product-${p.slug}-480.webp" srcset="/assets/responsive-v1/product-${p.slug}-480.webp 480w, /assets/responsive-v1/product-${p.slug}-960.webp 960w, /assets/v4/product-${p.slug}.webp 1536w" sizes="(max-width: 680px) 35vw, 15vw" alt="${escape(p.name)}" width="1536" height="1024" loading="lazy" decoding="async">`;
const giftPhoto=()=>`<div class="mini-gift"><img class="photo" src="/assets/responsive-v1/socks-480.webp" alt="Stoking percuma" width="480" height="320" loading="lazy" decoding="async"><div><strong>Stoking percuma</strong><p>Dengan pembelian kasut.</p></div></div>`;
const empty=()=>`<div class="empty"><h2>Cart anda <em>masih kosong</em></h2><p>Pilih kasut yang anda suka untuk semak harga dan saiz bersama kami.</p><a class="button primary" href="/shop">Cari kasut →</a><br><button class="clear-cart" data-clear-order>Kosongkan maklumat tersimpan</button></div>`;
function renderCart(){if($('#cart-surface'))$('#cart-surface').hidden=!cart.length;const target=$('#cart-content');if(!target)return;if(!cart.length){target.innerHTML=empty();return}
 target.innerHTML=`<div class="cart-layout"><div class="panel"><h2>Kasut pilihan</h2>${cart.map((r,i)=>{const p=catalog.find(p=>p.slug===r.slug);return `<article class="cart-row" data-row="${i}"><a href="/kasut/${p.slug}">${picture(p)}</a><div><h3><a href="/kasut/${p.slug}">${p.name}</a></h3><p>${p.colour}</p><div class="cart-row-controls"><div><label for="cart-size-${i}">Saiz diminta</label><input id="cart-size-${i}" data-size="${i}" value="${escape(r.size)}" maxlength="30" required></div><div><label for="cart-qty-${i}">Kuantiti</label><input id="cart-qty-${i}" data-qty="${i}" type="number" min="1" max="10" value="${r.qty}" required></div></div></div><div><strong>Tanya harga</strong><button class="remove-item" data-remove="${i}" aria-label="Buang ${p.name} saiz ${escape(r.size)}">Buang</button></div></article>`}).join('')}${giftPhoto()}<button class="clear-cart" id="clear-cart">Kosongkan cart & maklumat pesanan</button><a href="/shop" class="button outline">Teruskan shopping →</a></div><aside class="panel cart-summary"><h2>Ringkasan</h2><p class="summary-line">Kuantiti kasut <strong>${cart.reduce((n,r)=>n+r.qty,0)}</strong></p><p class="summary-line">Harga <strong>Akan disahkan</strong></p><p class="summary-line">Penghantaran <strong>Akan disahkan</strong></p><div class="mini-gift"><div><strong>Stoking percuma</strong><p>Dengan pembelian kasut.</p></div></div><a href="/pesanan" class="button primary wide">Semak pesanan →</a><small>Tiada bayaran dibuat pada peringkat ini.</small></aside></div>`;
}
function renderSummary(){const target=$('#order-summary');if(!target)return;const form=$('#order-form');if(!cart.length){form.hidden=true;$('#review-empty').hidden=false;$('#review-empty').innerHTML=empty();return}
 target.innerHTML=cart.map(r=>{const p=catalog.find(p=>p.slug===r.slug);return `<div class="order-item">${picture(p)}<div><h3>${p.name}</h3><p>Saiz: ${escape(r.size)} · Kuantiti: ${r.qty}</p><a class="text-link" href="/cart">Ubah pilihan</a></div></div>`}).join('');
 for(const field of ['name','surface','area','note']) if(typeof details[field]==='string')form.elements[field].value=details[field];
}
count();renderCart();renderSummary();
function restoreSurface(){document.querySelectorAll('[name="cart-surface"]').forEach(input=>input.checked=input.value===details.surface);if($('#cart-surface'))$('#cart-surface').hidden=!cart.length}
restoreSurface();
$('#cart-surface')?.addEventListener('change',e=>{if(e.target.name==='cart-surface'){details.surface=e.target.value;write(detailKey,details)}});
document.querySelectorAll('[data-quantity]').forEach(button=>button.addEventListener('click',()=>{const input=$('#qty');input.value=Math.min(10,Math.max(1,Number(input.value)+Number(button.dataset.quantity)))}));
for(const id of ['size-help','help-message'])$('#'+id)?.addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));const message=id==='size-help'?`Salam JSC, boleh bantu semak saiz ${data.product}? Panjang kaki saya ${data.length} cm. Saiz biasa: ${data.usual||'Belum pasti'}.`:`Salam JSC, ${data.name?'saya '+data.name+'. ':''}${data.message}`;const link=form.querySelector('.prepared-message');link.href='https://wa.me/60199628865?text='+encodeURIComponent(message);link.hidden=false;link.focus();notify('Mesej sedia. Tekan Buka WhatsApp untuk meneruskan.')});
$('.menu-toggle')?.addEventListener('click',e=>{const button=e.currentTarget,open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Tutup menu':'Buka menu');$('#main-nav').classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#main-nav').classList.contains('open')){$('.menu-toggle').click();$('.menu-toggle').focus()}});
$('#add-cart')?.addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const size=form.elements.size.value.trim();if(!size){form.elements.size.setCustomValidity('Masukkan saiz yang dicari.');form.elements.size.reportValidity();return}cart.push({slug:form.dataset.slug,size,qty:Number(form.elements.qty.value)});save();if(storageAvailable){notify('Kasut ditambah ke cart.');const submit=form.querySelector('button[type="submit"]');submit.innerHTML='✓ Ditambah ke cart';if(!$('#go-cart')){const a=document.createElement('a');a.id='go-cart';a.className='button outline wide';a.href='/cart';a.textContent='Lihat cart →';a.style.marginTop='.6rem';form.append(a)}setTimeout(()=>submit.textContent='Tambah ke cart →',2200)}});
$('#size')?.addEventListener('input',e=>e.target.setCustomValidity(''));
$('#cart-content')?.addEventListener('click',e=>{const remove=e.target.closest('[data-remove]');if(remove){cart.splice(Number(remove.dataset.remove),1);save();renderCart();notify('Kasut dibuang daripada cart.')}if(e.target.id==='clear-cart'){cart=[];details={};write(detailKey,{});save();renderCart();notify('Cart dan maklumat pesanan telah dikosongkan.')}});
$('#cart-content')?.addEventListener('change',e=>{
 const oldLength=cart.length;
 if(e.target.matches('[data-qty]')){const i=Number(e.target.dataset.qty);cart[i].qty=Math.min(10,Math.max(1,Math.floor(Number(e.target.value)||1)));e.target.value=cart[i].qty;save()}
 else if(e.target.matches('[data-size]')){const i=Number(e.target.dataset.size),value=e.target.value.trim();if(!value){e.target.value=cart[i].size;notify('Saiz tidak boleh kosong.');return}cart[i].size=value;e.target.value=value;save()}
 else return;
 // Keep the focused input and checkout link in place while editing a row.
 if(cart.length===oldLength){const total=$('.cart-summary .summary-line strong');if(total)total.textContent=cart.reduce((n,r)=>n+r.qty,0)}
 else {requestAnimationFrame(()=>{renderCart();notify('Pilihan kasut dan saiz yang sama digabungkan.')})}
});
$('#order-form')?.addEventListener('submit',e=>{e.preventDefault();if(!cart.length)return;const form=e.currentTarget;if(!form.reportValidity())return;details=Object.fromEntries(new FormData(form));if(write(detailKey,details))location.href='/whatsapp'});
$('#order-form')?.addEventListener('input',e=>{const form=e.currentTarget;details=Object.fromEntries(new FormData(form));write(detailKey,details)});
function refreshMessage(){if(!$('#message-preview'))return;if(!cart.length){$('.whatsapp-panel').innerHTML=empty();return}const summary=$('#handoff-summary');if(summary)summary.innerHTML=cart.map(r=>{const p=catalog.find(p=>p.slug===r.slug);return `<div class="order-item">${picture(p)}<div><h3>${p.name}</h3><p>Saiz: ${escape(r.size)}<br>Kuantiti: ${r.qty}</p></div></div>`}).join('')+`<p class="summary-line">Jenis padang <strong>${escape(details.surface||'Belum pasti')}</strong></p>`;const message=orderMessage(cart,catalog,details,location.origin);$('#message-preview').textContent=message;$('#send-whatsapp').href=`https://wa.me/60199628865?text=${encodeURIComponent(message)}`}
refreshMessage();
$('#copy-message')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#message-preview').textContent);notify('Mesej disalin.')}catch{const range=document.createRange();range.selectNodeContents($('#message-preview'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);notify('Mesej dipilih. Gunakan Salin pada peranti anda.')}});
document.addEventListener('click',e=>{if(e.target.matches('[data-clear-order]')){details={};write(detailKey,{});notify('Maklumat tersimpan telah dikosongkan.')}});
document.querySelectorAll('.gallery-choice').forEach(button=>button.addEventListener('click',()=>{$('.gallery-main').classList.toggle('zoomed',button.dataset.view==='close');$('.gallery-main').classList.toggle('textured',button.dataset.view==='texture');document.querySelectorAll('.gallery-choice').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))})}));
window.addEventListener('storage',e=>{
 if(e.key===key){cart=sanitizeCart(read(key,[]),catalog);count();renderCart();if($('#order-form')){if(cart.length){$('#order-form').hidden=false;$('#review-empty').hidden=true}renderSummary()}if(location.pathname==='/whatsapp'&&!$('#message-preview')&&cart.length){location.reload();return}refreshMessage()}
 if(e.key===detailKey){const saved=read(detailKey,{});details=saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};refreshMessage()}
});
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
const filterForm=$('#catalog-filters');
if(filterForm){
 let pending,timer,version=0;
 const filterURL=()=>{const url=new URL(filterForm.action);for(const [key,value] of new FormData(filterForm))if(value)url.searchParams.append(key,value);return url};
 async function updateCatalog(url){
  clearTimeout(timer);pending?.abort();pending=new AbortController();const current=++version;
  $('#catalog-results').setAttribute('aria-busy','true');
  try{
   const response=await fetch(url,{signal:pending.signal});if(!response.ok)throw new Error('Filter failed');
   const doc=new DOMParser().parseFromString(await response.text(),'text/html');
   const results=doc.querySelector('#catalog-results');if(!results)throw new Error('Missing results');
   if(current!==version)return;
   $('#catalog-results').replaceWith(results);
   const nextHero=doc.querySelector('.hero');if(nextHero&&$('.hero')){$('.hero').replaceWith(nextHero);hero=nextHero}
   const tabs=doc.querySelector('.surface-tabs');if(tabs&&$('.surface-tabs'))$('.surface-tabs').replaceWith(tabs);
   history.pushState({catalog:true},'',url);
  }catch(error){if(error.name!=='AbortError'&&current===version){notify('Filter tidak dapat dimuatkan. Sila cuba lagi.')}}
  finally{if(current===version)$('#catalog-results')?.removeAttribute('aria-busy')}
 }
 filterForm.addEventListener('submit',e=>{e.preventDefault();updateCatalog(filterURL())});
 filterForm.addEventListener('change',e=>{if(e.target.type==='checkbox')updateCatalog(filterURL())});
 filterForm.querySelector('[name="q"]').addEventListener('input',()=>{clearTimeout(timer);pending?.abort();version++;timer=setTimeout(()=>updateCatalog(filterURL()),250)});
 document.addEventListener('change',e=>{if(e.target.id==='sort')updateCatalog(filterURL())});
 document.addEventListener('click',e=>{
  const tab=e.target.closest('.surface-tabs [data-surface]');
  const reset=e.target.closest('#catalog-filters .text-link');
  if((!tab&&!reset)||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
  e.preventDefault();
  if(tab)filterForm.elements.padang.value=tab.dataset.surface;
  else {filterForm.querySelectorAll('input').forEach(input=>{if(input.type==='checkbox')input.checked=false;else input.value=''});if($('#sort'))$('#sort').value=''}
  updateCatalog(filterURL());
 });
 window.addEventListener('popstate',()=>location.reload());
}
let hero=$('.hero');let scheduled=false;
function parallax(){if(scheduled||motion.matches||innerWidth<681||!hero)return;scheduled=true;requestAnimationFrame(()=>{const y=Math.max(0,Math.min(60,scrollY*.12));hero.style.setProperty('--parallax',`${y}px`);scheduled=false})}
window.addEventListener('scroll',parallax,{passive:true});
motion.addEventListener('change',()=>{if(motion.matches)hero?.style.setProperty('--parallax','0px')});


$('#brand-nav')?.addEventListener('change',e=>location.href='/jenama/'+e.target.value);
$('#surface-nav')?.addEventListener('change',e=>{if(e.target.value)location.href='/padang/'+e.target.value+'?jenama=nike'});
