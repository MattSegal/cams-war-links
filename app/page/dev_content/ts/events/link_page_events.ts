/// <reference path="../tools/observer.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../controllers/link_controller.ts" />
/// <reference path="../views/link_page_view.ts" />

class LinkPageEvents
{
	observer: Observer
	linkPage : LinkPage
	linkController : LinkController
	userController : UserController

	constructor(o:Observer,linkController:LinkController,userController:UserController)
	{
		this.linkController = linkController
		this.userController = userController
		this.linkPage = new LinkPage()

		o.AddEvent(Events.LinksLoaded,this.LinksLoaded)
		o.AddEvent(Events.NavigateLinks,this.NavigateLinkPage)
		o.AddEvent(Events.NavigateUserPage,this.PageExited)
		o.AddEvent(Events.ExitLinkForm,this.LinkEditFormClosed)
		o.AddEvent(Events.OpenLinkForm,this.LinkEditFormOpened)
		o.AddEvent(Events.CreateLinkSubmit,this.SubmitNewLink)
		this.observer = o
	}

	SubmitNewLink = (newLink:Link) =>
	{
		newLink.user = this.userController.GetCurrent().name
		this.linkController.Create(newLink)
		.done( () => this.observer.EmitEvent(Events.CreateLinkSuccess,newLink))
		.fail( () => this.observer.EmitEvent(Events.CreateLinkFailure,{}))
		this.linkPage.RenderNewLinkButton()
	}

	LinkEditFormOpened = () =>
	{
		this.linkPage.HideNewLinkElements()	
	}

	LinkEditFormClosed = () =>
	{
		this.linkPage.RenderNewLinkButton()
	}

	NavigateLinkPage = (user:User) =>
	{
		let currentUser = this.userController.GetCurrent()
		if (currentUser.name === user.name)  { return }

		this.userController.SetCurrent(user);
		this.linkPage.Hide()
		this.linkPage.Show(user.name,this.observer)

		// Populate page with links
		var userLinks : Array<Link> = this.linkController.Get(user)
		for (let link of userLinks)
		{
			this.observer.EmitEvent(Events.CreateLinkSuccess,link)
		}
	}

	LinksLoaded = () => 
	{
		let currentUser = this.userController.GetCurrent()
		if (currentUser.name === '')  { return }
			
		// Populate page with links
		var userLinks : Array<Link> = this.linkController.Get(currentUser)
		for (let link of userLinks)
		{
			this.observer.EmitEvent(Events.CreateLinkSuccess,link)
		}
	}

	PageExited = () =>
	{
		let nullUser = new User('')
		this.userController.SetCurrent(nullUser);
		this.linkPage.Hide()
	}
}
