/// <reference path="view_constants.ts" />
/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
/// <reference path="../models/model.ts" />

class UserView
{
	username:string
	template:string
	userElement : JQuery
	deleteButton : JQuery
	cancelDeleteButton : JQuery
	isDeleteFormOpen: boolean

	constructor(user:User,observer:Observer) 
	{
		this.username = user.name
		this.isDeleteFormOpen = false
		this.template  = $(USER_FORM_TEMPLATE).html();

		// Render user
		let userHtml = Mustache.render(this.template,{name:user.name})
		$(USER_PAGE).find('ul').append(userHtml);

		// Get DOM
		this.userElement = $('#edit'+user.name)
		this.deleteButton = $('#delete'+user.name)
		this.cancelDeleteButton = $('#cancel'+user.name)

		// Bind events
		let publishUserDeleteButtonPress = () => observer.EmitEvent(Events.DeleteUserButtonPress,user)
		this.deleteButton.on('click',publishUserDeleteButtonPress)
		this.cancelDeleteButton.on('click',this.CancelDeleteForm)
	}

	RenderDelete = () => 
	{
		this.userElement.slideUp(300)
		setTimeout( () => this.userElement.remove() ,300)
	}

	RenderDeleteForm = () => 
	{
		this.isDeleteFormOpen = true
		this.deleteButton.addClass('confirm-user-delete-button')
		this.cancelDeleteButton.animate({width:'show'},350);
	}
	
	CancelDeleteForm = () => 
	{
		this.isDeleteFormOpen = false
		this.deleteButton.removeClass('confirm-user-delete-button')
		this.deleteButton.on('click',this.RenderDeleteForm)
		this.cancelDeleteButton.animate({width:'hide'},350);
	}
}