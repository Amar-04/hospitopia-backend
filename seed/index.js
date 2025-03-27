import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js"; // Ensure your DB config is correctly set up

dotenv.config();

const sourceDBName = "hospitopia"; // Change this to your source database name
const targetDBName = "hospitopia2"; // Change this to your target database name
const collectionName = "kitcheninventories"; // Change this to your collection name

const copyCollection = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("Connected to MongoDB");

        // Connect to source and target databases
        const sourceDB = mongoose.connection.useDb(sourceDBName);
        const targetDB = mongoose.connection.useDb(targetDBName);

        // Fetch documents from source collection
        const documents = await sourceDB.collection(collectionName).find().toArray();

        if (documents.length === 0) {
            console.log("No documents found in source collection.");
            return;
        }

        // Insert documents into target collection
        await targetDB.collection(collectionName).insertMany(documents);
        console.log("Collection copied successfully!");
    } catch (error) {
        console.error("Error copying collection:", error);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

copyCollection();
