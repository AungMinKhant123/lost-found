// Renders a single decorative blob shape, using a raw SVG path exported
// directly from Figma (via "Copy as SVG").
//
// Unlike Circle (which is just a styled div), a blob's shape only
// exists as an SVG path — there's no way to draw an organic freeform
// shape like this with plain CSS, so we render an actual <svg> element
// sized/positioned the same way Circle is.
const Blob = ({
  path, // the "d" attribute from Figma's exported <path>
  viewBox, // the "viewBox" attribute from Figma's exported <svg>
  width, // rendered width in px (can differ from the SVG's native size, to scale it)
  height, // rendered height in px
  color, // fill color
  opacity = 1,
  top,
  left,
  right,
  bottom,
  rotate = 0, // degrees, for flipping/orienting the same blob differently per placement
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      style={{
        position: "absolute",
        opacity,
        top: top !== undefined ? `${top}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        bottom: bottom !== undefined ? `${bottom}px` : undefined,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <path d={path} fill={color} />
    </svg>
  );
};

export default Blob;
