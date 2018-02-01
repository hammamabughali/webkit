module kr3m.model.mm
{
	export class Match
	{
		public score = -1; // Wie gut passt die Gruppe zusammen? Liegt zwischen 0 (so gut wie gar nicht) und 1 (passt perfekt).
		public complete = false; // Sind genug Spieler in der Gruppe um ein Spiel anzufangen?
		public invalid = false; // Ist die Zusammenstellung ungültig, so dass selbst weitere Spieler es nicht besser machen können?
		public full = false; // Hat die Gruppe das Maximum an erlaubten Spielern erreicht?
	}



	export class Setup
	{
		public tickets:number[] = [];
		public match:Match;
	}



	export type MatchingFunction<Player> = (players:Player[]) => Match;
}
