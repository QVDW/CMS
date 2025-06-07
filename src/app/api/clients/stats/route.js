import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import Client from "../../../../../models/client";

export async function GET(request) {
    try {
        await connectMongoDB();

        // Get total client count
        const totalClients = await Client.countDocuments();

        // Get counts by status
        const statusStats = await Client.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get counts by industry
        const industryStats = await Client.aggregate([
            {
                $match: { industry: { $ne: "" } }
            },
            {
                $group: {
                    _id: "$industry",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Get recent clients (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentClients = await Client.countDocuments({
            created_at: { $gte: thirtyDaysAgo }
        });

        // Get clients added per month for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyStats = await Client.aggregate([
            {
                $match: {
                    created_at: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Get clients by client_since year
        const clientsSinceStats = await Client.aggregate([
            {
                $match: { client_since: { $ne: null } }
            },
            {
                $group: {
                    _id: { $year: "$client_since" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": -1 }
            }
        ]);

        return NextResponse.json({
            totalClients,
            recentClients,
            statusBreakdown: statusStats.reduce((acc, item) => {
                acc[item._id || 'Unknown'] = item.count;
                return acc;
            }, {}),
            topIndustries: industryStats.map(item => ({
                industry: item._id,
                count: item.count
            })),
            monthlyGrowth: monthlyStats.map(item => ({
                year: item._id.year,
                month: item._id.month,
                count: item.count
            })),
            clientsSinceBreakdown: clientsSinceStats.map(item => ({
                year: item._id,
                count: item.count
            }))
        });
    } catch (error) {
        console.error("Error in GET /api/clients/stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch client statistics" },
            { status: 500 }
        );
    }
} 