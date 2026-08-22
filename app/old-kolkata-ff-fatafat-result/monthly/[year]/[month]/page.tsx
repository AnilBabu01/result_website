import MonthlyResultClient from "../../../../components/MonthlyResultClient/index";

type Props = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export const dynamic = "force-static";

/*
 * IMPORTANT:
 * Because next.config.js has:
 *
 * output: "export"
 *
 * Next.js needs to know every possible
 * [year]/[month] URL during build.
 */
export function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const params = [];

  // Example: generate 2024 -> current year
  for (let year = 2024; year <= currentYear; year++) {
    const maxMonth = year === currentYear ? currentMonth : 12;

    for (let month = 1; month <= maxMonth; month++) {
      params.push({
        year: String(year),
        month: String(month).padStart(2, "0"),
      });
    }
  }

  return params;
}

export default async function MonthlyResultPage({ params }: Props) {
  const { year, month } = await params;

  return (
    <MonthlyResultClient
      year={year}
      month={month}
    />
  );
}