import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import User from "../../../../models/user";

export async function POST(request) {
    const { name, mail, password } = await request.json();
    await connectMongoDB();
    await User.create({ name, mail, password });
    return NextResponse.json({ message: "User created" });
}

export async function GET() {
    await connectMongoDB();
    const users = await User.find();
    return NextResponse.json(users);
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" });
}