import { NextRequest, NextResponse } from "next/server";
import DBCon from "../../../libs/db";
import todModel from "../../../../Models/Todo";


export async function GET(request,{params}) {
  
  try {
    // const {params} = await context
    const id =  (await params).id
    // const {title,desc}=await request.json()
    await DBCon()

     const findtodo = await todModel.findById(id)
     if(!findtodo){
      return NextResponse.json({success:false,message:"Not Todo found",},{status:404})
     }

    //  const updateTodo = await todModel.findByIdAndUpdate(id,{title,desc},{new:true})

    return NextResponse.json({success:true , message:"ToDo fetched Successfully",todo:findtodo},{status:200})
  } catch (error) {
    return NextResponse.json({success:false ,message:"Internal Server error ",error:error.message},{status:500})
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const { title, desc, completed } = body;
    await DBCon();

    const updated = await todModel.findByIdAndUpdate(
      id,
      // body,
      { 
    ...(body.title && { title: body.title }),
    ...(body.desc && { desc: body.desc }),
    ...(body.completed !== undefined && { completed: body.completed })
  },
      { new: true }
    );

  

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }
      if (body.hasOwnProperty("completed")) {
      const message = updated.completed
        ? "✅ Todo marked as completed!"
        : "❌ Todo marked as incomplete!";
      return NextResponse.json({ success: true, message, todo: updated });
    }

    return NextResponse.json(
      { success: true, message: "Todo updated successfully", todo: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}



export async function DELETE(request,{params}) {
  try {
    const id = (await params).id
    await DBCon()

     const deletedtodo = await todModel.findByIdAndDelete(id)
     if(!deletedtodo){
      return NextResponse.json({success: false,message:"Not Todo found",},{status:404})
     }

    //  const Delete = await todModel.findByIdAndDelete(id,{title,desc},{new:true})

    return NextResponse.json({success: true,message:"ToDo deleted Successfully",Todo:deletedtodo},{status:200})
  } catch (error) {
    return NextResponse.json({success: false,message:"Internal Server error ",error:error.message},{status:500})
  }
}