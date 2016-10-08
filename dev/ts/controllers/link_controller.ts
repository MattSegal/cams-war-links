/// <reference path="../models/model.ts" />
/// <reference path="../data/links_repository.ts" />

class LinkController
{
	linksRepository = new LinksRepository()
	linkModel 		= new LinkModel()

	Get(user:User)
	{
		return this.linkModel.GetUserLinks(user)
	}

	Load() 
	{
		let linkStore = this.linkModel.links
		console.log('Link GET')
		this.linksRepository.GetAll()
		.done((links) => 
		{
			console.log('Success')
			for (let link of links)
			{
				linkStore[link.id] = link
			}
		})
		.fail( (response,status,error) => {
			console.log("Failure: "+response.status+' '+response.responseText)
		})
	}

	Create(newLink:Link) : JQueryPromise<any>
	{
		if (CheckIsEmpty(newLink.url) || CheckIsEmpty(newLink.user)) 
		{
			console.log('Invalid fields for new link')
			let deferred = jQuery.Deferred()
			deferred.reject()
			return deferred.promise()
		}

		newLink.url 	= ParseURL(newLink.url)
		newLink.title 	= CheckIsEmpty(newLink.title) ? newLink.url.slice(7) : newLink.title

		console.log('Link POST')
		return this.linksRepository.Create(newLink)
		.done( link_id => 
		{
			newLink.id = parseInt(link_id,10)
			this.linkModel.links[newLink.id] = newLink
			console.log('Success')
			console.log(newLink)
		})
		.fail( (response,status,error) => {
			console.log("Failure: "+response.status+' '+response.responseText)
		})
	}

	Update(newLink:Link) : JQueryPromise<any>
	{
	 	if (CheckIsEmpty(newLink.title) || CheckIsEmpty(newLink.url)) 
	 	{
			let deferred = jQuery.Deferred()
			deferred.reject()
			return deferred.promise()
		}
		
		console.log('Link PUT:')
		console.log(newLink)
		newLink.url = ParseURL(newLink.url);
		return this.linksRepository.Update(newLink)
		.done((response) =>
		{
			console.log('Success: '+response);
			this.linkModel.links[newLink.id] = newLink
		})
		.fail( (response,status,error) => {
			console.log("Failure: "+response.status+' '+response.responseText)
		})
	}

	Delete(id) : JQueryPromise<any>
	{
		console.log('Link DELETE:')

	 	return this.linksRepository.Delete(id)
	 	.done(() => 
	 	{
	 		console.log('Success')
	 		delete this.linkModel.links[id]
	 	})
	 	.fail( (response,status,error) => {
			console.log("Failure: "+response.status+' '+response.responseText)
		})
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