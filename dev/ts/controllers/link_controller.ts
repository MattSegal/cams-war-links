/// <reference path="../tools/observer.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../data/links_repository.ts" />

class LinkController
{
	linksRepository = new LinksRepository()
	linkModel 		= new LinkModel()
	observer:Observer

	constructor(observer:Observer)
	{
		this.observer = observer
	}

	Get(user:User)
	{
		return this.linkModel.GetUserLinks(user)
	}

	Load() 
	{
		let linkStore = this.linkModel.links
		this.linksRepository.GetAll()
		.done((links) => 
		{
			console.log('link GET - success')
			for (let link of links)
			{
				linkStore[link.id] = link
			}
		})
		.fail(() => 
		{
			console.log('link GET - failure')
		});	
	}

	Create(newLink:Link) 
	{
		if (CheckIsEmpty(newLink.url) || CheckIsEmpty(newLink.user)) 
		{
			console.log('Invalid fields for new link')
			this.observer.EmitEvent(Events.CreateLinkFailure,{})
			return
		}

		newLink.url 	= ParseURL(newLink.url)
		newLink.title 	= CheckIsEmpty(newLink.title) ? newLink.url.slice(7) : newLink.title

		this.linksRepository.Create(newLink)
		.done( link_id => 
		{
			console.log('Link POST - Success')
			newLink.id = parseInt(link_id,10)
			this.linkModel.links[newLink.id] = newLink
			console.log(newLink)
			this.observer.EmitEvent(Events.CreateLinkSuccess,newLink)
		})
		.fail( (xhr, status, error) => {
			console.log('Link POST - Failure with status '+status)
			console.log(error)
			this.observer.EmitEvent(Events.CreateLinkFailure,{})
		});
	}

	Update(newLink:Link) : boolean
	{
		let success = false
	 	if (!CheckIsEmpty(newLink.title) && !CheckIsEmpty(newLink.url)) 
	 	{
			newLink.url = ParseURL(newLink.url);
			this.linksRepository.Update(newLink);
			// TODO: Action on error/success
			this.linkModel.links[newLink.id] = newLink
			success = true
		}
		return success
	}

	Delete(id) : boolean
	{
		let success= false;
	 	this.linksRepository.Delete(id)
	 	.done(() => {
	 		success = true
	 		delete this.linkModel.links[id]
	 	})
	 	.fail(() => {

	 	})
	 	return success
	}

	GetCurrentLink()
	{
		return this.linkModel.currentLinkId
	}
	CheckIsCurrentLink(linkId:number) : boolean
	{
		return this.linkModel.currentLinkId === linkId
	}

	CheckIsLinkDialogue()
	{
		return this.linkModel.state != LinkEditState.None
	}

	CheckIsLinkEditDialogue(linkId:number)
	{
		return this.linkModel.currentLinkId === linkId && this.linkModel.state === LinkEditState.Edit
	}

	CheckIsLinkDeleteDialogue(linkId:number)
	{
		return this.linkModel.currentLinkId === linkId && this.linkModel.state === LinkEditState.Delete
	}

	SetNoLinkDialogue()
	{
		this.linkModel.currentLinkId = -1
		this.linkModel.state = LinkEditState.None
	}

	SetEditLinkDialogue(linkId:number)
	{
		this.linkModel.currentLinkId = linkId
		this.linkModel.state = LinkEditState.Edit
	}

	SetDeleteLinkDialogue(linkId:number)
	{
		this.linkModel.currentLinkId = linkId
		this.linkModel.state = LinkEditState.Delete
	}
}