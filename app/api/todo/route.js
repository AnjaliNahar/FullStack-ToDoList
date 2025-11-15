import { NextResponse } from "next/server";
import DBCon from "../../libs/db";
import todModel from "../../../Models/Todo";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, desc, dueDate } = body
    await DBCon();

    // ✅ Check first (no variable used here yet)
    if (!title || !desc) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Create new todo only after validation passes
    const CreateNew = await todModel.create({ title, desc,dueDate });

    return NextResponse.json(
      { success: true, message: "ToDo created successfully", todo: CreateNew },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}



export async function GET(request) {
  try {
    await DBCon();

    const todos = await todModel.find();

    if (todos.length === 0) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Todos fetched successfully", todos },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
