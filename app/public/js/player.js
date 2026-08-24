// Odtwarzacz nagrań (U3/U4): natychmiastowy start, zapętlone odtwarzanie,
// płynne przełączanie ustawień bez przerywania dźwięku.
//
// Wszystkie nagrania kostki to ten sam riff o tej samej długości, więc zmiana
// ustawienia gałek przenosi odtwarzanie na inne nagranie OD TEJ SAMEJ POZYCJI —
// user kręci gałkami i słyszy, jak brzmienie zmienia się w locie.

export class Player {
  constructor() {
    this.audios = new Map(); // recordingId -> HTMLAudioElement
    this.currentId = null;
    this.onStateChange = null; // (recordingId|null, isPlaying) => void
  }

  // Preload wszystkich nagrań kostki — przełączanie bez czekania
  load(recordings) {
    this.stop();
    this.audios.clear();
    for (const rec of recordings) {
      const audio = new Audio(rec.file);
      audio.preload = 'auto';
      audio.loop = true; // riff gra w kółko, dopóki user nie zatrzyma
      this.audios.set(rec.id, audio);
    }
  }

  get isPlaying() {
    const audio = this.currentId ? this.audios.get(this.currentId) : null;
    return !!audio && !audio.paused;
  }

  /**
   * Przełącza na wskazane nagranie z zachowaniem pozycji odtwarzania.
   * Gdy riff gra — nowe ustawienie gra dalej od tego samego miejsca.
   * Gdy nic nie gra — tylko wybiera nagranie (bez wymuszania dźwięku),
   * chyba że autoplay = true.
   * Zwraca 'started' gdy dźwięk ruszył (do zliczenia odtworzenia), inaczej 'selected'.
   */
  switchTo(recordingId, { autoplay = true } = {}) {
    const audio = this.audios.get(recordingId);
    if (!audio) return null;

    if (this.currentId === recordingId) {
      if (audio.paused && autoplay) {
        audio.play();
        this._emit(recordingId, true);
        return 'started';
      }
      return 'selected';
    }

    let pos = 0;
    let wasPlaying = false;
    if (this.currentId) {
      const prev = this.audios.get(this.currentId);
      if (prev) {
        wasPlaying = !prev.paused;
        pos = prev.currentTime;
        prev.pause();
        prev.currentTime = 0;
      }
    }
    this.currentId = recordingId;
    audio.currentTime = wasPlaying ? pos : 0;

    if (wasPlaying || autoplay) {
      audio.play();
      this._emit(recordingId, true);
      return 'started';
    }
    this._emit(recordingId, false);
    return 'selected';
  }

  /** Przycisk transportu: pauza albo wznowienie bieżącego nagrania. */
  toggle(recordingId = this.currentId) {
    if (!recordingId) return null;
    const audio = this.audios.get(recordingId);
    if (!audio) return null;

    if (this.currentId === recordingId && !audio.paused) {
      audio.pause();
      this._emit(recordingId, false);
      return 'paused';
    }
    return this.switchTo(recordingId, { autoplay: true });
  }

  stop() {
    if (this.currentId) {
      const audio = this.audios.get(this.currentId);
      if (audio) { audio.pause(); audio.currentTime = 0; }
      this._emit(null, false);
      this.currentId = null;
    }
  }

  _emit(recordingId, isPlaying) {
    if (this.onStateChange) this.onStateChange(recordingId, isPlaying);
  }
}
