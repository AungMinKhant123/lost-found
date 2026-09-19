// Design data for decorative background circles, per page "variant."
//
// Each circle: size (px), color (hex), opacity (0-1), position (top/
// left/right/bottom, in px — only supply the ones needed to anchor a
// corner), and optional blur (px, for a soft/glow look; omit or 0 for
// a crisp solid circle).
//
// To add circles to a NEW page variant, just add a new key here — no
// new JSX needed anywhere, DecorativeBackground.jsx handles rendering
// automatically for any variant that exists in this file.

// Design data for decorative background shapes, per page "variant."
// Each entry needs a "type": "circle" (rendered by Circle.jsx) or
// "blob" (rendered by Blob.jsx, using a raw SVG path from Figma).
export const designs = {
  account: [
    {
      type: "circle",
      size: 200,
      color: "#4B32A8",
      opacity: 0.6,
      top: 200,
      right: -140,
    },
    {
      type: "circle",
      size: 204,
      color: "#4B32A8",
      opacity: 0.8,
      top: 527,
      left: -110,
    },
  ],

  home: [
    // Hero blob — full width, sits behind "Campus Lost & Found"
    {
      type: "blob",
      path: "M1131.66 88.903C1183.12 51.9089 1118.52 7.65822 1092.22 0.501953L-17 28.2851V521.436C61.8741 536.801 146.251 582.573 334.396 639.094C605.443 720.519 718.826 385.663 1131.66 88.903Z",
      viewBox: "0 0 1152 652",
      width: 1750,
      height: 650,
      color: "#6F4FB4",
      top: -50,
      left: -280,
    },
    // Tall left blob — behind the phone/headphones images, bleeding off the left edge
    {
      type: "blob",
      path: "M493.275 503.555C526.41 463.214 573.313 388.12 493.275 277.62L387.313 210.12L-16.92 0.701339L-89.9134 191.178L-146.077 831.761C-114.672 858.409 -88.9641 922.932 -19.3937 1010.89C80.8311 1137.61 227.47 827.161 493.275 503.555Z",
      viewBox: "0 0 538 1041",
      width: 538,
      height: 900,
      color: "#6F4FB4",
      top: 800,
      left: -15,
    },
    // Tall right blob — behind Speed Matters / Human Review sections
    {
      type: "blob",
      path: "M107.868 721.432C115.382 773.093 139.318 858.334 274.908 873.564L396.161 840.675L823.179 682.825L731.505 500.603L295.721 27.745C254.873 33.0205 189.86 8.58095 77.9837 0.788941C-83.1875 -10.4364 47.5955 307.016 107.868 721.432Z",
      viewBox: "0 0 260 875",
      width: 260,
      height: 850,
      color: "#6F4FB4",
      top: 800,
      right: -60,
    },
    // Bottom-right blob — behind the end of Human Review / start of Recently Reported
    {
      type: "blob",
      path: "M3.33554 618.346C1.40325 660.524 9.3793 728.063 137.852 716.741L261.025 667.44L702.289 458.415L646.05 321.25L308.646 0.559941C268.185 12.2795 209.636 3.27305 102.782 16.6367C-51.155 35.8887 18.8358 279.999 3.33554 618.346Z",
      viewBox: "0 0 334 719",
      width: 334,
      height: 719,
      color: "#6F4FB4",
      top: 1700,
      right: -170,
    },
  ],
  itemList: [
    {
      type: "blob",
      path: "M11.15 184.423C1.78624 198.196 -10.7617 223.334 20.0242 255.293L57.6864 272.888L199.475 324.929L216.112 262.718L209.508 59.8873C198.085 52.5889 187.056 33.2179 160.615 7.97609C122.522 -28.3878 86.2644 73.9421 11.15 184.423Z",
      viewBox: "0 0 267 875",
      width: 267,
      height: 875,
      color: "#604AB1",
      top: 270,
      right: -130,
    },
    {
      type: "blob",
      path: "M115.163 141.384C124.543 127.622 137.12 102.498 106.371 70.5036L68.7292 52.8644L-72.9994 0.658464L-89.708 62.8509L-83.3398 265.689C-71.925 273 -60.9191 292.384 -34.5067 317.657C3.54374 354.065 39.9202 251.777 115.163 141.384Z",
      viewBox: "0 0 267 875",
      width: 511,
      height: 875,
      color: "#6F4FB4",
      top: 340,
      left: -95,
    },
  ],
};
