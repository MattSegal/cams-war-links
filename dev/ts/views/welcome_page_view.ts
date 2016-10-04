/// <reference path="../tools/jquery.d.ts" />

class WelcomePage
{
	template:string

	constructor()
	{
		this.template = $('#welcomeTemplate').html()
	}

	Show = () =>
	{
		$('.userBox').append(this.template)
	}

	Hide = () =>
	{
		let welcomePage = $('#welcomeUser')
		if (welcomePage)
		{
			welcomePage.remove()
		}
	}
}