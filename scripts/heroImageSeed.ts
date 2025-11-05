import mongoose from 'mongoose';
import HeroImage from '../src/models/HeroImage';
import dotenv from 'dotenv';

dotenv.config();

const seedHeroImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aq-interiors');
    console.log('Connected to MongoDB');

    // Clear existing hero images
    await HeroImage.deleteMany({});
    console.log('Cleared existing hero images');

    // Seed data - hardcoded images
    const heroImagesData = [
      {
        title: 'Hero Background 1',
        imageUrl: '/images/hero/hero-bg.jpg',
        order: 1,
        isActive: true
      },
      {
        title: 'Hero Background 2',
        imageUrl: '/images/hero/hero1-bg.jpg',
        order: 2,
        isActive: true
      },
      {
        title: 'Hero Background 3',
        imageUrl: '/images/hero/hero2-bg.jpg',
        order: 3,
        isActive: true
      },
      {
        title: 'Hero Background 4',
        imageUrl: '/images/hero/hero3-bg.jpg',
        order: 4,
        isActive: true
      },
      {
        title: 'Hero Background 5',
        imageUrl: '/images/hero/hero5-bg.jpg',
        order: 5,
        isActive: true
      }
    ];

    // Insert seed data
    const createdImages = await HeroImage.insertMany(heroImagesData);
    console.log(`✅ Successfully seeded ${createdImages.length} hero images`);

    // Display created images
    console.log('\nSeeded Hero Images:');
    createdImages.forEach(img => {
      console.log(`  - ${img.order}. ${img.title} (${img.imageUrl})`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seed
seedHeroImages();