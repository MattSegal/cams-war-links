function OnEnterPress(event,fn) 
{
	// check for enter in a keypress event
	if (event.keyCode == 13) {
		fn()
	}
}	

function CheckIsEmpty(str) 
{
  	return str.replace(/^\s+|\s+$/g, '').length == 0;
}

function RemoveWhitespace(str) 
{
	return str.replace(/\s+/g, '')
}

function ParseURL(rawLinkText) 
{
	// correctly formats http for newly added links
	if (rawLinkText.slice(0,7) === 'http://') {
		return rawLinkText
	} else if (rawLinkText.slice(0,8) === 'https://') {
		return 'http://'+rawLinkText.slice(8)
	} else {
		return 'http://'+rawLinkText
	}
}