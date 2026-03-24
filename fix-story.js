const fs = require('fs');
const path = require('path');

const storyPath = path.join('d:', 'Farhan-project', 'eclipse', 'story.json');

try {
  const content = fs.readFileSync(storyPath, 'utf8');
  const data = JSON.parse(content);
  
  data.chapters.forEach(chapter => {
    chapter.sub_chapters.forEach(sub => {
      if (sub.content && sub.content.length > 0) {
        // If it's a single long string or contains \n
        const newContent = [];
        sub.content.forEach(str => {
          const paragraphs = str.split(/\n+/);
          paragraphs.forEach(p => {
            if (p.trim()) {
              newContent.push(p.trim());
            }
          });
        });
        sub.content = newContent;
      }
    });
  });
  
  fs.writeFileSync(storyPath, JSON.stringify(data, null, 2));
  console.log('Successfully formatted story.json');
} catch (e) {
  console.error('Error:', e);
}
