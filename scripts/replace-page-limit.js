const fs = require('fs');
const path = require('path');

const files = [
  "app/(client)/dashboard/user/page.tsx",
  "app/(client)/dashboard/sms/page.tsx",
  "app/(client)/dashboard/member/page.tsx",
  "app/(client)/dashboard/finance/page.tsx",
  "app/(client)/dashboard/attendance/page.tsx"
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/\(page, 10\)/g, '(page, 50)');
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
  }
});
