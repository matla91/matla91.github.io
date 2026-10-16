import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// Original procedural illustration. No experimental data or institutional assets.
const ellipsoids = [
  { c: [0.16, 0.22, 0], r: [0.63, 0.74, 0.43], n: 290 },
  { c: [-0.37, -0.47, 0], r: [0.37, 0.34, 0.33], n: 140 },
  { c: [-0.43, -1.03, -0.09], r: [0.13, 0.48, 0.12], n: 74 },
  { c: [-0.13, -0.99, 0.04], r: [0.12, 0.5, 0.12], n: 74 },
  { c: [0.62, 0.49, 0], r: [0.21, 0.22, 0.23], n: 48 },
  { c: [-0.19, 0.84, 0.18], r: [0.48, 0.14, 0.27], n: 64 },
];
const cloud = ellipsoids.flatMap((e, part) =>
  Array.from({ length: e.n }, (_, i) => {
    const z = 1 - (2 * (i + 0.5)) / e.n;
    const t = i * 2.399963229728653;
    const radius = Math.sqrt(1 - z * z);
    const x = e.c[0] + e.r[0] * radius * Math.cos(t);
    const y = e.c[1] + e.r[1] * z;
    const depth = e.c[2] + e.r[2] * radius * Math.sin(t);
    return {
      x: 290 + x * 139 + depth * 48,
      y: 283 + y * 130 - depth * 28,
      r: 0.75 + (depth + 0.55) * 1.1,
      opacity: 0.28 + (depth + 0.5) * 0.56,
      part,
    };
  }),
);
export default function ScientificVisual() {
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState<"signals" | "structure">("structure");
  const figure = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const visibility = () => setVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => setActive(entry.isIntersecting))
        : null;
    if (figure.current) observer?.observe(figure.current);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const id = useId().replace(/:/g, "");
  return (
    <figure
      ref={figure}
      className={`science-figure ${paused || !active || !visible ? "visual-paused" : ""}`}
    >
      <div className="figure-top">
        <span className="micro">SIGNAL → STRUCTURE</span>
        <span className="micro">CONCEPT / 001</span>
      </div>
      <svg
        className="point-cloud"
        viewBox="0 0 580 510"
        role="img"
        aria-label={
          stage === "structure"
            ? "Conceptual bunny point cloud inside a wireframe volume"
            : "Conceptual transient signal traces before reconstruction"
        }
      >
        <defs>
          <pattern
            id={`${id}-grid`}
            width="38"
            height="38"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M38 0H0V38"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity=".14"
            />
          </pattern>
          <linearGradient id={`${id}-scan`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity=".14" />
          </linearGradient>
        </defs>
        <rect width="580" height="510" fill={`url(#${id}-grid)`} />
        <g fill="none" stroke="currentColor" strokeWidth=".65" opacity=".24">
          <path d="M86 146 353 97 490 166 490 402 230 458 86 382ZM86 146 230 218 490 166M230 218V458M353 97V332L86 382M353 332 490 402" />
          {Array.from({ length: 6 }, (_, i) => (
            <path
              key={i}
              d={`M${86 + i * 28} ${382 + i * 15}L${353 + i * 27} ${332 + i * 14}`}
            />
          ))}
        </g>
        <g
          className={
            stage === "structure" ? "cloud-points is-visible" : "cloud-points"
          }
        >
          <g className="cloud-motion">
            {cloud.map((p, i) => (
              <circle
                key={i}
                cx={p.x.toFixed(2)}
                cy={p.y.toFixed(2)}
                r={p.r.toFixed(2)}
                opacity={p.opacity.toFixed(2)}
                fill="currentColor"
              />
            ))}
          </g>
        </g>
        <g
          className={
            stage === "signals" ? "signal-traces is-visible" : "signal-traces"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          {Array.from({ length: 8 }, (_, row) => (
            <path
              key={row}
              opacity={0.35 + row * 0.08}
              d={Array.from({ length: 121 }, (_, i) => {
                const x = 72 + i * 3.7;
                const y =
                  155 +
                  row * 29 -
                  Math.sin(i * 0.36 + row * 0.6) *
                    Math.exp(-((i - 58 - row * 2) ** 2) / 420) *
                    32;
                return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(" ")}
            />
          ))}
        </g>
        <g
          className={`scan-plane ${stage === "structure" ? "" : "scan-hidden"}`}
        >
          <path
            d="M87 201 352 151 490 220 230 272Z"
            fill={`url(#${id}-scan)`}
          />
          <path
            d="M87 201 230 272 490 220"
            fill="none"
            stroke="currentColor"
            strokeWidth=".7"
            opacity=".55"
          />
        </g>
        <g className="axis-labels" fill="currentColor">
          <text x="73" y="403">
            x
          </text>
          <text x="228" y="480">
            y
          </text>
          <text x="499" y="165">
            z
          </text>
        </g>
        <path
          d="M30 35V23H42M538 23H550V35M30 475V487H42M538 487H550V475"
          stroke="currentColor"
          fill="none"
          opacity=".5"
        />
      </svg>
      <div className="figure-controls">
        <div
          className="stage-control"
          role="group"
          aria-label="Illustration stage"
        >
          <button
            type="button"
            aria-pressed={stage === "signals"}
            onClick={() => setStage("signals")}
          >
            <span>01</span> Signals
          </button>
          <button
            type="button"
            aria-pressed={stage === "structure"}
            onClick={() => setStage("structure")}
          >
            <span>02</span> Structure
          </button>
        </div>
        <button
          type="button"
          className="icon-button pause-visual"
          aria-label={
            paused ? "Play visual animation" : "Pause visual animation"
          }
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>
      </div>
      <figcaption className="science-caption" aria-live="polite">
        {stage === "structure"
          ? "Recovering hidden geometry from indirect light."
          : "Indirect light carries time-resolved information."}
        <span>Procedural illustration · not experimental data</span>
      </figcaption>
    </figure>
  );
}
