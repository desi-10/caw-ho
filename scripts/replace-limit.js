const fs = require('fs');
const path = require('path');

const filesToUpdate10 = [
  "services/user.service.ts",
  "services/sms.service.ts",
  "services/member.service.ts",
  "services/finance.service.ts",
  "services/attendance.service.ts",
  "hooks/use-users.ts",
  "hooks/use-members.ts",
  "hooks/use-sms.ts",
  "hooks/use-finances.ts",
  "hooks/use-attendances.ts",
  "features/users/users.service.ts",
  "features/sms/sms.services.ts",
  "features/members/members.services.ts",
  "features/attendance/attendance.services.ts",
  "features/finance/finance.services.ts"
];

const filesToUpdate1000 = [
  "components/dialogs/attendance/edit.attendance.tsx",
  "components/dialogs/sms/add.sms.tsx",
  "components/dialogs/members/edit.member.tsx",
  "components/dialogs/members/add.member.tsx",
  "components/dialogs/finance/add.finance.tsx",
  "components/dialogs/finance/edit.finance.tsx"
];

filesToUpdate10.forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/limit: number = 10/g, 'limit: number = 50');
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
  }
});

filesToUpdate1000.forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/limit=1000/g, 'limit=50');
    fs.writeFileSync(p, content);
    console.log('Updated ' + f);
  }
});
