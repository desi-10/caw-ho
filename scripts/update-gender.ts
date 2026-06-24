
import { prisma } from "../utils/db";
import axios from "axios";

const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

async function main() {
  console.log("Fetching members with missing gender...");
  const members = await prisma.member.findMany({
    where: { gender: null },
  });

  if (members.length === 0) {
    console.log("All members already have a gender assigned!");
    return;
  }

  console.log(`Found ${members.length} members missing gender. Processing...`);

  // Batch by 10 to respect genderize API limits
  const batches = chunkArray(members, 10);
  let updatedCount = 0;

  for (const batch of batches) {
    try {
      const names = batch.map((m) => {
        // use only the first part of the first name
        return m.firstName.split(" ")[0].trim();
      });

      const params = new URLSearchParams();
      names.forEach((n) => params.append("name[]", n));

      const { data } = await axios.get(
        `https://api.genderize.io/?${params.toString()}`
      );

      // data is an array of predictions: { name: '...', gender: 'male'|'female'|null, probability: ... }
      for (let i = 0; i < batch.length; i++) {
        const member = batch[i];
        const prediction = data[i];

        if (prediction && prediction.gender) {
          const genderEnum = prediction.gender === "male" ? "MALE" : "FEMALE";
          await prisma.member.update({
            where: { id: member.id },
            data: { gender: genderEnum },
          });
          console.log(`Updated ${member.firstName} -> ${genderEnum}`);
          updatedCount++;
        } else {
          // Default fallback to MALE if gender is ambiguous or unknown,
          // or we can just leave it. Let's fallback to MALE or FEMALE arbitrarily or leave null.
          // Leaving null might be better so it falls back to Sir/Madam, but the user requested:
          // "we need to title for everyone. based on their gender. fetch all data from db and update gender"
          // Let's set a default of MALE if unknown, or maybe Sir/Madam if null is kept.
          // We'll leave it null so it falls back to "Sir/Madam" gracefully if genderize fails.
          console.log(`Could not confidently predict gender for: ${member.firstName}`);
        }
      }

      // Small delay to prevent rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("Error processing batch", err);
    }
  }

  console.log(`Done! Successfully predicted and updated ${updatedCount} members.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
