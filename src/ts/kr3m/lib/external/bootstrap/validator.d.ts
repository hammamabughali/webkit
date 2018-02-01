interface ValidatorOptions
{
	delay?:number;
	html?:boolean;
	disable?:boolean;
	focus?:boolean;
	feedback?:ValidatorOptionsFeedback;
	custom?:{ [key:string]:Function };
	errors?:{ [key:string]:string };
}

interface ValidatorOptionsFeedback
{
	success?:string;
	error?:string;
}

interface JQuery
{
	validator(options?:ValidatorOptions):JQuery;
	validator(command:string):JQuery;
}
