require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Hotel = require("../src/models/Hotel");
const RoomType = require("../src/models/RoomType");
const Room = require("../src/models/Room");
const PricingRule = require("../src/models/PricingRule");

const OWNER_EMAIL = "owner@test.com";
const GUEST_EMAIL = "guest2@test.com";

async function findOrCreateUser({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) return existing;

  return User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role
  });
}

async function findOrCreateRoomType(hotelId, data) {
  return RoomType.findOneAndUpdate(
    { hotelId, name: data.name },
    { $setOnInsert: { hotelId, ...data } },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );
}

async function seedRooms(roomTypeId, roomNumbers) {
  for (const roomNumber of roomNumbers) {
    await Room.findOneAndUpdate(
      { roomTypeId, roomNumber },
      { $setOnInsert: { roomTypeId, roomNumber, housekeepingStatus: "clean" } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
    );
  }
}

async function seedPricingRules(roomTypeId, rules) {
  for (const rule of rules) {
    await PricingRule.findOneAndUpdate(
      { roomTypeId, season: rule.season },
      { $set: { multiplier: rule.multiplier } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );
  }
}

async function seed() {
  await connectDB();

  const owner = await findOrCreateUser({
    name: "Test Hotel Owner",
    email: OWNER_EMAIL,
    password: "Owner@123",
    role: "hotelOwner"
  });
  const guest = await findOrCreateUser({
    name: "Test Guest",
    email: GUEST_EMAIL,
    password: "Guest@123",
    role: "guest"
  });

  const hotel = await Hotel.findOneAndUpdate(
    { ownerId: owner._id, name: "P03 Demo Hotel" },
    {
      $setOnInsert: {
        ownerId: owner._id,
        name: "P03 Demo Hotel",
        city: "Bengaluru",
        amenities: ["WiFi", "Breakfast", "Parking"],
        rating: 4.2
      }
    },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );

  const standard = await findOrCreateRoomType(hotel._id, {
    name: "Standard Room",
    basePrice: 2500,
    totalRooms: 3,
    capacity: 2
  });
  const deluxe = await findOrCreateRoomType(hotel._id, {
    name: "Deluxe Room",
    basePrice: 4500,
    totalRooms: 2,
    capacity: 4
  });

  await seedRooms(standard._id, ["S-101", "S-102", "S-103"]);
  await seedRooms(deluxe._id, ["D-201", "D-202"]);

  for (const roomType of [standard, deluxe]) {
    await seedPricingRules(roomType._id, [
      { season: "peak", multiplier: 1.5 },
      { season: "weekend", multiplier: 1.2 }
    ]);
  }

  const roomCount = await Room.countDocuments({
    roomTypeId: { $in: [standard._id, deluxe._id] }
  });
  const pricingRuleCount = await PricingRule.countDocuments({
    roomTypeId: { $in: [standard._id, deluxe._id] }
  });

  console.log("Seed completed successfully.");
  console.log(`ownerId: ${owner._id}`);
  console.log(`guestId: ${guest._id}`);
  console.log(`hotelId: ${hotel._id}`);
  console.log(`standardRoomTypeId: ${standard._id}`);
  console.log(`deluxeRoomTypeId: ${deluxe._id}`);
  console.log(`roomCount: ${roomCount}`);
  console.log(`pricingRuleCount: ${pricingRuleCount}`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
