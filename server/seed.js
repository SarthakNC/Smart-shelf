import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-shelf';

const today = new Date();
function daysFromNow(n) {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d;
}
function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
}

const SEED_ITEMS = [
  { name: 'Amul Taaza Milk 500ml', quantity: 12, unit: 'pkt', category: 'Dairy', expiryDate: daysFromNow(2), addedDate: daysAgo(5), costPrice: 22, sellingPrice: 25 },
  { name: 'Mother Dairy Curd 400g', quantity: 8, unit: 'pcs', category: 'Dairy', expiryDate: daysFromNow(1), addedDate: daysAgo(3), costPrice: 30, sellingPrice: 35 },
  { name: 'Amul Paneer 200g', quantity: 5, unit: 'pkt', category: 'Dairy', expiryDate: daysFromNow(3), addedDate: daysAgo(2), costPrice: 80, sellingPrice: 90 },
  { name: 'Britannia Bread', quantity: 6, unit: 'pkt', category: 'Bakery', expiryDate: daysFromNow(1), addedDate: daysAgo(4), costPrice: 35, sellingPrice: 40 },
  { name: 'Parle-G Biscuits 250g', quantity: 24, unit: 'pkt', category: 'Snacks', expiryDate: daysFromNow(45), addedDate: daysAgo(10), costPrice: 20, sellingPrice: 25 },
  { name: 'Maggi 2-Minute Noodles', quantity: 30, unit: 'pkt', category: 'Packaged Food', expiryDate: daysFromNow(90), addedDate: daysAgo(7), costPrice: 12, sellingPrice: 14 },
  { name: 'Aashirvaad Atta 5kg', quantity: 3, unit: 'pkt', category: 'Grains & Flour', expiryDate: daysFromNow(60), addedDate: daysAgo(15), costPrice: 260, sellingPrice: 295 },
  { name: 'Fortune Sunflower Oil 1L', quantity: 7, unit: 'pcs', category: 'Oil & Ghee', expiryDate: daysFromNow(120), addedDate: daysAgo(20), costPrice: 140, sellingPrice: 160 },
  { name: 'Lays Classic Salted 52g', quantity: 15, unit: 'pkt', category: 'Snacks', expiryDate: daysFromNow(30), addedDate: daysAgo(5), costPrice: 18, sellingPrice: 20 },
  { name: 'Coca-Cola 750ml', quantity: 10, unit: 'pcs', category: 'Beverages', expiryDate: daysFromNow(5), addedDate: daysAgo(30), costPrice: 35, sellingPrice: 40 },
  { name: 'Thums Up 2L', quantity: 4, unit: 'pcs', category: 'Beverages', expiryDate: daysFromNow(6), addedDate: daysAgo(25), costPrice: 75, sellingPrice: 85 },
  { name: 'Haldiram Namkeen Bhujia 200g', quantity: 10, unit: 'pkt', category: 'Snacks', expiryDate: daysFromNow(20), addedDate: daysAgo(8), costPrice: 55, sellingPrice: 65 },
  { name: 'Tata Salt 1kg', quantity: 20, unit: 'pkt', category: 'Spices', expiryDate: daysFromNow(365), addedDate: daysAgo(30), costPrice: 20, sellingPrice: 24 },
  { name: 'MDH Garam Masala 100g', quantity: 8, unit: 'pkt', category: 'Spices', expiryDate: daysFromNow(180), addedDate: daysAgo(12), costPrice: 70, sellingPrice: 82 },
  { name: 'Dettol Soap 75g', quantity: 15, unit: 'pcs', category: 'Personal Care', expiryDate: daysFromNow(300), addedDate: daysAgo(14), costPrice: 38, sellingPrice: 45 },
  { name: 'Surf Excel 1kg', quantity: 6, unit: 'pkt', category: 'Personal Care', expiryDate: daysFromNow(240), addedDate: daysAgo(18), costPrice: 180, sellingPrice: 210 },
  { name: 'India Gate Basmati Rice 1kg', quantity: 4, unit: 'pkt', category: 'Grains & Flour', expiryDate: daysFromNow(150), addedDate: daysAgo(22), costPrice: 120, sellingPrice: 145 },
  { name: 'Amul Butter 100g', quantity: 3, unit: 'pcs', category: 'Dairy', expiryDate: daysFromNow(4), addedDate: daysAgo(6), costPrice: 50, sellingPrice: 56 },
  { name: 'Kurkure Masala Munch', quantity: 18, unit: 'pkt', category: 'Snacks', expiryDate: daysFromNow(25), addedDate: daysAgo(4), costPrice: 8, sellingPrice: 10 },
  { name: 'Frooti Mango 200ml', quantity: 20, unit: 'pcs', category: 'Beverages', expiryDate: daysFromNow(7), addedDate: daysAgo(10), costPrice: 8, sellingPrice: 10 },
  { name: 'Nestle Everyday Milk Powder 200g', quantity: 2, unit: 'pkt', category: 'Dairy', expiryDate: daysFromNow(0), addedDate: daysAgo(40), costPrice: 90, sellingPrice: 105 },
  { name: 'Dabur Honey 250g', quantity: 5, unit: 'pcs', category: 'Packaged Food', expiryDate: daysFromNow(200), addedDate: daysAgo(50), costPrice: 140, sellingPrice: 165 },
  { name: 'Brooke Bond Taj Mahal Tea 250g', quantity: 7, unit: 'pkt', category: 'Beverages', expiryDate: daysFromNow(90), addedDate: daysAgo(8), costPrice: 130, sellingPrice: 150 },
  { name: 'Good Day Cashew Cookies', quantity: 12, unit: 'pkt', category: 'Snacks', expiryDate: daysFromNow(35), addedDate: daysAgo(6), costPrice: 25, sellingPrice: 30 },
  { name: 'Yakult Probiotic Drink', quantity: 4, unit: 'pcs', category: 'Dairy', expiryDate: daysFromNow(-1), addedDate: daysAgo(10), costPrice: 70, sellingPrice: 80 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing items');

    // Insert seed data
    const created = await Item.insertMany(SEED_ITEMS);
    console.log(`🌱 Seeded ${created.length} items`);

    await mongoose.disconnect();
    console.log('✅ Done! Database seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
