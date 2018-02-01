/// <reference path="../types.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.util
{
	export class UserMedia
	{
		private static instance:UserMedia;



		public static getInstance():UserMedia
		{
			if (!UserMedia.instance)
				UserMedia.instance = new UserMedia();
			return UserMedia.instance;
		}



		public feedCameraIntoVideo(
			video:HTMLVideoElement,
			playAudio = false,
			callback?:SuccessCallback):void
		{
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
				return callback && callback(false);

			navigator.mediaDevices.getUserMedia({audio: playAudio, video: true}).then((stream:MediaStream) =>
			{
				video.srcObject = stream;
				video.play();
				callback && callback(true);
			}).catch((error:Error) =>
			{
				callback && callback(false);
			});
		}
	}
}
