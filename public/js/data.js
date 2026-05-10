const PRODUCTS = [
  // MEN
  { id: 'm1', cat: 'men', brand: 'U.S. Polo Assn.', name: 'Men Striped Polo Collar T-shirt', price: 999, original: 1499, rating: 4.2, count: 128, img: 'https://picsum.photos/seed/men1/400/500', isNew: true, isTrending: false },
  { id: 'm2', cat: 'men', brand: 'Puma', name: 'Men Graphic Printed T-shirt', price: 699, original: 1299, rating: 4.5, count: 342, img: 'https://picsum.photos/seed/men2/400/500', isNew: false, isTrending: true },
  { id: 'm3', cat: 'men', brand: 'Levis', name: 'Men Slim Fit Jeans', price: 1899, original: 2999, rating: 4.1, count: 89, img: 'https://picsum.photos/seed/men3/400/500', isNew: false, isTrending: false },
  { id: 'm4', cat: 'men', brand: 'Tommy Hilfiger', name: 'Men Solid Tailored Jacket', price: 4599, original: 7999, rating: 4.8, count: 56, img: 'https://picsum.photos/seed/men4/400/500', isNew: true, isTrending: true },
  { id: 'm5', cat: 'men', brand: 'H&M', name: 'Men Relaxed Fit Hoodie', price: 1499, original: 2299, rating: 4.3, count: 210, img: 'https://picsum.photos/seed/men5/400/500', isNew: false, isTrending: false },
  { id: 'm6', cat: 'men', brand: 'Jack & Jones', name: 'Men Checked Casual Shirt', price: 1199, original: 1999, rating: 4.0, count: 77, img: 'https://picsum.photos/seed/men6/400/500', isNew: true, isTrending: false },
  { id: 'm7', cat: 'men', brand: 'Nike', name: 'Men Running Shoes', price: 3999, original: 5499, rating: 4.7, count: 512, img: 'https://picsum.photos/seed/men7/400/500', isNew: false, isTrending: true },
  { id: 'm8', cat: 'men', brand: 'Adidas', name: 'Men Track Pants', price: 1299, original: 1899, rating: 4.4, count: 145, img: 'https://picsum.photos/seed/men8/400/500', isNew: false, isTrending: false },
  
  // WOMEN
  { id: 'w1', cat: 'women', brand: 'Biba', name: 'Women Printed Kurta Set', price: 1999, original: 3999, rating: 4.6, count: 890, img: 'https://picsum.photos/seed/wom1/400/500', isNew: true, isTrending: true },
  { id: 'w2', cat: 'women', brand: 'Vero Moda', name: 'Women Solid A-Line Dress', price: 1499, original: 2499, rating: 4.3, count: 234, img: 'https://picsum.photos/seed/wom2/400/500', isNew: false, isTrending: false },
  { id: 'w3', cat: 'women', brand: 'Mango', name: 'Women Tailored Trousers', price: 2299, original: 3499, rating: 4.5, count: 112, img: 'https://picsum.photos/seed/wom3/400/500', isNew: true, isTrending: false },
  { id: 'w4', cat: 'women', brand: 'Zara', name: 'Women Crop Top', price: 899, original: 1299, rating: 4.1, count: 445, img: 'https://picsum.photos/seed/wom4/400/500', isNew: false, isTrending: true },
  { id: 'w5', cat: 'women', brand: 'W', name: 'Women Embroidered Ethnic Wear', price: 2499, original: 4999, rating: 4.7, count: 567, img: 'https://picsum.photos/seed/wom5/400/500', isNew: true, isTrending: true },
  { id: 'w6', cat: 'women', brand: 'Forever 21', name: 'Women Denim Jacket', price: 1899, original: 2999, rating: 4.4, count: 321, img: 'https://picsum.photos/seed/wom6/400/500', isNew: false, isTrending: false },
  { id: 'w7', cat: 'women', brand: 'H&M', name: 'Women Pleated Skirt', price: 1299, original: 1999, rating: 4.2, count: 156, img: 'https://picsum.photos/seed/wom7/400/500', isNew: false, isTrending: false },
  { id: 'w8', cat: 'women', brand: 'Sassafras', name: 'Women Floral Wrap Dress', price: 999, original: 1999, rating: 4.0, count: 89, img: 'https://picsum.photos/seed/wom8/400/500', isNew: true, isTrending: true },

  // KIDS
  { id: 'k1', cat: 'kids', brand: 'Gini & Jony', name: 'Boys Printed Cotton T-shirt', price: 499, original: 899, rating: 4.2, count: 45, img: 'https://picsum.photos/seed/kid1/400/500', isNew: true, isTrending: false },
  { id: 'k2', cat: 'kids', brand: 'Allen Solly Junior', name: 'Girls Fit & Flare Dress', price: 1199, original: 1999, rating: 4.5, count: 112, img: 'https://picsum.photos/seed/kid2/400/500', isNew: false, isTrending: true },
  { id: 'k3', cat: 'kids', brand: 'Mothercare', name: 'Baby Rompers Set of 3', price: 1499, original: 2499, rating: 4.8, count: 334, img: 'https://picsum.photos/seed/kid3/400/500', isNew: true, isTrending: true },
  { id: 'k4', cat: 'kids', brand: 'H&M Kids', name: 'Boys Denim Shorts', price: 799, original: 1299, rating: 4.3, count: 88, img: 'https://picsum.photos/seed/kid4/400/500', isNew: false, isTrending: false },
  { id: 'k5', cat: 'kids', brand: 'United Colors of Benetton', name: 'Girls Winter Sweater', price: 1299, original: 2299, rating: 4.6, count: 156, img: 'https://picsum.photos/seed/kid5/400/500', isNew: false, isTrending: false },
  { id: 'k6', cat: 'kids', brand: 'Pepe Jeans', name: 'Boys Casual Shirt', price: 899, original: 1499, rating: 4.1, count: 67, img: 'https://picsum.photos/seed/kid6/400/500', isNew: true, isTrending: false },

  // BEAUTY
  { id: 'b1', cat: 'beauty', brand: 'MAC', name: 'Matte Lipstick - Ruby Woo', price: 1950, original: 1950, rating: 4.9, count: 1250, img: 'https://picsum.photos/seed/bty1/400/500', isNew: false, isTrending: true },
  { id: 'b2', cat: 'beauty', brand: 'Loreal Paris', name: 'Revitalift Hyaluronic Acid Serum', price: 799, original: 999, rating: 4.5, count: 845, img: 'https://picsum.photos/seed/bty2/400/500', isNew: true, isTrending: true },
  { id: 'b3', cat: 'beauty', brand: 'Maybelline', name: 'Fit Me Matte + Poreless Foundation', price: 499, original: 599, rating: 4.6, count: 2100, img: 'https://picsum.photos/seed/bty3/400/500', isNew: false, isTrending: false },
  { id: 'b4', cat: 'beauty', brand: 'Clinique', name: 'Moisture Surge 100H', price: 2950, original: 2950, rating: 4.8, count: 340, img: 'https://picsum.photos/seed/bty4/400/500', isNew: false, isTrending: true },
  { id: 'b5', cat: 'beauty', brand: 'Nykaa', name: 'Nail Enamel Polish', price: 199, original: 249, rating: 4.2, count: 560, img: 'https://picsum.photos/seed/bty5/400/500', isNew: true, isTrending: false },
  { id: 'b6', cat: 'beauty', brand: 'The Body Shop', name: 'Tea Tree Skin Clearing Wash', price: 695, original: 695, rating: 4.4, count: 420, img: 'https://picsum.photos/seed/bty6/400/500', isNew: false, isTrending: false },

  // LIVING
  { id: 'l1', cat: 'living', brand: 'Home Centre', name: 'Cotton 144 TC Bedsheet', price: 899, original: 1999, rating: 4.3, count: 320, img: 'https://picsum.photos/seed/liv1/400/500', isNew: true, isTrending: true },
  { id: 'l2', cat: 'living', brand: 'Bombay Dyeing', name: 'Set of 4 Bath Towels', price: 999, original: 2499, rating: 4.5, count: 180, img: 'https://picsum.photos/seed/liv2/400/500', isNew: false, isTrending: false },
  { id: 'l3', cat: 'living', brand: 'Portico New York', name: 'Comforter Blanket', price: 1499, original: 3999, rating: 4.6, count: 250, img: 'https://picsum.photos/seed/liv3/400/500', isNew: true, isTrending: false },
  { id: 'l4', cat: 'living', brand: 'Spaces', name: 'Textured Cushion Cover', price: 399, original: 799, rating: 4.1, count: 90, img: 'https://picsum.photos/seed/liv4/400/500', isNew: false, isTrending: true },
  { id: 'l5', cat: 'living', brand: 'D\'Decor', name: 'Room Darkening Curtains', price: 1299, original: 2599, rating: 4.7, count: 145, img: 'https://picsum.photos/seed/liv5/400/500', isNew: false, isTrending: false },
  { id: 'l6', cat: 'living', brand: 'Chumbak', name: 'Ceramic Coffee Mug Set', price: 599, original: 999, rating: 4.8, count: 410, img: 'https://picsum.photos/seed/liv6/400/500', isNew: true, isTrending: true }
];

