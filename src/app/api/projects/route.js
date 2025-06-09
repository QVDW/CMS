import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Project from "../../../../models/project";
import Client from "../../../../models/client";

// Function to generate next project ID
async function generateProjectId() {
    // Find the highest existing project ID (numeric)
    const lastProject = await Project.findOne(
        { project_id: { $regex: /^\d+$/ } },
        {},
        { sort: { project_id: -1 } }
    );

    if (!lastProject) {
        return "1";
    }

    // Convert to number and increment
    const lastNumber = parseInt(lastProject.project_id);
    const nextNumber = lastNumber + 1;

    return nextNumber.toString();
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            client_id,
            project_name,
            project_description,
            status
        } = body;

        console.log("Received project data:", body);

        // Validate required fields
        if (!client_id || !project_name) {
            return NextResponse.json(
                { error: "client_id and project_name are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        console.log("MongoDB connected successfully");

        // Verify that the client exists
        const client = await Client.findOne({ client_id });
        if (!client) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        // Always auto-generate project_id
        const project_id = await generateProjectId();
        console.log("Generated project ID:", project_id);

        const projectData = {
            project_id,
            client_id,
            project_name,
            project_description: project_description || "",
            status: status || "Not Started",
            board_active: true  // Default new projects to be active on the board
        };

        console.log("Attempting to create project with data:", projectData);

        const result = await Project.create(projectData);
        console.log("Project created successfully:", result);

        return NextResponse.json({ message: "Project created", project: result });
    } catch (error) {
        console.error("Error in POST /api/projects:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            { error: error.message || "Failed to create project" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(request.url);
        const sortOrder = searchParams.get('sort') === 'asc' ? 1 : -1;
        const status = searchParams.get('status');
        const client_id = searchParams.get('client_id');

        // Build query object
        let query = {};
        if (status) {
            query.status = status;
        }
        if (client_id) {
            query.client_id = client_id;
        }
        
        // Check if this is a board request (only show board_active projects for board)
        const isBoard = searchParams.get('board') === 'true';
        if (isBoard) {
            // For board requests, show projects that are either explicitly active or don't have the field set (default to active)
            query.$or = [
                { board_active: true },
                { board_active: { $exists: false } }
            ];
        }

        const projects = await Project.find(query).sort({
            project_name: sortOrder,
            created_at: sortOrder
        });

        // Populate with client information and ensure board_active is set
        const projectsWithClients = await Promise.all(
            projects.map(async (project) => {
                const client = await Client.findOne({ client_id: project.client_id });
                const projectObj = project.toObject();
                
                // Ensure board_active is set (default to true for existing projects)
                if (projectObj.board_active === undefined) {
                    projectObj.board_active = true;
                }
                
                return {
                    ...projectObj,
                    client: client ? {
                        client_id: client.client_id,
                        company_name: client.company_name,
                        contact_name: client.contact_name
                    } : null
                };
            })
        );

        return NextResponse.json(projectsWithClients);
    } catch (error) {
        console.error("Error in GET /api/projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        const project = await Project.findByIdAndDelete(id);
        
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Project deleted" });
    } catch (error) {
        console.error("Error in DELETE /api/projects:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
} 