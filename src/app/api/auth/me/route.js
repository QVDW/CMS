import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import User from "../../../../../models/user";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        
        await connectMongoDB();
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error getting current user:", error);
        
        if (error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        
        if (error.name === "TokenExpiredError") {
            return NextResponse.json({ error: "Token expired" }, { status: 401 });
        }
        
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 