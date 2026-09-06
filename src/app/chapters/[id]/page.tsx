import { CHAPTERS } from '@/data';
import ChapterView from './ChapterView';

export function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ id: chapter.id }));
}

export default function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  return <ChapterView params={params} />;
}
