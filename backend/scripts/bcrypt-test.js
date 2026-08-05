const bcrypt = require('bcrypt');

async function run() {

    const password = "Campus123!";

    console.log("Original Password:");
    console.log(password);

    console.log("---------------------------");

    const hash1 = await bcrypt.hash(password,12);

    const hash2 = await bcrypt.hash(password,12);

    console.log("Hash 1:");
    console.log(hash1);

    console.log();

    console.log("Hash 2:");
    console.log(hash2);

    console.log("---------------------------");

    console.log("Hash1 == Hash2 ?");

    console.log(hash1 === hash2);

    console.log("---------------------------");

    const correctPassword =
        await bcrypt.compare(password,hash1);

    const wrongPassword =
        await bcrypt.compare("WrongPassword",hash1);

    console.log("Correct Password:");

    console.log(correctPassword);

    console.log();

    console.log("Wrong Password:");

    console.log(wrongPassword);

}

run();