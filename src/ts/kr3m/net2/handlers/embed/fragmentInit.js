function fragment(fragmentPath, params)
{
	var html = "<fragment";
	if (params)
	{
		for (var name in params)
			html += " " + name + "=\"" + params[name] + "\"";
	}
	html += ">" + fragmentPath + "</fragment>";
	echo(html);
}
