// simple seed to create one donor and one ngo and sample donation
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./src/models/User');
const Donation = require('./src/models/Donation');
const bcrypt = require('bcryptjs');
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_donation_demo';
async function seed() {
  await mongoose.connect(uri);
  console.log('Connected to db for seeding');
  await User.deleteMany({});
  await Donation.deleteMany({});
  const salt = await bcrypt.genSalt(10);
  const donor = new User({ name:'Demo Donor', email:'donor@example.com', password: await bcrypt.hash('password',salt), role:'donor', city:'Mumbai', pincode:'400001' });
  const ngo = new User({ name:'Demo NGO', email:'ngo@example.com', password: await bcrypt.hash('password',salt), role:'ngo', city:'Mumbai', pincode:'400001' });
  await donor.save(); await ngo.save();
  const donation = new Donation({
  title:'Clothes for winter',
  description:'Packed clothes',
  category:'clothes',
  donor:donor._id,
  state:'Maharashtra',
  city:'Mumbai',
  pincode:'400001'
});

  await donation.save();
  console.log('Seed done. Donor:', donor.email, 'NGO:', ngo.email);
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });
