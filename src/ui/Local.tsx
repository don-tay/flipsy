import { useEffect, useState } from 'react';
import { Session, type SessionView } from '../engine/session';
import type { Settings } from '../lib/storage';
import { getTheme } from '../themes';
import { GameScreen } from './GameScreen';
import { useApplyTheme } from './useTheme';

export function Local({ settings, onToggleMute, onLeave }: { settings: Settings; onToggleMute: () => void; onLeave: () => void }) {
  const [session] = useState(() => {
    const s = new Session(
      {
        themeId: settings.themeId,
        timerSec: settings.timerOn ? settings.timerSec : null,
        names: [settings.nick.trim() || 'Player 1', settings.nick2.trim() || 'Player 2'],
      },
      true,
    );
    s.startGame();
    return s;
  });
  const [view, setView] = useState<SessionView>(() => session.view());
  useApplyTheme(getTheme(session.config.themeId));

  useEffect(() => {
    const unsubscribe = session.subscribe(() => setView(session.view()));
    return () => {
      unsubscribe();
      session.dispose();
    };
  }, [session]);

  return (
    <GameScreen
      view={view}
      mySeat={null}
      online={false}
      muted={settings.muted}
      onToggleMute={onToggleMute}
      onFlip={(i) => session.flip(session.game?.turn ?? 0, i)}
      onRematch={() => session.requestRematch(0)}
      onLeave={onLeave}
    />
  );
}
