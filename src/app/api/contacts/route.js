import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Contact from "../../../../models/contact";
import Client from "../../../../models/client";

// Function to generate next contact ID
async function generateContactId() {
    // Find the highest existing contact ID (numeric)
    const lastContact = await Contact.findOne(
        { contact_id: { $regex: /^\d+$/ } },
        {},
        { sort: { contact_id: -1 } }
    );

    if (!lastContact) {
        return "1";
    }

    // Convert to number and increment
    const lastNumber = parseInt(lastContact.contact_id);
    const nextNumber = lastNumber + 1;

    return nextNumber.toString();
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            client_id,
            name,
            company,
            role,
            email,
            phone,
            notes
        } = body;

        console.log("Received contact data:", body);

        // Validate required fields
        if (!client_id || !name) {
            return NextResponse.json(
                { error: "client_id and name are required" },
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

        // Always auto-generate contact_id
        const contact_id = await generateContactId();
        console.log("Generated contact ID:", contact_id);

        const contactData = {
            contact_id,
            client_id,
            name,
            company: company || "",
            role: role || "",
            email: email || "",
            phone: phone || "",
            notes: notes || ""
        };

        console.log("Attempting to create contact with data:", contactData);

        const result = await Contact.create(contactData);
        console.log("Contact created successfully:", result);

        return NextResponse.json({ message: "Contact created", contact: result });
    } catch (error) {
        console.error("Error in POST /api/contacts:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json(
            { error: error.message || "Failed to create contact" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(request.url);
        const sortOrder = searchParams.get('sort') === 'asc' ? 1 : -1;
        const client_id = searchParams.get('client_id');

        // Build query object
        let query = {};
        if (client_id) {
            query.client_id = client_id;
        }

        const contacts = await Contact.find(query).sort({
            name: sortOrder,
            created_at: sortOrder
        });

        // Populate with client information
        const contactsWithClients = await Promise.all(
            contacts.map(async (contact) => {
                const client = await Client.findOne({ client_id: contact.client_id });
                return {
                    ...contact.toObject(),
                    client: client ? {
                        client_id: client.client_id,
                        company_name: client.company_name,
                        contact_name: client.contact_name
                    } : null
                };
            })
        );

        return NextResponse.json(contactsWithClients);
    } catch (error) {
        console.error("Error in GET /api/contacts:", error);
        return NextResponse.json(
            { error: "Failed to fetch contacts" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { error: "Contact ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        const contact = await Contact.findByIdAndDelete(id);
        
        if (!contact) {
            return NextResponse.json(
                { error: "Contact not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Contact deleted" });
    } catch (error) {
        console.error("Error in DELETE /api/contacts:", error);
        return NextResponse.json(
            { error: "Failed to delete contact" },
            { status: 500 }
        );
    }
} 