import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Client from "../../../../models/client";

// Function to generate next client ID
async function generateClientId() {
    // Find the highest existing client ID (numeric)
    const lastClient = await Client.findOne(
        { client_id: { $regex: /^\d+$/ } },
        {},
        { sort: { client_id: -1 } }
    );

    if (!lastClient) {
        return "1";
    }

    // Convert to number and increment
    const lastNumber = parseInt(lastClient.client_id);
    const nextNumber = lastNumber + 1;

    return nextNumber.toString();
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            company_name,
            contact_name,
            email,
            phone_number,
            address,
            industry,
            client_since,
            status
        } = body;

        console.log("Received client data:", body);

        // Validate required fields
        if (!company_name || !contact_name) {
            return NextResponse.json(
                { error: "company_name and contact_name are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        console.log("MongoDB connected successfully");

        // Always auto-generate client_id
        const client_id = await generateClientId();
        console.log("Generated client ID:", client_id);

        const clientData = {
            client_id,
            company_name,
            contact_name,
            email: email || "",
            phone_number: phone_number || "",
            address: address || "",
            industry: industry || "",
            client_since: client_since ? new Date(client_since) : new Date(),
            status: status || "Prospect"
        };

        console.log("Attempting to create client with data:", clientData);

        const result = await Client.create(clientData);
        console.log("Client created successfully:", result);

        return NextResponse.json({ message: "Client created", client: result });
    } catch (error) {
        console.error("Error in POST /api/clients:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            { error: error.message || "Failed to create client" },
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
        const industry = searchParams.get('industry');

        // Build query object
        let query = {};
        if (status) {
            query.status = status;
        }
        if (industry) {
            query.industry = new RegExp(industry, 'i'); // Case-insensitive search
        }

        const clients = await Client.find(query).sort({
            company_name: sortOrder,
            created_at: sortOrder
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.error("Error in GET /api/clients:", error);
        return NextResponse.json(
            { error: "Failed to fetch clients" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { error: "Client ID is required" },
                { status: 400 }
            );
        }

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
        console.error("Error in DELETE /api/clients:", error);
        return NextResponse.json(
            { error: "Failed to delete client" },
            { status: 500 }
        );
    }
} 