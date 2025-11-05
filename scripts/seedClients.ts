import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Client schema (matching your Client model)
const clientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String },
  location: { type: String, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

const clientsData = [
  { id: 'client-001', name: 'Medical Fitness Center', location: 'Al Quoz Mall (DHA)', category: 'Healthcare' },
  { id: 'client-002', name: 'EMKE Group (Lulu)', location: 'UAE', category: 'Retail' },
  { id: 'client-003', name: 'Al Falah Typing Center', location: 'Al Quoz Mall', category: 'Services' },
  { id: 'client-004', name: 'Techorbit', location: 'UAE', category: 'Technology' },
  { id: 'client-005', name: 'Sharjah Co-operative Society', location: 'Sharjah', category: 'Retail' },
  { id: 'client-006', name: 'Mega Mart', location: 'Sharjah Dubai', category: 'Retail' },
  { id: 'client-007', name: 'Leader Sport', location: 'Dubai, Abu Dhabi', category: 'Sports' },
  { id: 'client-008', name: 'Lovey Dovey', location: 'UAE', category: 'Fashion' },
  { id: 'client-009', name: 'Yellow Hat', location: 'Dubai, Abu Dhabi', category: 'Automotive' },
  { id: 'client-010', name: 'Kiwi', location: 'Sharjah', category: 'Food & Beverage' },
  { id: 'client-011', name: 'Oakberry', location: 'Dubai', category: 'Food & Beverage' },
  { id: 'client-012', name: 'Uomo Boss', location: 'Dubai', category: 'Fashion' },
  { id: 'client-013', name: 'Hip Pop', location: 'JBR Dubai', category: 'Food & Beverage' },
  { id: 'client-014', name: 'Nikai', location: 'Sharjah, Jebel Ali', category: 'Electronics' },
  { id: 'client-015', name: 'Indian Silks', location: 'UAE', category: 'Fashion' },
  { id: 'client-016', name: 'Promise Store', location: 'Abu Dhabi, Dubai, Al Ain', category: 'Retail' },
  { id: 'client-017', name: 'Landmark Group', location: 'UAE', category: 'Retail' },
  { id: 'client-018', name: 'Sport Land Group', location: 'Dubai', category: 'Sports' },
  { id: 'client-019', name: 'Address', location: 'Dubai', category: 'Hospitality' },
  { id: 'client-020', name: 'Cup Of Joe', location: 'Dubai', category: 'Food & Beverage' },
  { id: 'client-021', name: 'Baci', location: 'Abu Dhabi', category: 'Food & Beverage' },
  { id: 'client-022', name: 'Ruby Store', location: 'Al Ain', category: 'Retail' },
  { id: 'client-023', name: 'Giordano', location: 'Dubai', category: 'Fashion' },
  { id: 'client-024', name: 'All About', location: 'Dubai', category: 'Retail' }
];

const seedClients = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('Missing MONGODB_URI environment variable');
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing clients count
    const existingCount = await Client.countDocuments();
    console.log(`📊 Existing clients in database: ${existingCount}`);

    // Insert clients (will skip duplicates due to unique id)
    let addedCount = 0;
    let skippedCount = 0;

    for (const clientData of clientsData) {
      try {
        const existing = await Client.findOne({ id: clientData.id });
        if (existing) {
          console.log(`⏭️  Skipping ${clientData.name} (already exists)`);
          skippedCount++;
        } else {
          await Client.create(clientData);
          console.log(`✅ Added: ${clientData.name}`);
          addedCount++;
        }
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`⏭️  Skipping ${clientData.name} (duplicate)`);
          skippedCount++;
        } else {
          throw error;
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Added: ${addedCount} clients`);
    console.log(`⏭️  Skipped: ${skippedCount} clients`);
    console.log(`📈 Total in database: ${await Client.countDocuments()}`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedClients();