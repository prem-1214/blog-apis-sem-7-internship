import mongoose from "mongoose";

import { config } from "../src/config/config";
import { DB_NAME } from "../src/constants/index";
import { Permission } from "../src/models/permission.model";
import { Role } from "../src/models/role.model";

const seed = async () => {
  await mongoose.connect(`${config.get("MONGODB_URI")}${DB_NAME}`);

  // Create permissions
  const permissions = await Permission.insertMany([
    { name: "Create Blog", action: ["create"], resources: ["blog"] },
    { name: "Read Blog", action: ["read"], resources: ["blog"] },
    { name: "Update Blog", action: ["update"], resources: ["blog"] },
    { name: "Delete Blog", action: ["delete"], resources: ["blog"] },
    { name: "Manage Users", action: ["manage"], resources: ["user"] },
  ]);

  // Map permissions for reuse
  const permMap = Object.fromEntries(permissions.map((p) => [p.name, p._id]));

  // Create roles
  await Role.insertMany([
    {
      name: "user",
      description: "Can read published blogs",
      permissions: [permMap["Read Blog"]],
    },
    {
      name: "author",
      description: "Can manage own blogs",
      permissions: [
        permMap["Create Blog"],
        permMap["Read Blog"],
        permMap["Update Blog"],
      ],
    },
    {
      name: "admin",
      description: "Full access",
      permissions: Object.values(permMap),
    },
  ]);

  console.log("Roles & Permissions seeded successfully!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
