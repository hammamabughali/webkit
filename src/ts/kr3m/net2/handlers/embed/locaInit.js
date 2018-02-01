function loc(id, tokens)
{
	var text = _locData[id] || "";
	if (tokens)
	{
		var parts = text.split("##");
		for (var i = 1; i < parts.length; i += 2)
			parts[i] = tokens[parts[i]] || "";
	}
	return text;
}
