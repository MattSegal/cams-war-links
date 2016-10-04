/// <reference path="../tools/mustache.d.ts" />
/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
/// <reference path="../models/model.ts" />

class LinkPage
{
	template:string = $('#userBoxTemplate').html();
	page : JQuery
	newLinkButton : JQuery
	newLinkForm : JQuery		
	newLinkUrl : JQuery
	newLinkTitle : JQuery
	cancelNewLinkButton : JQuery
	confirmNewLinkButton : JQuery
	
	Show = (username:string,o:Observer) => 
	{
		// Render user's links page
		$('.userBox').append(Mustache.render(this.template,{name:username}));
		
		// cache the DOM
		this.page 					= $('#'+username)
		this.newLinkButton 			= $('.newItemButton');
		this.newLinkForm  			= $('.newItemForm');
		this.newLinkUrl  			= this.newLinkForm.find('.url');
		this.newLinkTitle  			= this.newLinkForm.find('.title');
		this.cancelNewLinkButton 	= this.newLinkForm.find('.cancel');
		this.confirmNewLinkButton 	= this.newLinkForm.find('.submit');

		// Bind form navigation events
		this.newLinkButton.on('click',this.RenderNewLinkForm)
		this.cancelNewLinkButton.on('click',this.RenderNewLinkButton);

		// Bind submit new link event
		let submitNewLink = () => {
			let newLink = new Link(this.newLinkUrl.val(),this.newLinkTitle.val())
			o.EmitEvent(Events.CreateLinkSuccess, newLink)
		}

		this.confirmNewLinkButton.on('click',submitNewLink);
		this.newLinkUrl.on('keypress',(e)=>OnEnterPress(e,submitNewLink));
		this.newLinkTitle.on('keypress',(e)=>OnEnterPress(e,submitNewLink));

		// Render page
		this.page.fadeIn(400)
	}

	Hide = () => 
	{
		// TODO: Unbind events so we don't get memory leaks
		if (this.page)
		{
			this.page.remove()
		}
	}
	
	RenderNewLinkForm = () => 
	{
		this.newLinkButton.hide();
		this.newLinkForm.slideDown(200);
	}

	RenderNewLinkButton = () => 
	{
		this.HideNewLinkForm()
		this.newLinkButton.fadeIn(300)
	}

	HideNewLinkElements = () => 
	{
		this.newLinkButton.hide();
		this.HideNewLinkForm()
	}
	
	private HideNewLinkForm = () => 
	{
		this.newLinkUrl.val('')
		this.newLinkTitle.val('')
		this.newLinkForm.hide();
	}
}


