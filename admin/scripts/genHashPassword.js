const bcrypt = require('bcrypt');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('> password: ', async (ans) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ans, salt);

  console.log(hashedPassword);
  readline.close();
});
