const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando LS Plastics Supply...');

const projectPath = 'C:\\Users\\santi\\Downloads\\LSPlasticsSupply';
process.chdir(projectPath);

console.log('📁 Directorio actual:', process.cwd());

exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    if (stderr) {
        console.error('⚠️ Stderr:', stderr);
    }
    console.log('✅ Stdout:', stdout);
});

console.log('🌐 El servidor debería estar iniciándose en http://localhost:3000');
console.log('⏳ Espera unos segundos y luego abre tu navegador...');
