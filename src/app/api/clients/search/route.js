import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Client from "../../../../../models/client";

export async function GET(request) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const status = searchParams.get('status');
        const industry = searchParams.get('industry');
        const limit = parseInt(searchParams.get('limit')) || 50;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;

        let searchFilter = {};

        // If there's a search query, create a text search
        if (query) {
            searchFilter.$or = [
                { company_name: { $regex: query, $options: 'i' } },
                { contact_name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { client_id: { $regex: query, $options: 'i' } },
                { industry: { $regex: query, $options: 'i' } }
            ];
        }

        // Add status filter if provided
        if (status) {
            searchFilter.status = status;
        }

        // Add industry filter if provided
        if (industry) {
            searchFilter.industry = { $regex: industry, $options: 'i' };
        }

        const clients = await Client.find(searchFilter)
            .sort({ company_name: 1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await Client.countDocuments(searchFilter);

        return NextResponse.json({
            clients,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error("Error in GET /api/clients/search:", error);
        return NextResponse.json(
            { error: "Failed to search clients" },
            { status: 500 }
        );
    }
} 