//parsing tag's text
var parseTagText = function (textToParse) {
	//deleting spaces
	//to lower
	return textToParse.replace(/\s/g,'').toLowerCase();
}
exports.parseTagText = parseTagText;

//returns the correct tag format
exports.parseTag = function(tagToParse) {
  return {
    original: tagToParse.text, //setting original to retrieved keyword's text
    parsed: parseTagText(tagToParse.text), //parsing original text
    relevance: tagToParse.relevance //setting relevance to retrieved relevance
  }
}

//sorting tag using 'parsed' attribute
exports.sortTagByParsed = function(a, b) {
	if (a.parsed > b.parsed)
		return 1;
	if (a.parsed < b.parsed)
		return -1;
	return 0;
}
