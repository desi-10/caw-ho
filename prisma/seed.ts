import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const members = [
    {
      firstName: "JesLord",
      lastName: "K. Kwarteng",
      phone: "0548444631",
      role: Role.PASTOR,
    },
    {
      firstName: "Eugene",
      lastName: "F. Yao Dushie",
      phone: "0595744536",
      role: Role.LEADER,
    },
    {
      firstName: "Evelyn",
      lastName: "Dede Teye",
      phone: "0549640540",
      role: Role.LEADER,
    },
    {
      firstName: "Desmond",
      lastName: "Kudjuh",
      phone: "0594324150",
      role: Role.LEADER,
    },
    {
      firstName: "Godsway",
      lastName: "Adzah",
      phone: "0548923024",
      role: Role.LEADER,
    },
    {
      firstName: "John",
      lastName: "Azilah",
      phone: "0596564740",
      role: Role.LEADER,
    },
    {
      firstName: "Livingstone",
      lastName: "Yao Amenuku",
      phone: "0552452331",
      role: Role.LEADER,
    },
    {
      firstName: "Prince Charles",
      lastName: "Nuwordu",
      phone: "0550446762",
      role: Role.LEADER,
    },
    {
      firstName: "Roger",
      lastName: "Nadugbey",
      phone: "0549588333",
      role: Role.LEADER,
    },
    {
      firstName: "Harriet",
      lastName: "Azuma Dzifa",
      phone: "0593655839",
      role: Role.LEADER,
    },
    {
      firstName: "Emmanuella",
      lastName: "Amofa",
      phone: "0536168101",
      role: Role.LEADER,
    },
    {
      firstName: "Grace",
      lastName: "Akyea-Mensah",
      phone: "0509168950",
      role: Role.LEADER,
    },
    {
      firstName: "Dominic",
      lastName: "Korbe",
      phone: "0541056990",
      role: Role.LEADER,
    },

    {
      firstName: "Collins",
      lastName: "Osabutey",
      phone: "0541056990",
      role: Role.MEMBER,
    },
    {
      firstName: "Prosper",
      lastName: "Dela Segbefia",
      phone: "0257462404",
      role: Role.MEMBER,
    },
    {
      firstName: "Isaac",
      lastName: "Adjei",
      phone: "0550541098",
      role: Role.MEMBER,
    },
    {
      firstName: "Julius",
      lastName: "Oko Onyibest",
      phone: "0556062726",
      role: Role.MEMBER,
    },
    {
      firstName: "Delight",
      lastName: "Kekeli Dziwornu",
      phone: "0534574642",
      role: Role.MEMBER,
    },
    {
      firstName: "Justice",
      lastName: "Mortoti",
      phone: "0530859175",
      role: Role.MEMBER,
    },
    {
      firstName: "Bismark",
      lastName: "Agbebianu",
      phone: "0552271120",
      role: Role.MEMBER,
    },
    {
      firstName: "Cecil",
      lastName: "Dewodo",
      phone: "0537326965",
      role: Role.MEMBER,
    },
    {
      firstName: "Favour",
      lastName: "Ofodum",
      phone: "0536158443",
      role: Role.MEMBER,
    },
    {
      firstName: "Pearl",
      lastName: "Adzo Kanati",
      phone: "0539656676",
      role: Role.MEMBER,
    },
    {
      firstName: "Victoria",
      lastName: "Etor",
      phone: "0543780665",
      role: Role.MEMBER,
    },
    {
      firstName: "Augustine",
      lastName: "Silivi",
      phone: "0593909086",
      role: Role.MEMBER,
    },
    {
      firstName: "Felix",
      lastName: "Sena",
      phone: "0552529939",
      role: Role.MEMBER,
    },
    {
      firstName: "Bright",
      lastName: "Adzraku",
      phone: "0534448090",
      role: Role.MEMBER,
    },
    {
      firstName: "Kingsley",
      lastName: "M. Yao Okoro",
      phone: "0531792873",
      role: Role.MEMBER,
    },
    {
      firstName: "Michael",
      lastName: "W. Armstrong",
      phone: "0559235568",
      role: Role.MEMBER,
    },
    {
      firstName: "Derrick",
      lastName: "Kudjuh",
      phone: "0241370636",
      role: Role.MEMBER,
    },
    {
      firstName: "Richard",
      lastName: "Kwame Tekpa",
      phone: "0556480604",
      role: Role.MEMBER,
    },
    {
      firstName: "Susana",
      lastName: "Amoh",
      phone: "0546895472",
      role: Role.MEMBER,
    },
  ];

  await prisma.member.createMany({
    data: members,
    skipDuplicates: true,
  });

  await auth.api.createUser({
    body: {
      name: "Desmond Kudjuh", // required
      email: "desmondkudjuh99@gmail.com", // required
      password: "password1234", // required
      role: "admin",
    },
  });

  console.log("Members seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
