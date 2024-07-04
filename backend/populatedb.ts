import * as mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import Photo from "./models/photo";

mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URL || "";

async function createPhoto1(): Promise<void> {
  const waldo = new Photo({
    name: "wheres-waldo",
    targets: [
      { name: "waldo", position: { x: 474, y: 1546 } },
      { name: "wilma", position: { x: 2140, y: 1393 } },
    ],
  });

  await waldo.save();
  console.log("Photo created!");
}

async function main(): Promise<void> {
  console.log("About to connect");
  await mongoose.connect(mongoDB);
  console.log("Connected...");
  await createPhoto1();
  console.log("Closing mongoose...");
  mongoose.connection.close();
}

main().catch(err => console.log(err));
