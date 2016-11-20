/// <reference path="view_constants.ts" />
/// <reference path="../tools/jquery.d.ts" />

class WelcomePage
{
	Hide = () =>
	{
		let welcomePage = $(WELCOME_PAGE)
		if (welcomePage)
		{
			welcomePage.remove()
		}
	}
}