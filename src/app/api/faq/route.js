import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import FAQ from "../../../../models/faq";

// Get all FAQs
export async function GET() {
  try {
    await connectMongoDB();
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { message: "Error fetching FAQs", error: error.toString() },
      { status: 500 }
    );
  }
}

// Create a new FAQ
export async function POST(request) {
  try {
    const { question, answer, isActive } = await request.json();
    await connectMongoDB();
    await FAQ.create({
      question,
      answer,
      isActive: isActive !== undefined ? isActive : true,
    });
    return NextResponse.json({ message: "FAQ created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { message: "Error creating FAQ", error: error.toString() },
      { status: 500 }
    );
  }
}

// Delete a FAQ
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await connectMongoDB();
    await FAQ.findByIdAndDelete(id);
    return NextResponse.json({ message: "FAQ deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { message: "Error deleting FAQ", error: error.toString() },
      { status: 500 }
    );
  }
} 