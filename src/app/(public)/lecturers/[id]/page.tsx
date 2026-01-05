import LecturerDetail from '@/src/features/lecturer/LecturerDetail';
import { notFound } from 'next/navigation';

async function getLecturer(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://nasow.vercel.app/' || 'http://localhost:3000'}/api/lecturers?id=${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params here
  const lecturer = await getLecturer(id);

  if (!lecturer) {
    return {
      title: 'Lecturer Not Found | NASOW',
    };
  }

  return {
    title: `${lecturer.name} - ${lecturer.title} | NASOW`,
    description: lecturer.specialization,
  };
}

export default async function LecturerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params here
  const lecturer = await getLecturer(id);

  if (!lecturer) {
    notFound();
  }

  return <LecturerDetail lecturer={lecturer} />;
}