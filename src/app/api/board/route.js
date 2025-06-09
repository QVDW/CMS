import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Project from "../../../../models/project";

// Remove project from board (set board_active to false)
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");
        
        if (!projectId) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { board_active: false },
            { new: true }
        );
        
        if (!updatedProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            message: "Project removed from board",
            project: updatedProject 
        });
    } catch (error) {
        console.error("Error removing project from board:", error);
        return NextResponse.json(
            { error: "Failed to remove project from board" },
            { status: 500 }
        );
    }
}

// Add project back to board (set board_active to true)
export async function POST(request) {
    try {
        const body = await request.json();
        const { projectId } = body;
        
        if (!projectId) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { board_active: true },
            { new: true }
        );
        
        if (!updatedProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            message: "Project added to board",
            project: updatedProject 
        });
    } catch (error) {
        console.error("Error adding project to board:", error);
        return NextResponse.json(
            { error: "Failed to add project to board" },
            { status: 500 }
        );
    }
} 