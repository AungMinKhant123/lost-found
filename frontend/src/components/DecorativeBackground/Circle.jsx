const Circle = ({
  size,
  color,
  opacity = 1,
  top,
  left,
  right,
  bottom,
  blur = 0,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity,
        borderRadius: "9999px",
        filter: blur ? `blur(${blur}px)` : undefined,
        top: top !== undefined ? `${top}px` : undefined,
        left: left !== undefined ? `${left}px` : undefined,
        right: right !== undefined ? `${right}px` : undefined,
        bottom: bottom !== undefined ? `${bottom}px` : undefined,
      }}
    />
  );
};

export default Circle;
