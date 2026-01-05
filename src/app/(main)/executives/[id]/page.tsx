import ExecutiveDetail from '@/src/features/executive/ExecutivesDetails';
import { notFound } from 'next/navigation';

async function getExecutive(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nasow.vercel.app/' || 'http://localhost:3000'}/api/executives?id=${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const executive = await getExecutive(id);

  if (!executive) {
    return { title: 'Executive Not Found | NASOW' };
  }

  return {
    title: `${executive.name} - ${executive.position} | NASOW`,
    description: executive.bio?.slice(0, 160),
  };
}

export default async function ExecutivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const executive = await getExecutive(id);

  if (!executive) {
    notFound();
  }
  console.log('executive', executive)

  return <ExecutiveDetail executive={executive} />;
}