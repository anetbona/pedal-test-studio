// Odtwarzacz nagrań (U3/U4): natychmiastowy start, pauza/wznowienie,
// płynne przełączanie między nagraniami bez przeładowania strony.

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
      audio.addEventListener('ended', () => {
        if (this.currentId === rec.id) this._emit(rec.id, false);
      });
      this.audios.set(rec.id, audio);
    }
  }

  /**
   * Klik w nagranie. Zwraca 'started' gdy nagranie ruszyło od początku
   * (wtedy zliczamy odtworzenie), 'resumed' lub 'paused' przy toggle.
   */
  toggle(recordingId) {
    const audio = this.audios.get(recordingId);
    if (!audio) return null;

    if (this.currentId === recordingId) {
      if (audio.paused) {
        if (audio.ended) audio.currentTime = 0;
        const fresh = audio.ended || audio.currentTime === 0;
        audio.play();
        this._emit(recordingId, true);
        return fresh ? 'started' : 'resumed';
      }
      audio.pause();
      this._emit(recordingId, false);
      return 'paused';
    }

    // przełączenie na inne nagranie
    if (this.currentId) {
      const prev = this.audios.get(this.currentId);
      if (prev) { prev.pause(); prev.currentTime = 0; }
    }
    this.currentId = recordingId;
    audio.currentTime = 0;
    audio.play();
    this._emit(recordingId, true);
    return 'started';
  }

  /**
   * Przełączenie na inne nagranie z zachowaniem pozycji odtwarzania —
   * jeśli riff właśnie gra, nowe ustawienie gra dalej od tego samego miejsca
   * (wszystkie nagrania kostki to ten sam riff o tej samej długości).
   * Zwraca 'started' gdy rozpoczęto odtwarzanie (do zliczania), inaczej 'selected'.
   */
  switchTo(recordingId) {
    const audio = this.audios.get(recordingId);
    if (!audio) return null;

    if (this.currentId === recordingId) {
      if (audio.paused) {
        if (audio.ended) audio.currentTime = 0;
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
        wasPlaying = !prev.paused && !prev.ended;
        pos = prev.ended ? 0 : prev.currentTime;
        prev.pause();
        prev.currentTime = 0;
      }
    }
    this.currentId = recordingId;
    audio.currentTime = wasPlaying ? pos : 0;
    audio.play();
    this._emit(recordingId, true);
    return 'started';
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
