import type { Project } from "../content/portfolio";
export default function ProjectVisual({ project }: { project: Project }) {
  if (project.image)
    return (
      <img
        src={`/assets/${project.image}-1280.webp`}
        srcSet={`/assets/${project.image}-640.webp 640w, /assets/${project.image}-1280.webp 1280w`}
        sizes="(max-width: 760px) 100vw, 60vw"
        width="1280"
        height="721"
        loading="lazy"
        alt={
          project.visual === "nlos"
            ? "Conceptual bunny volume in a wireframe cube on a tablet"
            : "Basel Tram Air historical air-quality dashboard on a tablet"
        }
      />
    );
  return (
    <svg
      viewBox="0 0 800 480"
      className="project-diagram"
      role="img"
      aria-label={project.caption}
    >
      <defs>
        <pattern
          id={`grid-${project.slug}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="#010409"
            strokeWidth=".5"
            opacity=".12"
          />
        </pattern>
      </defs>
      <rect width="800" height="480" fill="#f5f5f3" />
      <rect width="800" height="480" fill={`url(#grid-${project.slug})`} />
      <g stroke="#010409" fill="none" strokeWidth="1.5">
        {project.visual === "industrial" && (
          <>
            <rect x="75" y="115" width="235" height="230" rx="4" />
            <path d="M95 145h30m-30 0v30m195-30h-30m30 0v30m-195 150h30m-30 0v-30m195 30h-30m30 0v-30" />
            <rect x="120" y="194" width="146" height="57" rx="28" />
            <path d="M132 250v27h125v-27M158 193v-13h51v13M135 274v13m105-13v13" />
            <path d="M333 231h90m-12-8 12 8-12 8" />
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x="453" y={130 + i * 73} width="270" height="55" rx="3" />
                <rect
                  x="471"
                  y={148 + i * 73}
                  width={i === 1 ? 180 : 100 - i * 25}
                  height="18"
                  fill={i === 1 ? "#010409" : "#bebebe"}
                  stroke="none"
                />
              </g>
            ))}
            <g
              fill="#454545"
              stroke="none"
              fontSize="11"
              fontFamily="monospace"
            >
              <text x="78" y="377">
                CURATE / LABEL / AUGMENT
              </text>
              <text x="453" y="377">
                TRAIN / EVALUATE / DELIVER
              </text>
              <text x="77" y="72">
                INDUSTRIAL VISION — CONCEPTUAL PIPELINE
              </text>
            </g>
          </>
        )}
        {project.visual === "validation" && (
          <>
            <path d="M85 342H721m-10-7 10 7-10 7" />
            {Array.from({ length: 18 }, (_, i) => (
              <path key={i} d={`M${102 + i * 34} 337v10`} opacity=".4" />
            ))}
            <rect x="100" y="165" width="350" height="126" fill="#010409" />
            <rect
              x="473"
              y="165"
              width="65"
              height="126"
              strokeDasharray="3 4"
            />
            <rect x="560" y="165" width="141" height="126" fill="#bebebe" />
            <path d="M470 118v204" strokeDasharray="3 4" />
            <g stroke="none" fontFamily="monospace">
              <text x="77" y="72" fill="#454545" fontSize="11">
                EVALUATION DESIGN — SCHEMATIC
              </text>
              <text x="123" y="209" fill="white" fontSize="14">
                TRAIN
              </text>
              <text x="123" y="236" fill="#bebebe" fontSize="11">
                FIT NORMALIZATION HERE
              </text>
              <text x="578" y="209" fill="#010409" fontSize="14">
                TEST
              </text>
              <text x="100" y="381" fill="#454545" fontSize="11">
                PAST
              </text>
              <text x="630" y="381" fill="#454545" fontSize="11">
                FUTURE →
              </text>
              <text x="448" y="104" fill="#010409" fontSize="11">
                2018
              </text>
              <text x="476" y="309" fill="#454545" fontSize="10">
                BOUNDARY
              </text>
            </g>
          </>
        )}
        {project.visual === "spark" && (
          <>
            <rect x="66" y="188" width="150" height="96" rx="3" />
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <path d={`M216 236H280V${113 + i * 121}H339`} />
                <rect x="339" y={77 + i * 121} width="165" height="72" rx="3" />
                <path d={`M504 ${113 + i * 121}H562V236H608`} />
              </g>
            ))}
            <rect x="608" y="188" width="123" height="96" rx="3" />
            <g
              fill="#010409"
              stroke="none"
              fontFamily="monospace"
              fontSize="12"
            >
              <text x="91" y="232">
                1.6M TWEETS
              </text>
              <text x="93" y="251" fontSize="10">
                SENTIMENT140
              </text>
              <text x="364" y="118">
                PARTITION 01
              </text>
              <text x="364" y="239">
                PARTITION 02
              </text>
              <text x="364" y="360">
                PARTITION 03
              </text>
              <text x="627" y="232">
                MINHASH
              </text>
              <text x="627" y="252">
                + AkNN
              </text>
              <text x="66" y="50" fill="#454545" fontSize="11">
                DISTRIBUTED COMPUTING — CONCEPTUAL DATAFLOW
              </text>
              <text x="66" y="424" fontSize="11">
                REPRESENT → DISTRIBUTE → COMPARE
              </text>
            </g>
          </>
        )}
      </g>
    </svg>
  );
}
