import { useState, useRef } from "react";
import useDimensions from "react-use-dimensions";
import "./graph.scss";

const Line = ({ path, color }) => {
  const dx = 100 / (path.length - 1);
  const d = `M0,${path[0]} ${path
    .slice(1)
    .map(
      (p, i) =>
        `C${dx * i + dx / 2},${path[i]} ` +
        `${dx * (i + 1) - dx / 2},${path[i + 1]} ` +
        `${dx * (i + 1)},${path[i + 1]} `
    )}`;
  return (
    <>
      <path stroke={color} d={d} fill="none" className="stroke" />
      <path
        d={d + ` V0 H0 Z`}
        fill={`url(#gradient-${color})`}
        className="gradient"
      />
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="100%" stopColor={color} stopOpacity={0.15} />
        </linearGradient>
      </defs>
    </>
  );
};

const Points = ({ data, width, height, setActive, range }) => {
  const timeout = useRef();
  const dr = Math.abs(range[1] - range[0]);
  const activate = (path, point) => {
    clearTimeout(timeout.current);
    setActive({ path, point });
  };
  const deactivate = (path, point) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setActive((cur) => {
        if (cur.path === path && cur.point === point) {
          return null;
        }
        return cur;
      });
    }, 200);
  };
  return (
    <div className="points">
      {data.map((row, r) =>
        row.map((y, i) => (
          <div
            key={i}
            style={{
              "--x": `${(i * width) / (row.length - 1)}px`,
              "--y": `${height - y * (height / dr)}px`,
            }}
            onMouseEnter={() => activate(r, i)}
            onMouseLeave={() => deactivate(r, i)}
          />
        ))
      )}
    </div>
  );
};

const Legend = ({ labels, colors }) => (
  <div className="legend">
    {labels.map((l, i) => (
      <div key={l}>
        <span style={{ "--color": colors[i] }} />
        {l}
      </div>
    ))}
  </div>
);

const Marker = ({ colors, labels, data, active, width, height, range }) => {
  const { path, point } = active || {};
  const value = data[path]?.[point];
  const dr = Math.abs(range[1] - range[0]);
  return (
    <div
      className="marker"
      style={{
        opacity: active ? 1 : 0,
        "--color": colors[path],
        "--x": `${(point * width) / (data[path]?.length - 1)}px`,
        "--y": `${height - value * (height / dr)}px`,
      }}
    >
      <div className="tooltip">
        <span>{labels[point]}</span>
        <span>${value?.toLocaleString?.()}</span>
      </div>
      <div className="line" />
      <div className="circle" />
    </div>
  );
};

export const Graph = ({
  data,
  colors,
  range,
  labels,
  title,
  subtitle,
  legend,
}) => {
  const [active, setActive] = useState({ path: 1, point: 2 });
  const graph = useRef();
  const { width, height } = useDimensions(graph);
  return (
    <div className="graph" ref={graph}>
      <div className="heading">
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>
      <Marker
        colors={colors}
        data={data}
        active={active}
        labels={labels}
        width={width}
        height={height}
        range={range}
      />
      <Legend colors={colors} labels={legend} />
      <svg viewBox={`0 ${range[0]} 100 ${range[1]}`} preserveAspectRatio="none">
        {data.map((path, i) => (
          <Line key={i} path={path} color={colors[i]} />
        ))}
      </svg>
      <div className="labels">
        {labels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <Points
        data={data}
        width={width}
        height={height}
        setActive={setActive}
        range={range}
      />
    </div>
  );
};
