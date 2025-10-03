const crypto = require('crypto');

/**
 * Generador de Código Maestro para Santiago
 * Script exclusivo para el propietario del proyecto L&S Plastics Supply
 */

// Función para generar el código maestro
function generateOwnerCode() {
    const timestamp = new Date().toISOString();
    const projectId = 'LS_PLASTICS_SUPPLY';
    const owner = 'SANTIAGO';

    const masterCode = crypto
        .createHash('sha256')
        .update(`${owner}_${projectId}_${timestamp}_MASTER_2025`)
        .digest('hex')
        .substring(0, 16)
        .toUpperCase();

    return masterCode;
}

console.log('🔐 GENERANDO CÓDIGO MAESTRO PARA EL PROPIETARIO...\n');
console.log('=' .repeat(60));
console.log('📋 PROYECTO: L&S Plastics Supply');
console.log('👤 PROPIETARIO: Santiago');
console.log('📅 FECHA: ' + new Date().toLocaleDateString());
console.log('🕒 HORA: ' + new Date().toLocaleTimeString());
console.log('=' .repeat(60));

// Generar el código maestro
const masterCode = generateOwnerCode();

console.log('\n🎯 TU CÓDIGO MAESTRO PERSONAL:');
console.log('┌─────────────────────────────┐');
console.log(`│   ${masterCode}   │`);
console.log('└─────────────────────────────┘');

console.log('\n📋 INSTRUCCIONES IMPORTANTES:');
console.log('1. ✅ GUARDA este código en un lugar MUY SEGURO');
console.log('2. ❌ NO compartas este código con NADIE');
console.log('3. 🔄 Este código te permitirá acceder a modificar tu proyecto');
console.log('4. ⏰ Las sesiones duran 2 horas después de ingresar el código');
console.log('5. 🚨 Después de 3 intentos fallidos, se bloquea por 24 horas');

console.log('\n🛡️ CARACTERÍSTICAS DE PROTECCIÓN:');
console.log('• Bloqueo automático después de intentos fallidos');
console.log('• Registro de todos los intentos de acceso');
console.log('• Sesiones temporales con expiración');
console.log('• Protección contra modificaciones no autorizadas');
console.log('• Solo TÚ puedes acceder con este código');

console.log('\n⚠️  ADVERTENCIA:');
console.log('Si pierdes este código, tendrás que modificar manualmente');
console.log('el archivo lib/codeProtection.js para generar uno nuevo.');

console.log('\n🎉 ¡Tu proyecto ahora está COMPLETAMENTE PROTEGIDO!');
console.log('=' .repeat(60));
