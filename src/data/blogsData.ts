export interface Blog {
  title: string;
  date: string;
  /** Shown next to the date when set. */
  claps?: number;
  tags: string[];
  link: string;
  isExternal: boolean;
  slug?: string;
  description?: string;
  readingTime?: string;
  content?: BlogBlock[];
}

export type BlogBlock =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "quote";
      text: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "links";
      items: {
        title: string;
        href: string;
        description: string;
      }[];
    };

export const MEDIUM_PROFILE_URL = "https://medium.com/@ameytarmale7";

// Posts from Medium, newest first. The Blogs section and its nav links stay
// hidden while this list is empty.
export const blogsData: Blog[] = [
  {
    title: "The Silent Margin Leaks: How to Isolate and Fix Sudden Revenue Drops on Shopify",
    date: "Jun 24, 2026",
    tags: ["Shopify", "Analytics"],
    link: "https://medium.com/@ameytarmale7/the-silent-margin-leaks-how-to-isolate-and-fix-sudden-revenue-drops-on-shopify-861ebaab2fc7",
    isExternal: true,
  },
  {
    title: "Beyond Simple Chatbots: Deploying a Context-Aware AI Customer Support Agent Guided by Store Rules",
    date: "Jun 23, 2026",
    tags: ["AI Agents", "Shopify"],
    link: "https://medium.com/@ameytarmale7/beyond-simple-chatbots-deploying-a-context-aware-ai-customer-support-agent-guided-by-store-rules-7f2253233d7f",
    isExternal: true,
  },
  {
    title: "The Machines That Prove They Are Not Lying: An Introduction to Zero-Knowledge Virtual Machines",
    date: "Apr 21, 2026",
    tags: ["Zero Knowledge", "Cryptography"],
    link: "https://medium.com/@ameytarmale7/the-machines-that-prove-they-are-not-lying-an-introduction-to-zero-knowledge-virtual-machines-8ab8c404aef5",
    isExternal: true,
  },
  {
    title: "Why We Keep Going",
    date: "Nov 25, 2025",
    tags: ["Personal", "Growth"],
    link: "https://medium.com/@ameytarmale7/why-we-keep-going-f468e037eb66",
    isExternal: true,
  },
];

export const blogPosts = blogsData.filter(
  (blog): blog is Blog & { slug: string; content: BlogBlock[] } =>
    typeof blog.slug === "string" && Array.isArray(blog.content),
);

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((blog) => blog.slug === slug);
}
