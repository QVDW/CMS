import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcrypt";

export async function PUT(request, { params }) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const id = resolvedParams.id;
        
        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        const { name, email: mail, password } = await request.json();
        await connectMongoDB();

        const updateData = {
            name,
            mail
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json({ 
            message: "User updated successfully", 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const id = resolvedParams.id;

        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        await connectMongoDB();
        const user = await User.findById(id);
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json(user);
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}