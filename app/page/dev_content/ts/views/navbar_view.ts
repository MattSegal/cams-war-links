/// <reference path="view_constants.ts" />
/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
/// <reference path="../models/model.ts" />

class UserNavbarView 
{
	template:string
	navbar:JQuery
	editButton:JQuery
	userList:JQuery
	publishNavigateLinksFactory: Function

	constructor(observer:Observer)
	{
		this.template = $(NAVBAR_USER_TEMPLATE).html();
	
		// Cache the DOM
		this.navbar 			= $(USER_NAVBAR)
		this.userList 			= $(NAVBAR_USERS_LIST)
		this.editButton 		= $(EDIT_USERS_BUTTON)

		// Bind events
		let publishUserPageNavigate = () => observer.EmitEvent(Events.NavigateUserPage,{})
		this.editButton.on('click',publishUserPageNavigate)

		this.publishNavigateLinksFactory = (user) => 
		{
			return () => observer.EmitEvent(Events.NavigateLinks,user)
		}
	}

	GetUserSelector = (user:User) : JQuery =>
	{
		return this.navbar.find("#select"+user.name)
	}

	AddUsers = (users:Array<User>) =>
	{
		for (let user of users)
		{
			this.AddUser(user)
		}
	}

	AddUser = (user:User) => 
	{
		this.RenderUser(user)
		let publishNavigateLinks = this.publishNavigateLinksFactory(user)
		this.GetUserSelector(user).on('click', publishNavigateLinks)
	}

	RemoveUser = (user:User) => 
	{ 
		this.GetUserSelector(user).slideUp(300)
		let removeUser = () => this.GetUserSelector(user).remove()
		setTimeout(removeUser,300)
	}
	
	private RenderUser = (user:User) => 
	{
		let html = Mustache.render(this.template,{name:user.name})
		this.userList.append(html);
	}
}