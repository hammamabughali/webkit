interface RetinaJSOptions
{
	retinaImageSuffix?:string;
	check_mime_type?:boolean;
	force_original_dimensions?:boolean;
}


declare interface Retina
{
	configure(options:RetinaJSOptions):void;
	init(context:any);
	isRetina():boolean;
}


declare class RetinaImage
{
	constructor(element:HTMLImageElement);
	swap(path:string);
}
