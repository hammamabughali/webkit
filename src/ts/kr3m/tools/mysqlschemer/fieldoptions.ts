module kr3m.tools.mysqlschemer
{
	export interface FieldOptions
	{
		comment?:string;
		oldNames?:string[];
	}



	export interface StringOptions extends FieldOptions
	{
		maxLength?:number;
		defaultValue?:string;
	}



	export interface NumberOptions extends FieldOptions
	{
		unsigned?:boolean;
		float?:boolean;
		big?:boolean;
		defaultValue?:number;
	}



	export interface BooleanOptions extends FieldOptions
	{
		defaultValue?:boolean;
	}



	export interface DateOptions extends FieldOptions
	{
		onUpdateCurrent?:boolean;
		defaultValue?:string;
	}



	export interface EnumOptions extends FieldOptions
	{
		values:string[];
		defaultValue?:string;
	}



	export interface SetOptions extends FieldOptions
	{
		values:string[];
		defaultValues?:string[];
	}
}
