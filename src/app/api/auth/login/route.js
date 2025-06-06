import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        console.log('Login attempt for email:', email);
        console.log('Received password (length):', password?.length);

        await connectMongoDB();
        console.log('MongoDB connected');

        const user = await User.findOne({ mail: email });
        console.log('User found:', !!user);

        if (!user) {
            console.log('User not found in database');
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.log('Comparing passwords...');
        console.log('Stored hash:', user.password);
        console.log('Password type:', typeof password);
        console.log('Hash type:', typeof user.password);

        const trimmedPassword = password.trim();
        
        const validPassword = await bcrypt.compare(trimmedPassword, user.password);
        console.log('Password valid:', validPassword);

        if (!validPassword) {
            console.log('Invalid password provided');
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 401 }
            );
        }

        console.log('Generating JWT token');
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log('Login successful');
        return NextResponse.json({
            token,
            message: "Login successful"
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: "An error occurred", error: error.message },
            { status: 500 }
        );
    }
}