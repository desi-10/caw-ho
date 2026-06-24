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
    
    // Some components use `open`, some use something else? 
    // They all accept `open` prop or define `const [open, setOpen] = useState(false)`!
    // We just need to add `if (!open) return;` at the start of the useEffect that calls fetch.
    
    content = content.replace(
      /useEffect\(\(\) => \{\n\s*const fetch/g,
      "useEffect(() => {\n    if (!open) return;\n    const fetch"
    );
    
    // Also need to add `open` to the dependency array.
    content = content.replace(
      /fetch[a-zA-Z]+\(\);\n\s*\}, \[\]\);/g,
      (match) => match.replace("[]", "[open]")
    );

    fs.writeFileSync(p, content);
    console.log('Fixed ' + f);
  }
});
