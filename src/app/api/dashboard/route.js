import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import User from "../../../../models/user";
import Item from "../../../../models/item";
import FAQ from "../../../../models/faq";
import Client from "../../../../models/client";
import Project from "../../../../models/project";
import Hosting from "../../../../models/hosting";

export async function GET() {
    try {
        await connectMongoDB();
        
        const userCount = await User.countDocuments();
        
        const totalItems = await Item.countDocuments();
        const activeItems = await Item.countDocuments({ isActive: true });
        
        const faqCount = await FAQ.countDocuments();
        
        const totalClients = await Client.countDocuments();
        const activeClients = await Client.countDocuments({ status: 'Active' });
        
        const totalProjects = await Project.countDocuments();
        const inProgressProjects = await Project.countDocuments({ status: 'In Progress' });
        const completedProjects = await Project.countDocuments({ status: 'Completed' });
        
        const totalHostings = await Hosting.countDocuments();
        const activeHostings = await Hosting.countDocuments({ status: 'Active' });
        
        const recentUsers = await User.find({})
            .sort({ created_at: -1 })
            .limit(2)
            .select('name created_at')
            .lean();
            
        const recentItems = await Item.find({})
            .sort({ created_at: -1 })
            .limit(2)
            .select('name created_at')
            .lean();
            
        const recentFaqs = await FAQ.find({})
            .sort({ createdAt: -1 })
            .limit(1)
            .select('question createdAt')
            .lean();
            
        const recentClients = await Client.find({})
            .sort({ created_at: -1 })
            .limit(2)
            .select('company_name created_at')
            .lean();
            
        const recentProjects = await Project.find({})
            .sort({ created_at: -1 })
            .limit(2)
            .select('project_name created_at')
            .lean();
            
        const recentHostings = await Hosting.find({})
            .sort({ created_at: -1 })
            .limit(2)
            .select('domain_name created_at')
            .lean();
            
        const formatTimeAgo = (date) => {
            const now = new Date();
            const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        };
        
        const recentActivity = [
            ...recentUsers.map(user => ({
                type: 'user',
                action: 'New user registered',
                name: user.name,
                time: formatTimeAgo(user.created_at)
            })),
            ...recentItems.map(item => ({
                type: 'item',
                action: 'New item added',
                name: item.name,
                time: formatTimeAgo(item.created_at)
            })),
            ...recentFaqs.map(faq => ({
                type: 'question',
                action: 'New question added',
                name: faq.question,
                time: formatTimeAgo(faq.createdAt)
            })),
            ...recentClients.map(client => ({
                type: 'client',
                action: 'New client added',
                name: client.company_name,
                time: formatTimeAgo(client.created_at)
            })),
            ...recentProjects.map(project => ({
                type: 'project',
                action: 'New project created',
                name: project.project_name,
                time: formatTimeAgo(project.created_at)
            })),
            ...recentHostings.map(hosting => ({
                type: 'hosting',
                action: 'New hosting added',
                name: hosting.domain_name,
                time: formatTimeAgo(hosting.created_at)
            }))
        ].sort((a, b) => {
            if (a.time === 'Just now') return -1;
            if (b.time === 'Just now') return 1;
            return a.time.localeCompare(b.time);
        }).slice(0, 4);
        
        return NextResponse.json({
            stats: {
                totalUsers: userCount,
                totalItems,
                activeItems,
                totalQuestions: faqCount,
                totalClients,
                activeClients,
                totalProjects,
                inProgressProjects,
                completedProjects,
                totalHostings,
                activeHostings
            },
            recentActivity
        });
    } catch (error) {
        console.error("Dashboard data fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
} 