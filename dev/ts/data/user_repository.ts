/// <reference path="../tools/jquery.d.ts" />

class UserRepository 
{

	GetAll() : JQueryPromise<any>
	{
		return $.ajax({
			type: 'GET',
			url: '/api/user/'
		});
	}

	Create(username: string) : JQueryPromise<any>
	{
		return $.ajax({
			type: 'POST',
			url: '/api/user/'+username
		});
	}

	Delete(username: string) : JQueryPromise<any>
	{
		return $.ajax({
			type: 'DELETE',
			url: '/api/user/'+username,	
		});
	}
}