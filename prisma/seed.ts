import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  console.log("Clearing existing data...");
  await prisma.absensi.deleteMany();
  await prisma.publicHoliday.deleteMany();
  await prisma.pegawai.deleteMany();

  console.log("Seeding employees...");
  const pegawai = await prisma.pegawai.createMany({
    data: [
      {
        nama: "Budi Santoso",
        email: "budi.santoso@company.com",
        jabatan: "Software Engineer",
        tanggalMasuk: new Date("2023-01-15"),
        statusAktif: true,
      },
      {
        nama: "Siti Nurhaliza",
        email: "siti.nurhaliza@company.com",
        jabatan: "Product Manager",
        tanggalMasuk: new Date("2022-06-01"),
        statusAktif: true,
      },
      {
        nama: "Ahmad Hidayat",
        email: "ahmad.hidayat@company.com",
        jabatan: "UI/UX Designer",
        tanggalMasuk: new Date("2023-03-20"),
        statusAktif: true,
      },
      {
        nama: "Dewi Lestari",
        email: "dewi.lestari@company.com",
        jabatan: "HR Manager",
        tanggalMasuk: new Date("2021-09-10"),
        statusAktif: true,
      },
      {
        nama: "Rudi Hartono",
        email: "rudi.hartono@company.com",
        jabatan: "DevOps Engineer",
        tanggalMasuk: new Date("2022-11-05"),
        statusAktif: true,
      },
      {
        nama: "Maya Sari",
        email: "maya.sari@company.com",
        jabatan: "Marketing Specialist",
        tanggalMasuk: new Date("2023-02-14"),
        statusAktif: false, // Inactive employee
      },
    ],
  });
  console.log(`Created ${pegawai.count} employees`);

  const allPegawai = await prisma.pegawai.findMany();

  console.log("Seeding public holidays...");
  const holidays = await prisma.publicHoliday.createMany({
    data: [
      {
        tanggal: new Date("2026-01-01"),
        nama: "Tahun Baru Masehi",
        keterangan: "Tahun Baru 2026",
        isNational: true,
      },
      {
        tanggal: new Date("2026-02-05"),
        nama: "Tahun Baru Imlek",
        keterangan: "Tahun Baru Imlek 2577 Kongzili",
        isNational: true,
      },
      {
        tanggal: new Date("2026-03-11"),
        nama: "Isra Mi'raj Nabi Muhammad SAW",
        keterangan: "Peringatan Isra Mi'raj",
        isNational: true,
      },
      {
        tanggal: new Date("2026-03-14"),
        nama: "Hari Suci Nyepi",
        keterangan: "Tahun Baru Saka 1948",
        isNational: true,
      },
      {
        tanggal: new Date("2026-04-03"),
        nama: "Wafat Isa Al Masih",
        keterangan: "Jumat Agung",
        isNational: true,
      },
      {
        tanggal: new Date("2026-04-13"),
        nama: "Hari Raya Idul Fitri",
        keterangan: "1 Syawal 1447 H",
        isNational: true,
      },
      {
        tanggal: new Date("2026-04-14"),
        nama: "Hari Raya Idul Fitri",
        keterangan: "2 Syawal 1447 H",
        isNational: true,
      },
      {
        tanggal: new Date("2026-05-01"),
        nama: "Hari Buruh Internasional",
        keterangan: "May Day",
        isNational: true,
      },
      {
        tanggal: new Date("2026-05-21"),
        nama: "Kenaikan Isa Al Masih",
        keterangan: "Hari Kenaikan Yesus Kristus",
        isNational: true,
      },
      {
        tanggal: new Date("2026-06-01"),
        nama: "Hari Lahir Pancasila",
        keterangan: "Peringatan Hari Lahir Pancasila",
        isNational: true,
      },
      {
        tanggal: new Date("2026-06-04"),
        nama: "Hari Raya Waisak",
        keterangan: "Waisak 2570 BE",
        isNational: true,
      },
      {
        tanggal: new Date("2026-06-20"),
        nama: "Hari Raya Idul Adha",
        keterangan: "10 Dzulhijjah 1447 H",
        isNational: true,
      },
      {
        tanggal: new Date("2026-07-10"),
        nama: "Tahun Baru Islam",
        keterangan: "1 Muharram 1448 H",
        isNational: true,
      },
      {
        tanggal: new Date("2026-08-17"),
        nama: "Hari Kemerdekaan RI",
        keterangan: "HUT ke-81 Kemerdekaan RI",
        isNational: true,
      },
      {
        tanggal: new Date("2026-09-18"),
        nama: "Maulid Nabi Muhammad SAW",
        keterangan: "12 Rabiul Awal 1448 H",
        isNational: true,
      },
      {
        tanggal: new Date("2026-12-25"),
        nama: "Hari Raya Natal",
        keterangan: "Perayaan Natal",
        isNational: true,
      },
    ],
  });
  console.log(`✅ Created ${holidays.count} public holidays`);

  // Seed Absensi (Sample attendance for January 2026)
  console.log("📅 Seeding attendance records...");
  const absensiData = [];

  // Create attendance for first 2 weeks of January 2026 (excluding weekends)
  const startDate = new Date("2026-01-02"); // Friday
  const endDate = new Date("2026-01-16"); // Friday

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();

    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Skip New Year's Day (2026-01-01)
    if (date.getDate() === 1 && date.getMonth() === 0) continue;

    // Create attendance for each active employee
    for (const employee of allPegawai) {
      if (!employee.statusAktif) continue; // Skip inactive employees

      // Randomly assign attendance status (90% present, 5% leave, 3% sick, 2% absent)
      const random = Math.random();
      let status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA" = "HADIR";
      let jamMasuk: Date | null = new Date(date);
      let jamKeluar: Date | null = new Date(date);

      if (random < 0.9) {
        // 90% present
        status = "HADIR";
        // Random check-in time between 08:00 and 09:00
        jamMasuk.setHours(8, Math.floor(Math.random() * 60), 0, 0);
        // Random check-out time between 17:00 and 18:00
        jamKeluar.setHours(17, Math.floor(Math.random() * 60), 0, 0);
      } else if (random < 0.95) {
        // 5% leave
        status = "IZIN";
        jamMasuk = null;
        jamKeluar = null;
      } else if (random < 0.98) {
        // 3% sick
        status = "SAKIT";
        jamMasuk = null;
        jamKeluar = null;
      } else {
        // 2% absent
        status = "ALPHA";
        jamMasuk = null;
        jamKeluar = null;
      }

      absensiData.push({
        pegawaiId: employee.id,
        tanggal: new Date(date),
        jamMasuk,
        jamKeluar,
        status,
      });
    }
  }

  const absensi = await prisma.absensi.createMany({
    data: absensiData,
  });
  console.log(`✅ Created ${absensi.count} attendance records`);

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
