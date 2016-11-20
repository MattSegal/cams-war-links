/// <reference path="../tools/observer.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../controllers/link_controller.ts" />
/// <reference path="../views/link_view.ts" />

class LinkEvents
{
	// Hash table of references to view-layer link objects
	linkViews : {[id:number] : LinkView;} = {}
	linkController : LinkController
	observer:Observer

	constructor(o:Observer,linkController:LinkController)
	{
		this.linkController = linkController

		o.AddEvent(Events.CreateLinkSuccess,this.NewLinkCreated)
		o.AddEvent(Events.EditLinkButtonPress,this.LinkEditSelected)
		o.AddEvent(Events.CancelEditLinkButtonPress,this.LinkEditCancelled)
		o.AddEvent(Events.ConfirmEditLinkButtonPress,this.LinkEditConfirmed)
		o.AddEvent(Events.DeleteLinkButtonPress,this.LinkDeleteSelected)
		o.AddEvent(Events.CancelDeleteLinkButtonPress,this.LinkDeleteCancelled)
		o.AddEvent(Events.ConfirmDeleteLinkButtonPress,this.LinkDeleteConfirmed)
		this.observer = o
	}

	NewLinkCreated = (newLink:Link) =>
	{
		this.linkViews[newLink.id] = new LinkView(newLink,this.observer)
	}

	LinkEditSelected = (linkId:number) =>
	{
		let linkView : LinkView = this.linkViews[linkId]
		
		let isALinkAlreadyOpen = this.linkController.CheckIsLinkDialogue()
		let isThisLinkBeingEdited = this.linkController.CheckIsLinkEditDialogue(linkId)
		
		if (isALinkAlreadyOpen && isThisLinkBeingEdited) 
		{
			linkView.CancelEditForm(false)
			this.linkController.SetNoLinkDialogue()
			this.observer.EmitEvent(Events.ExitLinkForm,{})
			return
		} 
		else if (isALinkAlreadyOpen)
		{
			let otherLinkId = this.linkController.GetCurrentLink()
			let otherLinkView = this.linkViews[otherLinkId]
			otherLinkView.CloseAllForms()
		}

		linkView.RenderEditForm()
		this.linkController.SetEditLinkDialogue(linkId)
		this.observer.EmitEvent(Events.OpenLinkForm,{})
	}

	LinkEditCancelled = (linkId:number) =>
	{
	 	this.linkController.SetNoLinkDialogue()
	 	let link = this.linkViews[linkId]
	 	link.CancelEditForm(false)
		this.observer.EmitEvent(Events.ExitLinkForm,{})
	}

	LinkEditConfirmed = (linkData) =>   
	{
		let updatedLink = new Link(linkData["url"],linkData["title"])
		updatedLink.id = linkData["linkId"]
		let linkView = this.linkViews[updatedLink.id]


		this.linkController.Update(updatedLink)
	 	.done( () =>
	 	{
			linkView.UpdateHyperLink(updatedLink)
		})

		this.linkController.SetNoLinkDialogue()
		linkView.CancelEditForm(false)
		this.observer.EmitEvent(Events.ExitLinkForm,{})
	}

	LinkDeleteSelected = (linkId:number) =>
	{
		let linkView : LinkView = this.linkViews[linkId]
		
		let isALinkAlreadyOpen = this.linkController.CheckIsLinkDialogue()
		let isThisLinkBeingDeleted = this.linkController.CheckIsLinkDeleteDialogue(linkId)
		
		if (isALinkAlreadyOpen && isThisLinkBeingDeleted) 
		{
			linkView.CancelDeleteForm(false)
			this.linkController.SetNoLinkDialogue()
			this.observer.EmitEvent(Events.ExitLinkForm,{})
			return
		} 
		else if (isALinkAlreadyOpen)
		{
			let otherLinkId = this.linkController.GetCurrentLink()
			let otherLinkView = this.linkViews[otherLinkId]
			otherLinkView.CloseAllForms()
		}

		linkView.RenderDeleteForm()
		this.linkController.SetDeleteLinkDialogue(linkId)
		this.observer.EmitEvent(Events.OpenLinkForm,{})
	}

	LinkDeleteCancelled = (linkId:number) => 
	{
	 	this.linkController.SetNoLinkDialogue()
	 	let linkView = this.linkViews[linkId]
	 	linkView.CancelDeleteForm(false)
	 	this.observer.EmitEvent(Events.ExitLinkForm,{})
	}

	LinkDeleteConfirmed = (linkId:number) => 
	{
	 	let linkView = this.linkViews[linkId]		 	
	 	this.linkController.Delete(linkId)
	 	.done(() =>
	 	{
	 		linkView.RenderDelete()
	 		delete this.linkViews[linkId]
	 	})
	 	.fail( () => 
	 	{
	 		linkView.CancelDeleteForm(false)
	 	})
	 	this.linkController.SetNoLinkDialogue()
	 	this.observer.EmitEvent(Events.ExitLinkForm,{})
	}
}