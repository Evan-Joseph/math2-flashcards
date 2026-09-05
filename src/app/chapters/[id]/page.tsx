import { CHAPTERS, CHAPTER_MAP } from '@/data';
import { ChapterView } from './ChapterView';

export const dynamicParams = false;

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: CHAPTER_MAP[id]?.title ?? '章节' };
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChapterView id={id} />;
}
