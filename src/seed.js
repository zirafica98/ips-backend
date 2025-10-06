import { db } from './services/firebase.js';

const products = [
  {
    name: 'Kočione pločice Bosch BP1234',
    price: 4200,
    description: 'Set od 4 keramičke kočione pločice za VW Golf 6/7, model Bosch BP1234',
    category: 'Kočioni sistem',
    brand: 'Bosch',
    stock: 25,
    sku: 'BOS-BP1234',
    image: 'https://picsum.photos/300?random=101'
  },
  {
    name: 'Filter ulja Mann HU 719/7 X',
    price: 890,
    description: 'Filter ulja visoke efikasnosti za benzinske i dizel motore.',
    category: 'Filteri',
    brand: 'Mann',
    stock: 100,
    sku: 'MAN-HU7197X',
    image: 'https://picsum.photos/300?random=102'
  },
  {
    name: 'Akumulator Varta Blue Dynamic 60Ah',
    price: 10500,
    description: 'Pouzdan akumulator 12V, 60Ah, CCA 540A — Varta Blue Dynamic serija.',
    category: 'Elektrika',
    brand: 'Varta',
    stock: 10,
    sku: 'VAR-60AH-BLUE',
    image: 'https://picsum.photos/300?random=103'
  },
  {
    name: 'Motorno ulje Castrol Edge 5W-30 LL',
    price: 4600,
    description: 'Sintetičko ulje 5W-30 za moderne VW, Audi, BMW i Mercedes motore.',
    category: 'Ulja i tečnosti',
    brand: 'Castrol',
    stock: 50,
    sku: 'CAS-5W30-EDGE',
    image: 'https://picsum.photos/300?random=104'
  },
  {
    name: 'Set brisača Bosch Aerotwin 600/480mm',
    price: 3100,
    description: 'Bosch Aerotwin brisači — savršena vidljivost i tihi rad.',
    category: 'Održavanje',
    brand: 'Bosch',
    stock: 70,
    sku: 'BOS-AERO-600480',
    image: 'https://picsum.photos/300?random=105'
  }
];

const seedData = async () => {
  try {
    for (const product of products) {
      await db.collection('products').add(product);
      console.log(`✅ Added: ${product.name}`);
    }
    console.log('🎉 Auto delovi uspešno ubačeni u Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Greška pri dodavanju proizvoda:', error);
    process.exit(1);
  }
};

seedData();
