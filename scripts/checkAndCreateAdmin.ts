import { connectDB } from '../src/config/database';
import Admin from '../src/models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const checkAndCreateAdmin = async () => {
  try {
    await connectDB();
    
    console.log('\n🔍 Checking database for admins...\n');
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@alqethaa.ae';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check ALL admins
    const allAdmins = await Admin.find({});
    
    console.log('📊 Admin Status:');
    console.log('================');
    console.log(`Total admins: ${allAdmins.length}\n`);
    
    if (allAdmins.length > 0) {
      console.log('✅ Existing admins found:\n');
      allAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Active: ${admin.isActive}`);
        console.log(`   Last Login: ${admin.lastLogin || 'Never'}`);
        console.log(`   Created: ${admin.createdAt}\n`);
      });
      
      console.log('💡 If you need to reset a password, uncomment the reset section below and run again.\n');
      
      // UNCOMMENT BELOW TO RESET PASSWORD
      /*
      const adminToReset = await Admin.findOne({ email: adminEmail });
      if (adminToReset) {
        adminToReset.password = adminPassword;
        await adminToReset.save(); // This will trigger the pre-save hook to hash
        console.log(`🔑 Password reset for: ${adminEmail}`);
      }
      */
      
    } else {
      console.log('❌ No admins found!\n');
      console.log('🔧 Creating default admin account...\n');
      
      // Create new admin - password will be hashed by pre-save hook
      const admin = new Admin({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        isActive: true
      });
      
      await admin.save();
      
      console.log('✅ Admin created successfully!\n');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error occurred:', error);
    process.exit(1);
  }
};

checkAndCreateAdmin();