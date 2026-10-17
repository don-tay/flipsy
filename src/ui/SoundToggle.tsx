export function SoundToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="btn small" onClick={onToggle} aria-pressed={muted} aria-label={muted ? 'Unmute sound' : 'Mute sound'}>
      {muted ? '🔇 Muted' : '🔊 Sound'}
    </button>
  );
}
