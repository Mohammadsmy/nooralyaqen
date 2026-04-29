export default function GeometricPattern({ className = '' }) {
  return (
    <svg
      className={`opacity-10 dark:opacity-8 ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer octagon */}
      <polygon
        points="100,5 157,28 190,80 190,120 157,172 100,195 43,172 10,120 10,80 43,28"
        stroke="currentColor" strokeWidth="1.5" fill="none"
      />
      {/* Star of David / Rub el Hizb inspired */}
      <polygon points="100,20 130,70 170,70 140,100 170,130 130,130 100,180 70,130 30,130 60,100 30,70 70,70"
        stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"
      />
      {/* Inner circle */}
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Center cross */}
      <line x1="100" y1="70" x2="100" y2="130" stroke="currentColor" strokeWidth="0.8" />
      <line x1="70" y1="100" x2="130" y2="100" stroke="currentColor" strokeWidth="0.8" />
      {/* Diagonal */}
      <line x1="79" y1="79" x2="121" y2="121" stroke="currentColor" strokeWidth="0.8" />
      <line x1="121" y1="79" x2="79" y2="121" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}
