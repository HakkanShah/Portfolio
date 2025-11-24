'use client';

/**
 * Sound utility for playing marimba notes
 * Uses Web Audio API to generate marimba-like tones
 */

class SoundPlayer {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3; // Master volume
            this.masterGain.connect(this.audioContext.destination);
        }
    }

    /**
     * Play a marimba note
     * @param frequency - The frequency of the note in Hz
     * @param duration - Duration of the note in seconds
     */
    playNote(frequency: number, duration: number = 0.3) {
        if (!this.audioContext || !this.masterGain) return;

        const now = this.audioContext.currentTime;

        // Create oscillator for the fundamental frequency
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);

        // Create oscillator for the harmonic (gives marimba-like timbre)
        const harmonic = this.audioContext.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(frequency * 2, now);

        // Create gain nodes for envelope
        const gainNode = this.audioContext.createGain();
        const harmonicGain = this.audioContext.createGain();

        // Marimba-like envelope (quick attack, medium decay)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01); // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        harmonicGain.gain.setValueAtTime(0, now);
        harmonicGain.gain.linearRampToValueAtTime(0.2, now + 0.01);
        harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.5);

        // Connect the audio graph
        oscillator.connect(gainNode);
        harmonic.connect(harmonicGain);
        gainNode.connect(this.masterGain);
        harmonicGain.connect(this.masterGain);

        // Start and stop
        oscillator.start(now);
        harmonic.start(now);
        oscillator.stop(now + duration);
        harmonic.stop(now + duration);
    }

    /**
     * Get a note frequency from a scale
     * @param index - Index in the scale (0-based)
     */
    getNoteFrequency(index: number): number {
        // Pentatonic scale starting from C4 (261.63 Hz)
        // This creates a pleasant, harmonious sound
        const pentatonicScale = [
            261.63, // C4
            293.66, // D4
            329.63, // E4
            392.00, // G4
            440.00, // A4
            523.25, // C5
            587.33, // D5
            659.25, // E5
            783.99, // G5
            880.00, // A5
        ];

        return pentatonicScale[index % pentatonicScale.length];
    }
}

// Singleton instance
let soundPlayer: SoundPlayer | null = null;

export const getSoundPlayer = (): SoundPlayer => {
    if (!soundPlayer) {
        soundPlayer = new SoundPlayer();
    }
    return soundPlayer;
};

export const playSkillSound = (index: number) => {
    const player = getSoundPlayer();
    const frequency = player.getNoteFrequency(index);
    player.playNote(frequency, 0.4);
};
