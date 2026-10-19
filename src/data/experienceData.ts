export type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
};

// TODO(Amey): add internships, jobs, and education here. These entries only
// cover work that is visible on github.com/WebDevAmey.
export const experiences: ExperienceData[] = [
  {
    title: "Freelance",
    role: "Freelance Developer",
    dates: "2025 - Present",
    location: "Remote",
    src: "https://github.com/webdevamey.png",
    imageFit: "cover",
    imageZoom: 1,
    // TODO(Amey): add client work you can share. Rows without a description,
    // tech, or metrics render without the expand control.
    description: "",
    tech: [],
  },
];
