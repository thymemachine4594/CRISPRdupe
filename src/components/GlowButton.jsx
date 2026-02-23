export default function GlowButton({ text, onClick }) {
  return (
    <button className="glow-btn" onClick={onClick}>
      {text}
    </button>
  )
}