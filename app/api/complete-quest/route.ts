import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chapterId, subId } = body;

    const filePath = path.join(process.cwd(), 'story.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const storyData = JSON.parse(fileContent);

    let updated = false;

    storyData.chapters.forEach((chapter: any) => {
      if (chapter.chapter_id === chapterId) {
        chapter.sub_chapters.forEach((sub: any) => {
          if (sub.sub_id === subId) {
            sub.completed = true;
            updated = true;
          }
        });
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(storyData, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Chapter or sub-chapter not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating story.json:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
