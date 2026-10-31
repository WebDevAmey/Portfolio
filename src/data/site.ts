export const site = {
  name: "Amey Tarmale",
  shortName: "Amey",
  role: "Founder and developer",
  url: "https://www.ameytarmale.site",
  description:
    "Amey Tarmale is a CS student at MIT-WPU Pune and the founder and developer of OVRT. He builds products, agents and interfaces for founders and developers.",
  email: "ameytarmale7@gmail.com",
  // TODO(Amey): point this at /resume.pdf once a resume is added to public/.
  resumeUrl: "https://www.linkedin.com/in/amey-tarmale-64b499241",
  status: "Building OVRT",
  statusDetail: "open to collaborations",
  location: "Pune, India",
  socials: [
    { label: "GitHub", href: "https://github.com/WebDevAmey", handle: "WebDevAmey" },
    { label: "X", href: "https://x.com/ameytwtcorp", handle: "@ameytwtcorp" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/amey-tarmale-64b499241",
      handle: "amey-tarmale",
    },
  ],
  twitter: "@ameytwtcorp",
} as const;

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
  { label: "Resume", href: site.resumeUrl, external: true },
] as const;
