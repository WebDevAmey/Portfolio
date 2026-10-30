import { ImageResponse } from "next/og";

import { MARK_PATH } from "@/components/icons";
import { site } from "@/data/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#f7f7f5",
        color: "#111111",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: "#111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24">
            <path d={MARK_PATH} fill="#f7f7f5" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            color: "#666666",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#111111" }} />
          {site.status} · {site.statusDetail}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 36, color: "#666666" }}>
          Builds products for founders. MIT-WPU, Pune.
        </div>
      </div>
    </div>,
    size,
  );
}
