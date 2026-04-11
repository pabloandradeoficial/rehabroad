const fs = require('fs');

function replaceFile(f, search, replace) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(f, content);
  }
}

replaceFile('src/react-app/pages/HepPatientPortal.tsx', /const \[\_value, (set_\w+)\]/g, 'const [, $1]');
replaceFile('src/react-app/pages/HepPatientPortal.tsx', /const \[\_checkins, (set_\w+)\]/g, 'const [, $1]');
replaceFile('src/react-app/pages/patient/PatientDashboard.tsx', /const \[\_value, (set_\w+)\]/g, 'const [, $1]');
replaceFile('src/shared/types.ts', /import \{\s*z\s*\} from ['"]zod['"];/g, '');
replaceFile('src/worker/routes/patient-portal.ts', /type HepCheckinRow = \{[^}]*\};/s, '');
replaceFile('src/worker/routes/patients.ts', /function getInsertedId\([^}]*\}[^}]*\}/s, '');
replaceFile('src/worker/routes/patients.ts', /, _evolution:/g, ':');
replaceFile('src/worker/index.ts', /_ctx: ExecutionContext/g, 'ctx: ExecutionContext');
replaceFile('src/worker/routes/subscription.ts', /function isOwnerAdminEmail\([^}]*\}[^}]*\}/s, '');
