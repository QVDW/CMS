import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Contact from "../../../../../models/contact";
import Client from "../../../../../models/client";

export async function PUT(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

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

        // Validate required fields
        if (!client_id || !name) {
            return NextResponse.json(
                { error: "client_id and name are required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if contact exists
        const currentContact = await Contact.findById(id);
        if (!currentContact) {
            return NextResponse.json(
                { error: "Contact not found" },
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
            name,
            company: company || "",
            role: role || "",
            email: email || "",
            phone: phone || "",
            notes: notes || ""
        };

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log("Updated contact:", updatedContact);

        return NextResponse.json({ message: "Contact updated", contact: updatedContact });
    } catch (error) {
        console.error("Error in PUT /api/contacts/[id]:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update contact" },
            { status: 500 }
        );
    }
}

export async function GET(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

        await connectMongoDB();
        const contact = await Contact.findById(id);

        if (!contact) {
            return NextResponse.json(
                { error: "Contact not found" },
                { status: 404 }
            );
        }

        // Get associated client information
        const client = await Client.findOne({ client_id: contact.client_id });
        const contactWithClient = {
            ...contact.toObject(),
            client: client ? {
                client_id: client.client_id,
                company_name: client.company_name,
                contact_name: client.contact_name,
                email: client.email
            } : null
        };

        return NextResponse.json({ contact: contactWithClient });
    } catch (error) {
        console.error("Error in GET /api/contacts/[id]:", error);
        return NextResponse.json(
            { error: "Failed to fetch contact" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, context) {
    try {
        const { params } = context;
        const { id } = await params;

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
        console.error("Error in DELETE /api/contacts/[id]:", error);
        return NextResponse.json(
            { error: "Failed to delete contact" },
            { status: 500 }
        );
    }
} 