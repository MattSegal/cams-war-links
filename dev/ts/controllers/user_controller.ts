/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
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

	Create = (user:User) : boolean =>
	{
		let username = user.name
		let success = false
		let name = RemoveWhitespace(username)
		let isValidName = !CheckIsEmpty(name) && name.length < 13
		if (isValidName)
		{
			name = name.slice(0,1).toUpperCase() + name.slice(1).toLowerCase()
			console.log('Add user: ',name)

			this.userRepository.Create(name)
			this.userModel.Add(name)
			success = true
		}
		return success
	}

	// maybe use observer
	Load = () : JQueryPromise<Function> =>
	{
		return this.userRepository.GetAll()
		.done( userResponses => 
		{
			for (let userResponse of userResponses)
			{
				this.userModel.Add(userResponse.name)
			}
		})	
	}

	// TODO - use observer
	Delete = (user:User) : boolean =>
	{
		let username = user.name
		console.log('Delete user: ',name)
		this.userModel.Remove(username)
		this.userRepository.Delete(name)
		return true
	}
}