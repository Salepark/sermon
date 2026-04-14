import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import EditorPage from '@/components/editor/EditorPage';

export const metadata = { title: '새 설교문' };

export default async function NewEditorPage() {
  const user = await getSession();
  if (!user) redirect('/login?from=/editor/new');

  return <EditorPage userId={user.id} userName={user.name} />;
}
