function OnEnterPress(event,fn:Function) 
{
	// check for enter in a keypress event
	if (event.keyCode == 13) {
		fn()
	}
}	

function CheckIsEmpty(str:string) 
{
  	return str.replace(/^\s+|\s+$/g, '').length == 0;
}

function RemoveWhitespace(str:string) 
{
	return str.replace(/\s+/g, '')
}

function ParseURL(rawLinkText:string) 
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