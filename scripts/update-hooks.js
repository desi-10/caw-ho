const fs = require('fs');
const path = require('path');

const hooks = [
  { file: "hooks/use-users.ts", keyName: "USER_KEYS" },
  { file: "hooks/use-sms.ts", keyName: "SMS_KEYS" },
  { file: "hooks/use-finances.ts", keyName: "FINANCE_KEYS" },
  { file: "hooks/use-attendances.ts", keyName: "ATTENDANCE_KEYS" },
];

hooks.forEach(h => {
  const p = path.join(__dirname, '..', h.file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace list: (page: number) => [...KEYS.lists(), page] as const,
    const searchPattern = new RegExp(`list:\\s*\\(page:\\s*number\\)\\s*=>\\s*\\[\\.\\.\\.${h.keyName}\\.lists\\(\\),\\s*page\\]\\s*as\\s*const`, "g");
    const replacement = `list: (page: number, limit: number = 50) => [...${h.keyName}.lists(), page, limit] as const`;
    content = content.replace(searchPattern, replacement);
    
    // Replace queryKey: KEYS.list(page)
    const queryKeyPattern = new RegExp(`queryKey:\\s*${h.keyName}\\.list\\(page\\)`, "g");
    const queryKeyReplacement = `queryKey: ${h.keyName}.list(page, limit)`;
    content = content.replace(queryKeyPattern, queryKeyReplacement);
    
    fs.writeFileSync(p, content);
    console.log('Updated ' + h.file);
  }
});
