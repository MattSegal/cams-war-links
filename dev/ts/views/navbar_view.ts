/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
/// <reference path="../models/model.ts" />

class UserNavbarView 
{
	template:string
	navbar:JQuery
	editButton:JQuery
	publishNavigateLinksFactory: Function

	constructor(observer:Observer)
	{
		this.template = $('#userListTemplate').html();
	
		// Cache the DOM
		this.navbar 			= $('.userNav')
		this.editButton 		= $('.editUsersButton')

		// bind events
		let publishUserPageNavigate = () => observer.EmitEvent(Events.NavigateUserPage,{})
		this.editButton.on('click',publishUserPageNavigate)

		this.publishNavigateLinksFactory = (user) => 
		{
			return () => observer.EmitEvent(Events.NavigateLinks,user)
		}
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
		$('#select'+user.name).on('click', publishNavigateLinks)
	}

	RemoveUser = (user:User) => 
	{ 
		this.navbar.find('#select'+user.name).slideUp(300)
		let removeUser = () => this.navbar.find('#select'+user.name).remove()
		setTimeout(removeUser,300)
	}
	
	private RenderUser = (user:User) => 
	{
		let html = Mustache.render(this.template,{name:user.name})
		this.navbar.find('ul').append(html);
	}
}