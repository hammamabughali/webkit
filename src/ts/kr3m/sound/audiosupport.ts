module kr3m.sound
{
	export enum AudioSupport
	{
		NONE, // im aktuellen Browser ist überhaupt keine Art der Soundwiedergabe möglich
		AUDIO_TAG, // das HTML-Audio-Tag kann verwendet werden
		WEB_AUDIO_API // die Web Audio API ist verfügbar
	}
}