const CATEGORIES = [
  { id: 'men', name: 'Men', img: 'https://source.unsplash.com/random/400x500/?men,fashion' },
  { id: 'women', name: 'Women', img: 'https://source.unsplash.com/random/400x500/?women,fashion' },
  { id: 'kids', name: 'Kids', img: 'https://source.unsplash.com/random/400x500/?kids,clothing' },
  { id: 'beauty', name: 'Beauty', img: 'https://source.unsplash.com/random/400x500/?makeup,cosmetics' },
  { id: 'living', name: 'Home & Living', img: 'https://source.unsplash.com/random/400x500/?home,decor' }
];

const REVIEWS = [
  { user: 'Rahul Sharma', rating: 5, date: '12 Oct 2023', text: 'Amazing quality! The fabric is very soft and comfortable. Perfect fit as expected.' },
  { user: 'Priya Patel', rating: 4, date: '05 Nov 2023', text: 'Good product, looks exactly like the picture. Delivery was slightly delayed.' },
  { user: 'Amit Kumar', rating: 5, date: '22 Dec 2023', text: 'Value for money. The color hasn\'t faded even after multiple washes. Highly recommend.' }
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getProductsByCategory(cat) {
  return PRODUCTS.filter(p => p.cat === cat);
}

function getTrendingProducts() {
  return PRODUCTS.filter(p => p.isTrending).slice(0, 5);
}

function getNewArrivals() {
  return PRODUCTS.filter(p => p.isNew).slice(0, 5);
}
