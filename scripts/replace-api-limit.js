const fs = require('fs');
const path = require('path');

const files = [
  "app/api/user/route.ts",
  "app/api/sms/route.ts",
  "app/api/member/route.ts",
  "app/api/finance/route.ts",
  "app/api/attendance/route.ts"
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/limit"\) \|\| "10"/g, 'limit") || "50"');
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
  }
});
