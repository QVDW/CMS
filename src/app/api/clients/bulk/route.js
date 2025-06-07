import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Client from "../../../../../models/client";

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
        const { operation, clients } = body;

        if (!operation || !clients || !Array.isArray(clients)) {
            return NextResponse.json(
                { error: "Operation and clients array are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        let result = {};

        switch (operation) {
            case 'create':
                result = await bulkCreate(clients);
                break;
            case 'update':
                result = await bulkUpdate(clients);
                break;
            case 'delete':
                result = await bulkDelete(clients);
                break;
            case 'updateStatus':
                result = await bulkUpdateStatus(clients);
                break;
            default:
                return NextResponse.json(
                    { error: "Invalid operation. Use 'create', 'update', 'delete', or 'updateStatus'" },
                    { status: 400 }
                );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST /api/clients/bulk:", error);
        return NextResponse.json(
            { error: error.message || "Bulk operation failed" },
            { status: 500 }
        );
    }
}

async function bulkCreate(clients) {
    const results = {
        successful: [],
        failed: [],
        duplicates: []
    };

    for (const clientData of clients) {
        try {
            // Validate required fields
            if (!clientData.company_name || !clientData.contact_name) {
                results.failed.push({
                    company_name: clientData.company_name || 'unknown',
                    error: "company_name and contact_name are required"
                });
                continue;
            }

            // Generate client_id for bulk operation
            const client_id = await generateClientId();
            
            const client = await Client.create({
                client_id,
                ...clientData,
                client_since: clientData.client_since ? new Date(clientData.client_since) : new Date(),
                status: clientData.status || "Prospect"
            });

            results.successful.push(client);
        } catch (error) {
            results.failed.push({
                company_name: clientData.company_name || 'unknown',
                error: error.message
            });
        }
    }

    return {
        message: `Bulk create completed: ${results.successful.length} successful, ${results.failed.length} failed, ${results.duplicates.length} duplicates`,
        results
    };
}

async function bulkUpdate(clients) {
    const results = {
        successful: [],
        failed: [],
        notFound: []
    };

    for (const clientData of clients) {
        try {
            if (!clientData._id) {
                results.failed.push({
                    client_id: clientData.client_id || 'unknown',
                    error: "_id is required for updates"
                });
                continue;
            }

            const updatedClient = await Client.findByIdAndUpdate(
                clientData._id,
                {
                    ...clientData,
                    client_since: clientData.client_since ? new Date(clientData.client_since) : undefined
                },
                { new: true, runValidators: true }
            );

            if (!updatedClient) {
                results.notFound.push({
                    _id: clientData._id,
                    client_id: clientData.client_id || 'unknown'
                });
                continue;
            }

            results.successful.push(updatedClient);
        } catch (error) {
            results.failed.push({
                _id: clientData._id,
                client_id: clientData.client_id || 'unknown',
                error: error.message
            });
        }
    }

    return {
        message: `Bulk update completed: ${results.successful.length} successful, ${results.failed.length} failed, ${results.notFound.length} not found`,
        results
    };
}

async function bulkDelete(clients) {
    const results = {
        successful: [],
        failed: [],
        notFound: []
    };

    for (const clientData of clients) {
        try {
            const clientId = clientData._id || clientData.client_id;
            if (!clientId) {
                results.failed.push({
                    error: "_id or client_id is required for deletion"
                });
                continue;
            }

            const deletedClient = clientData._id 
                ? await Client.findByIdAndDelete(clientData._id)
                : await Client.findOneAndDelete({ client_id: clientData.client_id });

            if (!deletedClient) {
                results.notFound.push({
                    _id: clientData._id,
                    client_id: clientData.client_id
                });
                continue;
            }

            results.successful.push({
                _id: deletedClient._id,
                client_id: deletedClient.client_id,
                company_name: deletedClient.company_name
            });
        } catch (error) {
            results.failed.push({
                _id: clientData._id,
                client_id: clientData.client_id,
                error: error.message
            });
        }
    }

    return {
        message: `Bulk delete completed: ${results.successful.length} successful, ${results.failed.length} failed, ${results.notFound.length} not found`,
        results
    };
}

async function bulkUpdateStatus(clients) {
    const results = {
        successful: [],
        failed: [],
        notFound: []
    };

    for (const clientData of clients) {
        try {
            if (!clientData._id && !clientData.client_id) {
                results.failed.push({
                    error: "_id or client_id is required for status updates"
                });
                continue;
            }

            if (!clientData.status) {
                results.failed.push({
                    _id: clientData._id,
                    client_id: clientData.client_id,
                    error: "status is required"
                });
                continue;
            }

            const query = clientData._id 
                ? { _id: clientData._id }
                : { client_id: clientData.client_id };

            const updatedClient = await Client.findOneAndUpdate(
                query,
                { status: clientData.status },
                { new: true, runValidators: true }
            );

            if (!updatedClient) {
                results.notFound.push({
                    _id: clientData._id,
                    client_id: clientData.client_id
                });
                continue;
            }

            results.successful.push(updatedClient);
        } catch (error) {
            results.failed.push({
                _id: clientData._id,
                client_id: clientData.client_id,
                error: error.message
            });
        }
    }

    return {
        message: `Bulk status update completed: ${results.successful.length} successful, ${results.failed.length} failed, ${results.notFound.length} not found`,
        results
    };
} 