import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../lib/models/User.ts";
import dbConnect from "../lib/mongoose.ts";

const seedAdmin = async () => {
  try {
    await dbConnect();

    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("L'administrateur existe déjà.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin12345", 12);

    const admin = new User({
      name: "Administrater",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      image: "",
    });

    await admin.save();

    console.log("Super Admin créé avec succès !");
    console.log("Email: admin@example.com");
    console.log("Password: admin12345");
    
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors du seeding:", error);
    process.exit(1);
  }
};

seedAdmin();