/// <reference path="../tools/mustache.d.ts" />
/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
/// <reference path="../models/model.ts" />

class UserPage
{
	
	template:string
	page: JQuery
	addUserButton: JQuery
	confirmAddUserButton: JQuery
	usernameField: JQuery
	newUserForm: JQuery

	Show = (observer:Observer) => 
	{
		// Render the screen
		this.template = $('#editScreenTemplate').html();
		var pageHtml = Mustache.render(this.template,{})
		$('.userBox').append(pageHtml);

		// Cache the DOM
		this.page = $('.editScreen');
		this.addUserButton = $('.addUser')
		this.confirmAddUserButton = $('.add')
		this.usernameField = $('.name')
		this.newUserForm = $('.newUserForm')

		// Bind confirm add user event
		let publishAddUser = () => observer.EmitEvent(Events.CreateUserButtonPress,this.usernameField.val())
		this.confirmAddUserButton.on('click',publishAddUser)
		this.usernameField.on('keypress',(e) => { if (e.keyCode == 13) { publishAddUser() } })

		// Bind add user form event
		this.addUserButton.on('click', () => this.RenderNewUserForm()) 

		// Bind cancel add user event
		let cancelAddUserButton = $('.cancel')
		cancelAddUserButton.on('click',this.HideNewUserForm)
		
		// Show form
		this.page.fadeIn(600)	
	}

	IsInDOM = () => 
	{
		return this.page !== undefined && $(this.page.selector).length > 0
	}
	
	Hide = () =>
	{
		// TODO: ensure no memory leaks
		if (this.page)
		{
			this.page.remove()
		}
	}
	
	RenderNewUserForm = () =>
	{
		this.addUserButton.hide();
		// fade out all delete buttons and cancel buttons
		this.newUserForm.fadeIn(300);

		// TODO - this doesn't belong here
		setTimeout(()=>{
			$.each($('.delete'),(idx,val)=>{
				// set delete form back to initial state (no cancel buttons)
			})
		},300)
	}

	HideNewUserForm = () =>
	{
		this.newUserForm.hide();
		this.usernameField.val('');
		// fade in all delete buttons
		this.addUserButton.fadeIn(300)
	}
}

