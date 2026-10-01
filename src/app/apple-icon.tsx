import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6f5845",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 64 64">
          <path d="M20 50V30a12 12 0 0 1 24 0v20z" fill="#f7f4ef" />
          <path d="M28 50V37a4 4 0 0 1 8 0v13z" fill="#6f5845" />
        </svg>
      </div>
    ),
    size,
  );
}
