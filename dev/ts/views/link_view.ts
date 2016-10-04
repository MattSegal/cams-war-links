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
		$('.linkList').append(Mustache.render($('#linkTemplate').html(),link));

		// Cache the DOM for this link.
		this.link    		= $('#link'+this.linkId);
		this.deleteButton 	= this.link.find('.linkDelete')
		this.editButton 	= this.link.find('.linkEdit')
		this.deleteForm		= this.link.find('.linkDeleteForm')
		this.editForm 		= this.link.find('.linkEditForm')
		this.editTitle 		= this.editForm.find('.title')
		this.editUrl 		= this.editForm.find('.url')
		this.hyperlink 		= this.link.find('a');

		// Bind events.
		this.link.on('mouseenter mouseleave',this.RenderLinkHover);
		
		// Edit link events.	
		let publishEditButtonPress = () => observer.EmitEvent(Events.EditLinkButtonPress,this.linkId)
		this.editButton.on('click',publishEditButtonPress);  		

		let publishEditCancelPress = () => observer.EmitEvent(Events.CancelEditLinkButtonPress,this.linkId)
		this.editForm.find('.cancel').on('click',publishEditCancelPress);

		let publishEditConfirmPress = () => observer.EmitEvent(Events.ConfirmEditLinkButtonPress, {
			url 	: this.editUrl.val(),
			title 	: this.editTitle.val(),
			linkId 	: this.linkId
		})
		this.editForm.find('.submit').on('click',publishEditConfirmPress)
		this.editTitle.on('keypress',(e) => OnEnterPress(e,publishEditConfirmPress)); 
		this.editUrl.on('keypress',(e) => OnEnterPress(e,publishEditConfirmPress)); 
		
		// Delete link events
		let publishDeleteButtonPress = () => observer.EmitEvent(Events.DeleteLinkButtonPress,this.linkId)
		this.deleteButton.on('click',publishDeleteButtonPress)	

		let publishDeleteCancelPress = () => observer.EmitEvent(Events.CancelDeleteLinkButtonPress,this.linkId)
		this.deleteForm.find('.cancel').on('click',publishDeleteCancelPress); 

		let publishDeleteConfimPress = () => observer.EmitEvent(Events.ConfirmDeleteLinkButtonPress,this.linkId)
		this.deleteForm.find('.delete').on('click',publishDeleteConfimPress); 
	}

	private DestroyLink = () => 
	{
		// unsub and stop listening to events
		this.link.remove()
	}

	UpdateHyperLink = (link:Link) => 
	{
		this.hyperlink.attr('href',link.url);
		this.hyperlink.html(link.title);
	}

	RenderEditForm = () => 
	{
		this.link.addClass('active')
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
		this.link.removeClass('active')
 		if (fastHide)
 		{
			this.editForm.hide()
			this.FixHoverBug(true)
		} 
		else 
		{
			this.editForm.slideUp(300)
			this.FixHoverBug(false)
		}
		this.FixHoverBug(false)
	}

	RenderDeleteForm = () => 
	{
		this.link.addClass('active')
		this.deleteForm.slideDown(200);
	}
	
	CancelDeleteForm = (fastHide:boolean) => 
	{
		this.link.removeClass('active')
		if (fastHide) {
			this.deleteForm.hide();
			this.FixHoverBug(true)
		} else {
			this.deleteForm.slideUp(300)
			this.FixHoverBug(false)
		}
	}

	RenderDelete = () => 
	{
		this.link.fadeOut(300,this.DestroyLink);
	}

	
	// TODO - REPLACE WITH CSS
	private RenderLinkHover = () => 
	{
		// if link is being edited, dont remove hover
		if (this.link.hasClass('active')) {return}
		// reveals edit and delete buttons when a link is mousehovered
		if (this.link.hasClass('hover')) {
			this.link.removeClass('hover')
			this.deleteButton.removeClass('hover')
			this.editButton.removeClass('hover')
		} else {
			this.link.addClass('hover')
			this.deleteButton.addClass('hover')
			this.editButton.addClass('hover')
		}
	}

	private FixHoverBug = (fastHide:boolean) => 
	{
		// try to stop perma hover bug
		var delay = fastHide ? 0 : 302
		setTimeout( () =>
		{ 
			if(this.link.hasClass('hover') && !this.link.is(":hover")) 
			{
				this.RenderLinkHover.call(this.link);
			}
		},delay)
	}
}