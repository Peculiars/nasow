import { getUser, requireAdmin } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Student } from '@/src/lib/mongodb/models/Student';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params; 

    const student = await Student.findById(id).lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...student,
        _id: student._id.toString(),
        fullName: `${student.firstName} ${student.lastName}`,
        averageScore: student.quizzesTaken > 0
          ? Math.round(student.totalScore / student.quizzesTaken)
          : 0
      }
    });
  } catch (error) {
    console.error('GET /api/admin/students/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();

    const user = await getUser();
    const body = await request.json();

    console.log("📥 Admin updating student with data:", body);

    // Fields that admin can update
    const allowedUpdates = [
      'firstName', 
      'lastName', 
      'phoneNumber', 
      'email',
      'level',
      'studentType',
      'matricNumber',
      'dateOfBirth',
      'address',
      'city',
      'state',
      'bio'
    ];
    
    const updates: any = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        const value = body[key];
        
        // Skip null, undefined, or empty string values
        if (value === null || value === '' || value === undefined) {
          continue;
        }
        
        // Handle dateOfBirth specially
        if (key === 'dateOfBirth') {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              updates[key] = date;
            }
          } catch (error) {
            console.error('Invalid date format:', value);
          }
          continue;
        }
        
        // Handle string fields - trim them
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (trimmed) {
            updates[key] = trimmed;
          }
        } else {
          updates[key] = value;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updates.updatedBy = user?.email || 'admin';

    console.log("✅ Final admin update data:", updates);

    const { id } = await params;

    const student = await Student.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if profile should be marked as completed
    if (student.level && student.studentType && !student.profileCompleted) {
      await Student.findByIdAndUpdate(id, { profileCompleted: true });
      student.profileCompleted = true;
    }

    console.log("📤 Admin updated student:", student);

    return NextResponse.json({
      data: {
        ...student,
        _id: student._id.toString()
      }
    });
  } catch (error: any) {
    console.error('PATCH /api/admin/students/[id] error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ 
        error: `${field === 'email' ? 'Email' : 'Matric number'} already exists` 
      }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/students/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}