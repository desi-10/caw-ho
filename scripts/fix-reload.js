const fs = require('fs');
const path = require('path');

const configs = [
  {
    file: "components/dialogs/members/edit.member.tsx",
    queryKey: '["members"]',
    componentName: "EditMemberDialog"
  },
  {
    file: "components/dialogs/members/add.member.tsx",
    queryKey: '["members"]',
    componentName: "AddMember"
  },
  {
    file: "components/dialogs/finance/edit.finance.tsx",
    queryKey: '["finances"]',
    componentName: "EditFinanceDialog"
  },
  {
    file: "components/dialogs/finance/add.finance.tsx",
    queryKey: '["finances"]',
    componentName: "AddFinance"
  },
  {
    file: "components/dialogs/attendance/edit.attendance.tsx",
    queryKey: '["attendances"]',
    componentName: "EditAttendanceDialog"
  },
  {
    file: "components/dialogs/attendance/add.attendance.tsx",
    queryKey: '["attendances"]',
    componentName: "AddAttendance"
  }
];

configs.forEach(({ file, queryKey, componentName }) => {
  const p = path.join(__dirname, '..', file);
  if (!fs.existsSync(p)) return;
  
  let content = fs.readFileSync(p, 'utf8');

  // 1. Add import if missing
  if (!content.includes('useQueryClient')) {
    content = content.replace(
      'import { toast } from "sonner";',
      'import { toast } from "sonner";\nimport { useQueryClient } from "@tanstack/react-query";'
    );
  }

  // 2. Add queryClient declaration if missing
  if (!content.includes('const queryClient = useQueryClient()')) {
    const regex = new RegExp(`const ${componentName} = \\([^)]*\\) => {`);
    content = content.replace(
      regex,
      (match) => `${match}\n  const queryClient = useQueryClient();`
    );
  }

  // 3. Replace window.location.reload() OR add invalidation if reload is commented out/missing
  const invalidation = `queryClient.invalidateQueries({ queryKey: ${queryKey} });`;
  
  if (content.includes('window.location.reload();')) {
    content = content.replace(/window\.location\.reload\(\);/g, invalidation);
  } else if (content.includes('// window.location.reload();')) {
    content = content.replace(/\/\/ window\.location\.reload\(\);/g, invalidation);
  } else {
    // For add.member.tsx where it's completely missing
    if (content.includes('setOpen(false);\n      reset();\n      setPreview(null);')) {
      content = content.replace(
        'setOpen(false);\n      reset();\n      setPreview(null);',
        `setOpen(false);\n      reset();\n      setPreview(null);\n      ${invalidation}`
      );
    }
  }

  // 4. Ensure !open check is present for fetching hooks
  content = content.replace(
    /useEffect\(\(\) => \{[\r\n\s]*const fetch/g,
    "useEffect(() => {\n    if (!open) return;\n    const fetch"
  );
  
  content = content.replace(
    /fetch[a-zA-Z]+\(\);[\r\n\s]*\}, \[\]\);/g,
    (match) => match.replace("[]", "[open]")
  );

  fs.writeFileSync(p, content);
  console.log('Fixed ' + file);
});
