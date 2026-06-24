const fs = require('fs');
const path = require('path');

const files = [
  "components/dialogs/members/edit.member.tsx",
  "components/dialogs/finance/edit.finance.tsx",
  "components/dialogs/attendance/edit.attendance.tsx",
  "components/dialogs/sms/add.sms.tsx",
  "components/dialogs/members/add.member.tsx",
  "components/dialogs/finance/add.finance.tsx"
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Windows uses \r\n, so we use [\s\S] or \r?\n
    // Let's just find `const fetch` inside useEffect and add the check before it.
    // Easiest way:
    content = content.replace(
      /useEffect\(\(\) => \{[\r\n\s]*const fetch/g,
      "useEffect(() => {\n    if (!open) return;\n    const fetch"
    );
    
    content = content.replace(
      /fetch[a-zA-Z]+\(\);[\r\n\s]*\}, \[\]\);/g,
      (match) => match.replace("[]", "[open]")
    );

    fs.writeFileSync(p, content);
    console.log('Fixed V2 ' + f);
  }
});
