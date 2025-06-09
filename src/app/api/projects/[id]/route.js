import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Project from "../../../../../models/project";
import Client from "../../../../../models/client";

export async function PUT(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        const body = await request.json();
        const {
            client_id,
            project_name,
            project_description,
            status,
            board_active
        } = body;

        await connectMongoDB();

        // Check if project exists
        const currentProject = await Project.findById(id);
        if (!currentProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // If this is a status-only update (from the board), use existing values
        const isStatusOnlyUpdate = status && !client_id && !project_name;
        
        let updateData;
        if (isStatusOnlyUpdate) {
            updateData = { status };
        } else {
            // Validate required fields for full updates
            if (!client_id || !project_name) {
                return NextResponse.json(
                    { error: "client_id and project_name are required for full updates" },
                    { status: 400 }
                );
            }

            // Verify that the client exists for full updates
            const client = await Client.findOne({ client_id });
            if (!client) {
                return NextResponse.json(
                    { error: "Client not found" },
                    { status: 404 }
                );
            }

            updateData = {
                client_id,
                project_name,
                project_description: project_description || "",
                status: status || "Not Started"
            };
            
            // Include board_active if it's provided
            if (board_active !== undefined) {
                updateData.board_active = board_active;
            }
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log("Updated project:", updatedProject);

        return NextResponse.json({ message: "Project updated", project: updatedProject });
    } catch (error) {
        console.error("Error in PUT /api/projects/[id]:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update project" },
            { status: 500 }
        );
    }
}

export async function GET(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        await connectMongoDB();
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Get associated client information
        const client = await Client.findOne({ client_id: project.client_id });
        const projectObj = project.toObject();
        
        // Ensure board_active is set (default to true for existing projects)
        if (projectObj.board_active === undefined) {
            projectObj.board_active = true;
        }
        
        const projectWithClient = {
            ...projectObj,
            client: client ? {
                client_id: client.client_id,
                company_name: client.company_name,
                contact_name: client.contact_name,
                email: client.email
            } : null
        };

        return NextResponse.json({ project: projectWithClient });
    } catch (error) {
        console.error("Error in GET /api/projects/[id]:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

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
        console.error("Error in DELETE /api/projects/[id]:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
} 