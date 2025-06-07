import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Hosting from "../../../../models/hosting";
import Client from "../../../../models/client";

// Function to generate next hosting ID
async function generateHostingId() {
    // Find the highest existing hosting ID (numeric)
    const lastHosting = await Hosting.findOne(
        { hosting_id: { $regex: /^\d+$/ } },
        {},
        { sort: { hosting_id: -1 } }
    );

    if (!lastHosting) {
        return "1";
    }

    // Convert to number and increment
    const lastNumber = parseInt(lastHosting.hosting_id);
    const nextNumber = lastNumber + 1;

    return nextNumber.toString();
}

export async function POST(request) {
    try {
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

        console.log("Received hosting data:", { 
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
        console.log("MongoDB connected successfully");

        // Verify that the client exists
        const client = await Client.findOne({ client_id });
        if (!client) {
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        // Always auto-generate hosting_id
        const hosting_id = await generateHostingId();
        console.log("Generated hosting ID:", hosting_id);

        const hostingData = {
            hosting_id,
            client_id,
            host_provider,
            status: status || "Active"
        };

        // Add optional fields only if they have values
        if (username && username.trim()) hostingData.username = username;
        if (email && email.trim()) hostingData.email = email;
        if (password && password.trim()) hostingData.password = password;
        if (domain_name && domain_name.trim()) hostingData.domain_name = domain_name;
        
        // Add putty_connection only if any of its fields have meaningful values
        if (putty_connection && (
            (putty_connection.hostname && putty_connection.hostname.trim()) ||
            (putty_connection.username && putty_connection.username.trim()) ||
            (putty_connection.password && putty_connection.password.trim())
        )) {
            const puttyData = {
                port: putty_connection.port || 22,
                connection_type: putty_connection.connection_type || 'SSH'
            };
            
            if (putty_connection.hostname && putty_connection.hostname.trim()) {
                puttyData.hostname = putty_connection.hostname;
            }
            if (putty_connection.username && putty_connection.username.trim()) {
                puttyData.username = putty_connection.username;
            }
            if (putty_connection.password && putty_connection.password.trim()) {
                puttyData.password = putty_connection.password;
            }
            
            hostingData.putty_connection = puttyData;
        }

        console.log("Attempting to create hosting with data:", { 
            ...hostingData, 
            password: hostingData.password ? "***" : undefined,
            putty_connection: hostingData.putty_connection ? { 
                ...hostingData.putty_connection, 
                password: hostingData.putty_connection.password ? "***" : undefined 
            } : undefined 
        });

        const result = await Hosting.create(hostingData);
        console.log("Hosting created successfully");

        // Remove passwords from response
        const responseData = {
            ...result.toObject(),
            password: "***",
            putty_connection: {
                ...result.putty_connection,
                password: "***"
            }
        };

        return NextResponse.json({ message: "Hosting created", hosting: responseData });
    } catch (error) {
        console.error("Error in POST /api/hostings:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            { error: error.message || "Failed to create hosting" },
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
        const host_provider = searchParams.get('host_provider');

        // Build query object
        let query = {};
        if (status) {
            query.status = status;
        }
        if (client_id) {
            query.client_id = client_id;
        }
        if (host_provider) {
            query.host_provider = { $regex: host_provider, $options: 'i' };
        }

        const hostings = await Hosting.find(query).sort({
            domain_name: sortOrder,
            created_at: sortOrder
        });

        // Populate with client information and remove passwords
        const hostingsWithClients = await Promise.all(
            hostings.map(async (hosting) => {
                const client = await Client.findOne({ client_id: hosting.client_id });
                const hostingObj = hosting.toObject();
                
                // Remove sensitive information from response
                delete hostingObj.password;
                if (hostingObj.putty_connection && hostingObj.putty_connection.password) {
                    delete hostingObj.putty_connection.password;
                }
                
                return {
                    ...hostingObj,
                    client: client ? {
                        client_id: client.client_id,
                        company_name: client.company_name,
                        contact_name: client.contact_name
                    } : null
                };
            })
        );

        return NextResponse.json(hostingsWithClients);
    } catch (error) {
        console.error("Error in GET /api/hostings:", error);
        return NextResponse.json(
            { error: "Failed to fetch hostings" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { error: "Hosting ID is required" },
                { status: 400 }
            );
        }

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
        console.error("Error in DELETE /api/hostings:", error);
        return NextResponse.json(
            { error: "Failed to delete hosting" },
            { status: 500 }
        );
    }
} 