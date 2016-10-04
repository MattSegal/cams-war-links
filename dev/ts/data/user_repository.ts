/// <reference path="../tools/jquery.d.ts" />

class UserRepository 
{

	GetAll() 
	{
		return $.ajax({
			type: 'GET',
			url: '/api/user/',
			success: function() {
				console.log('user GET - success')
			},
			error: function() {
				console.log('user GET - failure')
			},
		});
	}

	Create(username: string) 
	{
		console.log('posting user:')
		console.log(username)
		$.ajax({
			type: 'POST',
			url: '/api/user/'+username,
			success: function() {
				console.log('user POST - success')
			},
			error: function() {
				console.log('user POST - failure')},
		});
	}

	Delete(username: string) 
	{
		$.ajax({
			type: 'DELETE',
			url: '/api/user/'+username,
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
}