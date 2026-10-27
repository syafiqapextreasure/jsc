export function sanitizeCart(value, catalog) {
  if(!Array.isArray(value)) return [];
  const result=[];
  for(const row of value.slice(0,40)) {
    if(!row || !catalog.some(p=>p.slug===row.slug)) continue;
    const size=String(row.size||'').trim().slice(0,30);
    if(!size) continue;
    const qty=Math.max(1,Math.min(10,Math.floor(Number(row.qty)||1)));
    const existing=result.find(p=>p.slug===row.slug&&p.size===size);
    if(existing) existing.qty=Math.min(10,existing.qty+qty);
    else result.push({slug:row.slug,size,qty});
  }
  return result;
}
export function orderMessage(cart,catalog,details={},origin='') {
  if(!cart.length) return '';
  const lines=['Salam Jang Sport Center! Saya ingin semak pesanan:',''];
  cart.forEach((r,i)=>{const p=catalog.find(p=>p.slug===r.slug);if(p)lines.push(`${i+1}. ${p.name} (${p.colour})`, `Saiz diminta: ${r.size} | Kuantiti: ${r.qty}`, `${origin}/kasut/${p.slug}`, '');});
  for(const [key,label] of [['name','Nama'],['surface','Padang saya'],['area','Kawasan penghantaran'],['note','Nota']]) if(typeof details?.[key]==='string' && details[key].trim()) lines.push(`${label}: ${details[key].trim().slice(0,1000)}`);
  lines.push('','Hadiah: stoking percuma dengan pembelian kasut.','Mohon sahkan harga, stok, saiz, kesesuaian tapak dan kos penghantaran. Terima kasih!');
  return lines.join('\n');
}
