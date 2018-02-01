/// <reference path="../jquery/jquery.d.ts"/>



declare namespace EasyAutocomplete
{
	interface IAnimation
	{
		type?:string;
		time?:number;
		callback?:() => void;
	}

	interface IMatch
	{
		enabled?:boolean;
		caseSensitive?:boolean;
		method?:(element:any, phrase:RegExp) => boolean;
	}

	interface IList
	{
		sort?: (a:any, b:any) => number;
		maxNumberOfElements?:number,
		hideOnEmptyPhrase?:boolean;
		match?:IMatch;
		showAnimation?:IAnimation;
		hideAnimation?:IAnimation;
		onClickEvent?:() => void;
		onSelectItemEvent?:() => void;
		onLoadEvent?:() => void;
		onChooseEvent?:() => void;
		onKeyEnterEvent?:() => void;
		onMouseOverEvent?:() => void;
		onMouseOutEvent?:() => void;
		onShowListEvent?:() => void;
		onHideListEvent?:() => void;
	}

	interface ITemplate
	{
		type:string
		method?: (value:string, item:any) => string;
	}


	interface IOptions
	{
		data?:any;
		dataType?:string;
		url?:string|Function;
		listLocation?:(data:any) => any[]
		xmlElementName?:string;
		getValue?:any;
		autocompleteOff?:boolean;
		placeholder?:string|boolean;
		ajaxCallback?:() => void;
		matchResponseProperty?:boolean;
		list?:IList;
		highlightPhrase?:boolean;
		theme?:string;
		cssClasses?:string;
		minCharNumber?:number;
		requestDelay?:number;
		adjustWidth?:boolean;
		ajaxSettings?:any;
		preparePostData?:(data:any, inputPhrase:RegExp) => any;
		loggerEnabled?:boolean;
		template?:ITemplate;
		categories?:any[];
	}
}
interface JQuery
{
	easyAutocomplete(options?:EasyAutocomplete.IOptions):JQuery;
	getSelectedItemIndex():number;
	getSelectedItemData():number|any;
	getItems():number|any[];
	getItemData():number|any;
}
