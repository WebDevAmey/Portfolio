import { getContributionCalendar } from "@/lib/github-contributions";

// Refresh the calendar at most once an hour; visitors get the cached copy.
export const revalidate = 3600;

export async function GET() {
  const calendar = await getContributionCalendar();
  return Response.json(calendar);
}
