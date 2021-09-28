require("dotenv").config();

const { Swyftx } = require("./api");
const swyftx = new Swyftx({
  accessToken: process.env.SWYFTX_ACCESS_TOKEN,
  isDemoMode: true,
});

async function main() {
  try {
    const profile = await swyftx.account.profile.getProfile();
    console.log(profile);
  } catch (err) {
    console.log(err);
  }
}

main();
