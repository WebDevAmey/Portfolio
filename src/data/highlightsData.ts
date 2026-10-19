export type Highlight = {
  id: string;
  title: string;
  badge: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageFit?: "cover" | "contain";
  cardWidth?: number;
  link?: string;
};

// TODO(Amey): add achievements here. The Highlights section and its nav link
// stay hidden while this list is empty.
export const highlightsData: Highlight[] = [];
