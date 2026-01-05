// app/api/students/upload-image/route.ts
import { connectDB } from "@/src/lib/mongodb/connection"
import { Student } from "@/src/lib/mongodb/models/Student"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextResponse } from "next/server"
import cloudinary from "@/src/lib/cloudinary/config"
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large" }, { status: 400 })
    }

    // Convert to buffer and optimize
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const optimizedBuffer = await sharp(buffer)
      .resize(400, 400, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90, progressive: true })
      .toBuffer()

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/students/profiles',
          resource_type: 'image',
          type: 'upload',
          access_mode: 'public',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(optimizedBuffer)
    })

    // Update student profile with new image URL
    await connectDB()

    const student = await Student.findOneAndUpdate(
      { kindeId: user.id },
      { 
        profileImage: result.secure_url,
        lastActive: new Date()
      },
      { new: true }
    )

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      imageUrl: result.secure_url,
      publicId: result.public_id 
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}