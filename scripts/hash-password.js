// Genera el hash bcrypt de una nueva contraseña de administrador.
// Uso:  node scripts/hash-password.js "mi-nueva-contraseña"
// Copia el resultado en ADMIN_PASSWORD_HASH_B64 dentro de tu archivo .env

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hash-password.js "tu-contraseña"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const hashB64 = Buffer.from(hash, "utf8").toString("base64");

console.log("\nReemplaza la línea ADMIN_PASSWORD_HASH_B64 en tu archivo .env por esta:\n");
console.log(`ADMIN_PASSWORD_HASH_B64="${hashB64}"\n`);
