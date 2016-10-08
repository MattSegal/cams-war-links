/// <reference path="../tools/observer.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../data/user_repository.ts" />

class UserController
{
	userModel : UserModel
	userRepository : UserRepository
	observer:Observer

	constructor(observer:Observer)
	{
		this.userModel 	= new UserModel()
		this.userRepository = new UserRepository()
		this.observer = observer
	}

	SetCurrent = (user:User) =>
	{
		this.userModel.current = user
	}

	GetCurrent = () : User =>
	{
		return this.userModel.current
	}

	GetAll = () : Array<User> =>
	{
		return this.userModel.users
	}

	Create = (user:User) : JQueryPromise<any> =>
	{
		let isValidName = !CheckIsEmpty(user.name) && user.name.length < 13
		if (!isValidName)
		{
			console.log('Invalid username')
			let deferred = jQuery.Deferred()
			deferred.reject()
			return deferred.promise()
		}
		
		console.log('User POST: ', user.name)
		return this.userRepository.Create(user.name)
		.done(() => 
		{
			console.log('Success')
			this.userModel.Add(user.name)
		})
		.fail( (response,status,error) => 
		{
			console.log("Failure: "+response.status+' '+response.responseText)
		})
	}

	Load = () : JQueryPromise<any> =>
	{
		console.log('User GET')
		return this.userRepository.GetAll()
		.done( userResponses => 
		{
			for (let userResponse of userResponses)
			{
				console.log('Success')
				this.userModel.Add(userResponse.name)
			}
		})
		.fail( (response,status,error) => 
		{
			console.log("Failure: "+response.status+' '+response.responseText)
		})
	}

	Delete = (user:User) : JQueryPromise<any> =>
	{
		console.log('User DELETE: ',user.name)
		return this.userRepository.Delete(user.name)
		.done( (response) => 
		{
			console.log("Success: "+response)
			this.userModel.Remove(user.name)
		})
		.fail( (response,status,error) => 
		{
			console.log("Failure: "+response.status+' '+response.responseText)
		})
	}
}