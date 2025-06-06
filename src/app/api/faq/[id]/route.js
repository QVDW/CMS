import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import FAQ from "../../../../../models/faq";

// Get a specific FAQ by ID
export async function GET(request, context) {
  try {
    const { params } = context;
    const { id } = params;
    
    await connectMongoDB();
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return NextResponse.json(
        { message: "FAQ not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(faq);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { message: "Error fetching FAQ", error: error.toString() },
      { status: 500 }
    );
  }
}

// Update a FAQ
export async function PUT(request, context) {
  try {
    const { params } = context;
    const { id } = params;
    const { question, answer, isActive } = await request.json();
    
    await connectMongoDB();
    
    const faq = await FAQ.findById(id);
    if (!faq) {
      return NextResponse.json(
        { message: "FAQ not found" },
        { status: 404 }
      );
    }
    
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      {
        question,
        answer,
        isActive: isActive !== undefined ? isActive : faq.isActive,
      },
      { new: true }
    );
    
    return NextResponse.json({ 
      message: "FAQ updated successfully", 
      faq: updatedFAQ 
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { message: "Error updating FAQ", error: error.toString() },
      { status: 500 }
    );
  }
} 