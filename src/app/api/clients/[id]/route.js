import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Client from "../../../../../models/client";

export async function PUT(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        const body = await request.json();
        const {
            client_id,
            company_name,
            contact_name,
            email,
            phone_number,
            address,
            industry,
            client_since,
            status
        } = body;

        // Validate required fields
        if (!company_name || !contact_name) {
            return NextResponse.json(
                { error: "company_name and contact_name are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if client exists
        const currentClient = await Client.findById(id);
        if (!currentClient) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        // If client_id is being changed, check if new client_id already exists
        if (client_id && client_id !== currentClient.client_id) {
            const existingClient = await Client.findOne({ client_id, _id: { $ne: id } });
            if (existingClient) {
                return NextResponse.json(
                    { error: "Client ID already exists" },
                    { status: 409 }
                );
            }
        }

        const updateData = {
            client_id: client_id || currentClient.client_id,
            company_name,
            contact_name,
            email: email || "",
            phone_number: phone_number || "",
            address: address || "",
            industry: industry || "",
            status: status || "Prospect"
        };

        // Only update client_since if provided
        if (client_since) {
            updateData.client_since = new Date(client_since);
        }

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log("Updated client:", updatedClient);

        return NextResponse.json({ message: "Client updated", client: updatedClient });
    } catch (error) {
        console.error("Error in PUT /api/clients/[id]:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update client" },
            { status: 500 }
        );
    }
}

export async function GET(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        await connectMongoDB();
        const client = await Client.findById(id);

        if (!client) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ client });
    } catch (error) {
        console.error("Error in GET /api/clients/[id]:", error);
        return NextResponse.json(
            { error: "Failed to fetch client" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        await connectMongoDB();
        const client = await Client.findByIdAndDelete(id);

        if (!client) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Client deleted" });
    } catch (error) {
        console.error("Error in DELETE /api/clients/[id]:", error);
        return NextResponse.json(
            { error: "Failed to delete client" },
            { status: 500 }
        );
    }
} 