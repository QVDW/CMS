import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Hosting from "../../../../../models/hosting";
import Client from "../../../../../models/client";

export async function PUT(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        const body = await request.json();
        const {
            client_id,
            host_provider,
            username,
            email,
            password,
            domain_name,
            putty_connection,
            status
        } = body;

        console.log("Received hosting update data:", { 
            ...body, 
            password: body.password ? "***" : undefined,
            putty_connection: body.putty_connection ? { 
                ...body.putty_connection, 
                password: body.putty_connection.password ? "***" : undefined 
            } : undefined 
        });

        // Validate required fields
        if (!client_id || !host_provider) {
            return NextResponse.json(
                { error: "Client and Host Provider are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if hosting exists
        const currentHosting = await Hosting.findById(id);
        if (!currentHosting) {
            return NextResponse.json(
                { error: "Hosting not found" },
                { status: 404 }
            );
        }

        // Verify that the client exists
        const client = await Client.findOne({ client_id });
        if (!client) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        const updateData = {
            client_id,
            host_provider,
            status: status || "Active"
        };

        // Add optional fields only if they have values
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (domain_name !== undefined) updateData.domain_name = domain_name;

        // Only update main password if provided (not empty)
        if (password && password.trim() !== "") {
            updateData.password = password;
        }

        // Handle putty_connection updates
        if (putty_connection) {
            updateData.putty_connection = {
                hostname: putty_connection.hostname || "",
                port: putty_connection.port || 22,
                username: putty_connection.username || "",
                connection_type: putty_connection.connection_type || 'SSH'
            };

            // Only update SSH password if provided (not empty)
            if (putty_connection.password && putty_connection.password.trim() !== "") {
                updateData.putty_connection.password = putty_connection.password;
            }
        }

        console.log("Updating hosting with data:", { 
            ...updateData, 
            password: updateData.password ? "***" : undefined,
            putty_connection: updateData.putty_connection ? { 
                ...updateData.putty_connection, 
                password: updateData.putty_connection.password ? "***" : undefined 
            } : undefined 
        });

        const updatedHosting = await Hosting.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log("Updated hosting successfully");

        // Remove passwords from response
        const responseData = {
            ...updatedHosting.toObject(),
            password: "***",
            putty_connection: {
                ...updatedHosting.putty_connection,
                password: "***"
            }
        };

        return NextResponse.json({ message: "Hosting updated", hosting: responseData });
    } catch (error) {
        console.error("Error in PUT /api/hostings/[id]:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update hosting" },
            { status: 500 }
        );
    }
}

export async function GET(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        await connectMongoDB();
        const hosting = await Hosting.findById(id);

        if (!hosting) {
            return NextResponse.json(
                { error: "Hosting not found" },
                { status: 404 }
            );
        }

        // Get associated client information
        const client = await Client.findOne({ client_id: hosting.client_id });
        const hostingObj = hosting.toObject();

        // Remove sensitive information from response
        delete hostingObj.password;
        if (hostingObj.putty_connection && hostingObj.putty_connection.password) {
            delete hostingObj.putty_connection.password;
        }

        const hostingWithClient = {
            ...hostingObj,
            client: client ? {
                client_id: client.client_id,
                company_name: client.company_name,
                contact_name: client.contact_name,
                email: client.email
            } : null
        };

        return NextResponse.json({ hosting: hostingWithClient });
    } catch (error) {
        console.error("Error in GET /api/hostings/[id]:", error);
        return NextResponse.json(
            { error: "Failed to fetch hosting" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        await connectMongoDB();
        const hosting = await Hosting.findByIdAndDelete(id);

        if (!hosting) {
            return NextResponse.json(
                { error: "Hosting not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Hosting deleted" });
    } catch (error) {
        console.error("Error in DELETE /api/hostings/[id]:", error);
        return NextResponse.json(
            { error: "Failed to delete hosting" },
            { status: 500 }
        );
    }
} 