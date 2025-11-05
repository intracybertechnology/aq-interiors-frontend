import mongoose from 'mongoose';
import Client from '../src/models/Client';
import { connectDB } from '../src/config/database';

// Client order based on the image provided
const clientOrderMap: { [key: string]: number } = {
  // Left Column
  'Giordano': 1,
  'EMKE Group (Lulu)': 2,
  'Sharjah Co-operative Society': 3,
  'Mega Mart': 4,
  'Techorbit': 5,
  'Oakberry': 6,
  'Leader Sport': 7,
  'Indian Silks': 8,
  'Al Falah Typing Center': 9,
  'Lovey Dovey': 10,
  
  // Right Column
  'Medical Fitness Center': 11,
  'Yellow Hat': 12,
  'Kiwi': 13,
  'Uomo Boss': 14,
  'Nikai': 15,
  'Landmark Group': 16,
  'Sport Land Group': 17,
  'Address': 18,
  'Cup Of Joe': 19,
  'Baci': 20,
  'Ruby Store': 21,
  'All About': 22,
  
  // Additional clients (if they exist)
  'Hip Pop': 23,
  'Promise Store': 24
};

async function updateClientOrder() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('📋 Fetching all clients...');
    const clients = await Client.find({});
    
    console.log(`✅ Found ${clients.length} clients`);
    
    let updatedCount = 0;
    
    for (const client of clients) {
      const orderNumber = clientOrderMap[client.name];
      
      if (orderNumber) {
        await Client.findOneAndUpdate(
          { id: client.id },
          { order: orderNumber },
          { new: true }
        );
        console.log(`✅ Updated "${client.name}" with order: ${orderNumber}`);
        updatedCount++;
      } else {
        // If client not in the map, assign a high order number
        await Client.findOneAndUpdate(
          { id: client.id },
          { order: 999 },
          { new: true }
        );
        console.log(`⚠️  "${client.name}" not found in order map, assigned order: 999`);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} clients with order numbers`);
    console.log('🎉 Migration completed!');
    
    // Verify the order
    console.log('\n📊 Verifying client order...');
    const orderedClients = await Client.find({ isActive: true }).sort({ order: 1 });
    orderedClients.forEach((client: any, index: number) => {
      console.log(`${index + 1}. ${client.name} - Order: ${client.order}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the migration
updateClientOrder();