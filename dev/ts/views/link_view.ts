/// <reference path="view_constants.ts" />
/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
/// <reference path="../models/model.ts" />

class LinkView
{
	linkId:number
	link:JQuery
	deleteButton:JQuery
	editButton:JQuery
	deleteForm:JQuery
	editForm:JQuery
	editTitle:JQuery
	editUrl:JQuery
	hyperlink:JQuery

	constructor(link:Link,observer:Observer) 
	{
		this.linkId = link.id

		// Render link.
		$(LINK_LIST).prepend(Mustache.render($(LINK_TEMPLATE).html(),link));

		// Cache the DOM for this link.
		this.link    		= $('#link'+this.linkId);
		this.deleteButton 	= this.link.find(LINK_DELETE_BUTTON)
		this.editButton 	= this.link.find(LINK_EDIT_BUTTON)
		this.deleteForm		= this.link.find(LINK_DELETE_FORM)
		this.editForm 		= this.link.find(LINK_EDIT_FORM)
		this.editTitle 		= this.editForm.find(LINK_EDIT_TITLE)
		this.editUrl 		= this.editForm.find(LINK_EDIT_URL)
		this.hyperlink 		= this.link.find(LINK_HYPERLINK)

		// Bind events.		
		// Edit link events.	
		let publishEditButtonPress = () => observer.EmitEvent(Events.EditLinkButtonPress,this.linkId)
		this.editButton.on('click',publishEditButtonPress);  		

		let publishEditCancelPress = () => observer.EmitEvent(Events.CancelEditLinkButtonPress,this.linkId)
		this.editForm.find(CANCEL_LINK_EDIT_BUTTON).on('click',publishEditCancelPress);

		let publishEditConfirmPress = () => observer.EmitEvent(Events.ConfirmEditLinkButtonPress, {
			url 	: this.editUrl.val(),
			title 	: this.editTitle.val(),
			linkId 	: this.linkId
		})
		this.editForm.find(CONFIRM_LINK_EDIT_BUTTON).on('click',publishEditConfirmPress)
		this.editTitle.on('keypress',(e) => OnEnterPress(e,publishEditConfirmPress)); 
		this.editUrl.on('keypress',(e) => OnEnterPress(e,publishEditConfirmPress)); 
		
		// Delete link events
		let publishDeleteButtonPress = () => observer.EmitEvent(Events.DeleteLinkButtonPress,this.linkId)
		this.deleteButton.on('click',publishDeleteButtonPress)	

		let publishDeleteCancelPress = () => observer.EmitEvent(Events.CancelDeleteLinkButtonPress,this.linkId)
		this.deleteForm.find(CANCEL_LINK_DELETE_BUTTON).on('click',publishDeleteCancelPress); 

		let publishDeleteConfimPress = () => observer.EmitEvent(Events.ConfirmDeleteLinkButtonPress,this.linkId)
		this.deleteForm.find(CONFIRM_LINK_DELETE_BUTTON).on('click',publishDeleteConfimPress); 
	}

	private DestroyLink = () => 
	{
		// TODO: unsub and stop listening to events
		this.link.remove()
	}

	UpdateHyperLink = (link:Link) => 
	{
		this.hyperlink.attr('href',link.url);
		this.hyperlink.html(link.title);
	}

	RenderEditForm = () => 
	{
		this.SetLinkActive()
		this.editUrl.val(this.hyperlink.attr('href'))
		this.editTitle.val(this.hyperlink.html())
		this.editForm.slideDown(200);
	}

	CloseAllForms = () =>
	{
		this.CancelEditForm(true)
		this.CancelDeleteForm(true)
	}

	CancelEditForm = (fastHide:boolean) => 
	{
		this.SetLinkInactive()
 		if (fastHide)
 		{
			this.editForm.hide()
		} 
		else 
		{
			this.editForm.slideUp(300)
		}
	}

	RenderDeleteForm = () => 
	{
		this.SetLinkActive()
		this.deleteForm.slideDown(200);
	}
	
	CancelDeleteForm = (fastHide:boolean) => 
	{
		this.SetLinkInactive()
		if (fastHide) 
		{
			this.deleteForm.hide();
		} 
		else 
		{
			this.deleteForm.slideUp(300)
		}
	}

	RenderDelete = () => 
	{
		this.link.fadeOut(300,this.DestroyLink);
	}

	private SetLinkActive = () => 
	{
		this.link.addClass('active-link')
	}

	private SetLinkInactive = () => 
	{
		if (this.link.hasClass('active-link')) 
		{
			this.link.removeClass('active-link')
		}
	}
}