import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1035 100%)",
          borderRadius: 7,
        }}
      >
        {/* Subtle glow ring */}
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* IK text */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: "-1px",
          }}
        >
          <span style={{ color: "#818cf8" }}>I</span>
          <span style={{ color: "#ffffff" }}>K</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
