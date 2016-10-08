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
		this.template  = $('#editUserTemplate').html();

		// Render user
		let userHtml = Mustache.render(this.template,{name:user.name})
		$('.editScreen').find('ul').append(userHtml);

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
		this.deleteButton.addClass('deleteConfirm')
		this.cancelDeleteButton.animate({width:'show'},350);
	}
	
	CancelDeleteForm = () => 
	{
		this.isDeleteFormOpen = false
		this.deleteButton.removeClass('deleteConfirm')
		this.deleteButton.on('click',this.RenderDeleteForm)
		this.cancelDeleteButton.animate({width:'hide'},350);
	}
}