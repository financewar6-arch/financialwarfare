export function CornerBrackets({ color }: { color: string }) {
  const arm = 16;
  const stroke = 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          width: arm,
          height: arm,
          borderTop: `${stroke}px solid ${color}`,
          borderLeft: `${stroke}px solid ${color}`,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -1,
          right: -1,
          width: arm,
          height: arm,
          borderTop: `${stroke}px solid ${color}`,
          borderRight: `${stroke}px solid ${color}`,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -1,
          left: -1,
          width: arm,
          height: arm,
          borderBottom: `${stroke}px solid ${color}`,
          borderLeft: `${stroke}px solid ${color}`,
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: arm,
          height: arm,
          borderBottom: `${stroke}px solid ${color}`,
          borderRight: `${stroke}px solid ${color}`,
          opacity: 0.75,
        }}
      />
    </>
  );
}
