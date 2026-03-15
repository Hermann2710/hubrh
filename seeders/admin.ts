"use server";

import "dotenv/config";
import bcrypt from "bcryptjs";
import { User } from "../lib/models/User.ts";
import { Department } from "../lib/models/Department.ts";
import { Cellule } from "../lib/models/Cellule.ts";
import dbConnect from "../lib/mongoose.ts";

const seedDatabase = async () => {
  try {
    await dbConnect();
    console.log("Connexion à la base de données...");

    await User.deleteMany({});
    await Department.deleteMany({});
    await Cellule.deleteMany({});
    console.log("Base de données vidée.");

    const hashedPassword = await bcrypt.hash("admin12345", 12);

    const usersData = [
      { name: "Senku Admin", email: "senku@example.com" },
      { name: "Abel Admin", email: "abel@example.com" },
      { name: "System Admin", email: "admin@example.com" },
      { name: "Chef Dept Informatique", email: "info@example.com" },
      { name: "Chef Dept RH", email: "rh@example.com" },
      { name: "Chef Cellule Dev", email: "dev@example.com" },
      { name: "Chef Cellule Design", email: "design@example.com" },
    ];

    const createdUsers = await Promise.all(
      usersData.map((u) =>
        User.create({
          ...u,
          password: hashedPassword,
          role: "admin",
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
        })
      )
    );
    console.log(`${createdUsers.length} utilisateurs (admins) créés.`);

    const deptInfo = await Department.create({
      name: "Informatique",
      description: "Département des technologies",
      chef: createdUsers.find(u => u.email === "info@example.com")?._id,
    });

    const deptRH = await Department.create({
      name: "Ressources Humaines",
      description: "Gestion des talents",
      chef: createdUsers.find(u => u.email === "rh@example.com")?._id,
    });
    console.log("Départements créés.");

    await Cellule.create([
      {
        name: "Développement Web",
        description: "Focus Next.js et React",
        department: deptInfo._id,
        chef: createdUsers.find(u => u.email === "dev@example.com")?._id,
        members: [createdUsers[0]._id, createdUsers[1]._id],
      },
      {
        name: "UI/UX Design",
        description: "Conception graphique",
        department: deptInfo._id,
        chef: createdUsers.find(u => u.email === "design@example.com")?._id,
        members: [createdUsers[2]._id],
      }
    ]);
    console.log("Cellules créées.");

    console.log("--- Seeding terminé avec succès ---");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors du seeding:", error);
    process.exit(1);
  }
};

seedDatabase();