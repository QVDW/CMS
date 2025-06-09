import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Project from "../../../../../models/project";

export async function POST(request) {
    try {
        await connectMongoDB();
        
        // Update all projects that don't have board_active field to set it to true
        const result = await Project.updateMany(
            { board_active: { $exists: false } },
            { $set: { board_active: true } }
        );
        
        console.log(`Migration completed: ${result.modifiedCount} projects updated`);
        
        return NextResponse.json({ 
            message: "Migration completed successfully",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json(
            { error: "Migration failed" },
            { status: 500 }
        );
    }
} 