import { Client } from "pg";

// check https://www.prisma.io/docs/prisma-orm/quickstart/postgresql#8-write-your-first-query

async function main() {
  console.log("Seeding...");
  let connectionStringValue;
  if (process.argv.length > 2) connectionStringValue = process.argv[2];
  else connectionStringValue = process.argv[1];
  const client = new Client({
    connectionString: connectionStringValue,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done!");
}

main();
