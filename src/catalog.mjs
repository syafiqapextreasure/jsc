export const PHONE = '60199628865';
export const products = [
  ['pink-speed', 'Pink Speed', 'Nike', 'Pink / Black', 'Bertali', '01-pink-speed'],
  ['leopard-control', 'Leopard Control', 'adidas', 'Black / Purple Leopard', 'Tanpa tali', '02-leopard-control'],
  ['mint-speed', 'Mint Speed', 'Nike', 'Mint / Multicolour', 'Bertali', '03-mint-speed'],
  ['magenta-kobe', 'Magenta Kobe', 'Nike', 'Magenta / Black', 'Bertali', '04-magenta-kobe'],
  ['red-gold', 'Red Gold', 'Nike', 'Red / Metallic Gold', 'Bertali', '05-red-gold'],
  ['pink-laced', 'Pink Laced', 'adidas', 'Pink / Black', 'Bertali', '06-pink-laced'],
  ['camo-gold', 'Camo Gold', 'adidas', 'Camo / Gold', 'Bertali', '07-camo-gold'],
  ['pink-laceless', 'Pink Laceless', 'adidas', 'Pink / Black', 'Tanpa tali', '08-pink-laceless'],
  ['red-white-control', 'Red White Control', 'adidas', 'Red / White', 'Tanpa tali', '09-red-white-control'],
].map(([slug,name,brand,colour,style,image],index) => ({slug,name,brand,colour,style,image,index,surfaces:[],suggestedSurfaces:['fg']}));
export const surfaces = [
  {id:'fg', name:'Rumput Asli', label:'Firm Ground', short:'Rumput semula jadi yang padat.', detail:'FG lazimnya digunakan pada rumput semula jadi yang padat. Semak keadaan padang dan spesifikasi tapak kasut sebelum memilih.'},
  {id:'ag', name:'Rumput Tiruan', label:'Artificial Grass', short:'Rumput sintetik panjang.', detail:'AG direka untuk permukaan rumput sintetik yang lebih panjang. Pilihan tapak bergantung pada spesifikasi kasut dan peraturan padang.'},
  {id:'tf', name:'Turf Pendek', label:'Turf', short:'Rumput sintetik pendek dan padat.', detail:'TF biasanya mempunyai banyak nub getah kecil untuk turf sintetik pendek. Kasut berstud panjang tidak semestinya sesuai untuk turf.'},
  {id:'ic', name:'Indoor / Futsal', label:'Indoor Court', short:'Gelanggang keras atau lantai futsal.', detail:'IC biasanya menggunakan tapak getah rata untuk gelanggang keras. Semak juga keperluan tapak non-marking di gelanggang anda.'}
];
export function filterProducts(params, brand) {
  const q=(params.get('q')||'').trim().toLowerCase().slice(0,100);
  const brands=brand?[brand.toLowerCase()]:params.getAll('jenama').filter(Boolean).map(b=>b.toLowerCase());
  const styles=params.getAll('gaya').filter(Boolean);
  const surface=params.get('padang');
  const found=products.filter(p=>(!q||`${p.name} ${p.brand} ${p.colour}`.toLowerCase().includes(q))&&(!brands.length||brands.includes(p.brand.toLowerCase()))&&(!styles.length||styles.includes(p.style))&&(!surface||(p.surfaces.includes(surface)||p.suggestedSurfaces.includes(surface))));
  if(params.get('sort')==='az') found.sort((a,b)=>a.name.localeCompare(b.name));
  if(params.get('sort')==='za') found.sort((a,b)=>b.name.localeCompare(a.name));
  return found;
}
export const faqs = [
  ['Bagaimana cara membuat pesanan?', 'Pilih kasut, masukkan saiz yang dicari dan tambah ke cart. Semak pilihan anda, kemudian buka WhatsApp untuk menghantar pertanyaan. Kami akan sahkan harga, stok dan maklumat pesanan.'],
  ['Adakah pembelian kasut dapat stoking percuma?', 'Ya, pembelian kasut disertakan hadiah stoking percuma. Butiran hadiah akan disahkan bersama pesanan anda.'],
  ['Bolehkah kasut yang sama digunakan untuk semua padang?', 'Tidak semestinya. FG, AG, TF dan IC merujuk kepada jenis permukaan berbeza. Semak spesifikasi tapak kasut serta peraturan padang sebelum membeli.'],
  ['Bagaimana saya tahu saiz yang sesuai?', 'Ukur panjang kedua-dua kaki dalam sentimeter dan beritahu kami saiz serta sistem ukuran yang biasa dipakai. Saiz dan fit boleh berbeza mengikut kasut.'],
  ['Bila harga dan penghantaran disahkan?', 'Harga, ketersediaan saiz, kos penghantaran dan jangkaan penghantaran disahkan melalui WhatsApp sebelum anda meneruskan pembelian.'],
  ['Bagaimana dengan pertukaran saiz?', 'Tanya syarat pertukaran melalui WhatsApp sebelum membuat bayaran. Simpan butiran pesanan dan pengesahan daripada penjual.']
];
