// Original decorative SVG studies, kept local to the Expertise section.
// The device screens are illustrative interfaces rather than client work.
const material = {
  deep: 'var(--bg-main)',
  face: 'var(--bg-elevated)',
  plate: 'var(--bg-card-hover)',
  edge: 'var(--border-default)',
  metal: '#293b30',
  highlight: '#657c6c',
};

export function SoftwareIllustration() {
  return (
    <svg viewBox="0 0 360 230" fill="none" aria-hidden="true" focusable="false">
      <g stroke={material.edge} strokeWidth="0.7" opacity="0.6">
        <path d="M26 179 180 103 335 179 180 253Z" />
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${52 + i * 26} ${166 - i * 13}l155 76 M${52 + i * 26} ${192 + i * 13}l155 -76`} />)}
      </g>
      <path d="M78 90v30l78 40m109-73v32l-61 36m-24 13v25l52 25" stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="1" strokeLinejoin="round" />
      <path d="m127 181 53-27 53 27-53 26Z" fill={material.plate} stroke="var(--accent)" strokeOpacity="0.28" />
      {[126, 97, 68].map((y, index) => (
        <g key={y}>
          <path d={`M138 ${y}l42-22 42 22v25l-42 22-42-22Z`} fill={material.face} stroke={material.highlight} strokeWidth="0.85" />
          <path d={`M138 ${y}l42 22 42-22-42-22Z`} fill={index === 2 ? material.metal : material.plate} stroke={material.highlight} strokeWidth="0.75" />
          <path d={`M180 ${y + 22}v25l42-22v-25Z`} fill={material.deep} stroke={material.edge} strokeWidth="0.7" />
          <path d={`m146 ${y + 10} 23 12m-23-5 15 8`} stroke="#72818c" strokeWidth="1.4" />
          <path d={`m188 ${y + 24} 4-2m5-3 4-2m5-3 4-2`} stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <g transform="translate(49 56)">
        <rect width="57" height="43" rx="10" fill={material.face} stroke={material.edge} />
        <path d="M18 29h24a7 7 0 0 0 0-14 11 11 0 0 0-21-1 8 8 0 0 0-3 15Z" stroke="#91b4b1" strokeWidth="1.4" />
      </g>
      <g transform="translate(248 58)">
        <rect width="54" height="42" rx="10" fill={material.face} stroke={material.edge} />
        <path d="m19 14-7 7 7 7m17-14 7 7-7 7m-7-17-5 20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(218 179)">
        <rect width="46" height="43" rx="10" fill={material.face} stroke={material.edge} />
        <ellipse cx="23" cy="13" rx="10" ry="4" stroke="#9bb7b4" strokeWidth="1.2" />
        <path d="M13 13v18c0 5 20 5 20 0V13M13 22c0 5 20 5 20 0" stroke="#9bb7b4" strokeWidth="1.2" />
      </g>
      <g fill="var(--accent)"><circle cx="78" cy="120" r="2" /><circle cx="265" cy="119" r="2" /><circle cx="180" cy="193" r="2" /></g>
    </svg>
  );
}

function LandingScreen({ mobile = false }: { mobile?: boolean }) {
  return mobile ? (
    <g>
      <rect width="70" height="136" rx="6" fill={material.face} />
      <text x="9" y="19" fill="#e1ece7" fontSize="5" fontWeight="700">north.</text>
      <path d="M55 15h7m-7 3h7" stroke="#a2b0bb" strokeWidth="0.7" />
      <text x="9" y="43" fill="#f5f7fa" fontSize="7.2" fontWeight="700"><tspan x="9">Build something</tspan><tspan x="9" dy="12">exceptional.</tspan></text>
      <path d="M9 65h45m-45 4h34" stroke="#687b89" strokeWidth="1.2" />
      <rect x="9" y="79" width="34" height="10" rx="3" fill="var(--accent)" />
      <text x="14" y="86" fill="#082018" fontSize="4" fontWeight="700">Get started ↗</text>
      <rect x="9" y="103" width="23" height="21" rx="4" fill={material.plate} stroke={material.edge} strokeWidth="0.5" />
      <rect x="38" y="103" width="23" height="21" rx="4" fill={material.plate} stroke={material.edge} strokeWidth="0.5" />
      <path d="m15 117 4-7 6 9m20-7h10m-10 5h6" stroke="#80b59f" strokeWidth="1" />
    </g>
  ) : (
    <g>
      <rect width="244" height="145" fill={material.face} />
      <text x="15" y="20" fill="#e1ece7" fontSize="8" fontWeight="700">north.</text>
      <text x="111" y="19" fill="#97a7b5" fontSize="4.5">Product</text>
      <text x="142" y="19" fill="#97a7b5" fontSize="4.5">About</text>
      <text x="168" y="19" fill="#97a7b5" fontSize="4.5">Resources</text>
      <rect x="204" y="11" width="27" height="12" rx="3" fill="#213b32" />
      <text x="210" y="19" fill="#93e4b9" fontSize="4.5">Let's talk</text>
      <path d="M14 30h216" stroke="#23343f" strokeWidth="0.6" />
      <text x="17" y="59" fill="#f5f7fa" fontSize="15" fontWeight="700"><tspan x="17">Build something</tspan><tspan x="17" dy="19">exceptional.</tspan></text>
      <path d="M17 90h101m-101 5h78" stroke="#687b89" strokeWidth="1.3" />
      <rect x="17" y="108" width="51" height="16" rx="4" fill="var(--accent)" />
      <text x="25" y="119" fill="#082018" fontSize="6" fontWeight="700">Get started ↗</text>
      <g transform="translate(162 52)" stroke="#4c9c7e" strokeWidth="0.8">
        <path d="m4 18 28-16 28 16v36L32 70 4 54Z" fill="#18382e" />
        <path d="m4 18 28 16 28-16M32 34v36m-17-8V25L43 8m6 53V25L21 8" />
        <path d="m4 36 28 16 28-16" />
      </g>
    </g>
  );
}

export function FrontendIllustration() {
  return (
    <svg viewBox="0 0 360 230" fill="none" aria-hidden="true" focusable="false">
      <ellipse cx="175" cy="209" rx="146" ry="8" fill={material.deep} opacity="0.5" />
      <rect x="34" y="29" width="270" height="168" rx="10" fill={material.face} stroke={material.highlight} strokeWidth="1" />
      <rect x="39" y="33" width="260" height="160" rx="7" stroke={material.edge} />
      <circle cx="169" cy="36" r="1.5" fill="#667480" />
      <svg x="47" y="42" width="244" height="145" viewBox="0 0 244 145"><LandingScreen /></svg>
      <path d="M34 197h270l23 9c0 4-7 7-16 7H27c-9 0-16-3-16-7Z" fill={material.metal} stroke={material.highlight} strokeWidth="0.7" />
      <path d="M12 206h314" stroke="#74818a" strokeOpacity="0.6" />
      <path d="M141 197h57l-5 5h-47Z" fill={material.deep} />
      <g transform="translate(249 73) rotate(5 41 74)">
        <rect width="82" height="154" rx="13" fill={material.deep} stroke={material.highlight} strokeWidth="1.2" />
        <g transform="translate(6 8)"><LandingScreen mobile /></g>
        <rect x="28" y="5" width="26" height="5" rx="2.5" fill={material.deep} />
        <path d="M29 148h24" stroke="#7c8d98" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function DashboardPhone({ secondary = false }: { secondary?: boolean }) {
  return (
    <g>
      <rect width="106" height="196" rx="17" fill={material.deep} stroke={material.highlight} strokeWidth="1.2" />
      <rect x="5" y="5" width="96" height="186" rx="13" fill={material.face} stroke={material.edge} strokeWidth="0.6" />
      <text x="13" y="17" fill="#d3dde7" fontSize="4.5">9:41</text>
      <path d="M82 13h4m2 0h6" stroke="#bcc8d4" strokeWidth="2" />
      <rect x="39" y="7" width="28" height="6" rx="3" fill={material.deep} />
      <text x="13" y="35" fill="#8b9ead" fontSize="5">{secondary ? 'Your activity' : 'Your overview'}</text>
      <text x="13" y="49" fill="#edf3f7" fontSize="10" fontWeight="700">{secondary ? 'Activity' : 'Dashboard'}</text>
      <circle cx="86" cy="41" r="6" fill="#203e39" />
      <path d="M84 41h4m-2-2v4" stroke="#72d4a0" strokeWidth="0.8" />
      <rect x="12" y="61" width="82" height="68" rx="7" fill={material.plate} stroke={material.edge} strokeWidth="0.6" />
      <text x="19" y="73" fill="#95a9b8" fontSize="4.5">{secondary ? 'This week' : 'Total activity'}</text>
      <text x="19" y="88" fill="#f1f5f7" fontSize="12" fontWeight="700">{secondary ? '84%' : '2,840'}</text>
      <text x="64" y="87" fill="#5ce9a3" fontSize="4.5">↗ 12.8%</text>
      <path d="M19 118h67m-67-12h67m-67-12h67" stroke="#263d47" strokeWidth="0.5" />
      {secondary ? [10, 18, 14, 23, 19, 27, 25].map((height, index) => (
        <rect key={index} x={21 + index * 9} y={121 - height} width="5" height={height} rx="1.5" fill={index > 3 ? 'var(--accent)' : '#2e7560'} />
      )) : <><path d="m19 116 9-5 8 2 10-12 8 3 10-8 9 2 13-7v30H19Z" fill="var(--accent)" fillOpacity="0.07" /><path d="m19 116 9-5 8 2 10-12 8 3 10-8 9 2 13-7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>}
      <text x="13" y="142" fill="#c5d1da" fontSize="5" fontWeight="600">Recent activity</text>
      {[0, 1].map(i => <g key={i} transform={`translate(13 ${149 + i * 15})`}><rect width="10" height="10" rx="3" fill="#1e3935" /><path d="m3 5 2 2 3-4" stroke="#64c99a" strokeWidth="0.7" /><path d="M15 3h30m-30 4h19" stroke="#708695" strokeWidth="1.1" /><path d="M62 5h15" stroke="#9caeb9" strokeWidth="1.1" /></g>)}
      <path d="M40 185h26" stroke="#a0aeb9" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function MobileIllustration() {
  return (
    <svg viewBox="0 0 360 230" fill="none" aria-hidden="true" focusable="false">
      <ellipse cx="182" cy="216" rx="107" ry="8" fill={material.deep} opacity="0.5" />
      <g transform="translate(79 13) rotate(-10 53 98)"><DashboardPhone secondary /></g>
      <g transform="translate(176 25) rotate(9 53 98)"><DashboardPhone /></g>
    </svg>
  );
}
