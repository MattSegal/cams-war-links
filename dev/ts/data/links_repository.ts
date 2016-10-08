/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../models/model.ts" />

class LinksRepository 
{
	GetAll() 
	{
		return $.ajax({
			type: 'GET',
			url: '/api/links'
		});
	}

	Delete(linkId:number) 
	{
		return $.ajax({
			type: 'DELETE',
			url: '/api/link/'+linkId,
			success: function(resp) {
				console.log('link DELETE - success')
				console.log('server says: '+resp);
			},
			error: function(resp) {
				console.log('link DELETE - failure');
				console.log(resp);
			},
		});
	}

	Create(newLink:Link)
	{
		return $.ajax({
			type: 'POST',
			url: '/api/link',
			contentType: 'application/json',
			data: JSON.stringify(newLink)
		});
	}

	Update(newLink:Link) 
	{
		return $.ajax({
			type: 'PUT',
			url: '/api/link/'+newLink.id,
			contentType: 'application/json',
			data: JSON.stringify(newLink)
		});
	}
}