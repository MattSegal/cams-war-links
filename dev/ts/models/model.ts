/// <reference path="../tools/helper.ts" />

enum LinkEditState
{
	None,
	Edit,
	Delete
}

class Link
{
	id: number;
	url: string;
	title: string;
	user: string;
	state: LinkEditState;

	constructor(url:string,title:string)
	{
		this.url = url
		this.title = title
	}
}

class LinkModel
{
	currentLinkId: number
	state: LinkEditState = LinkEditState.None
	linkIdCount: number
	links = {}

	GetUserLinks = (user:User) => 
	{
		return Object.keys(this.links)
			.map(linkId => this.links[linkId])
			.filter(link => link.user === user.name)
	}
}

class User
{
	name: string;
	constructor(name:string)
	{
		this.name = RemoveWhitespace(name)
		this.name = name.slice(0,1).toUpperCase() + name.slice(1).toLowerCase()
	}
}

class UserModel
{
	users : Array<User> = [] 
	current: User

	constructor()
	{
		this.current = new User('')
	}

	Add = (name:string) =>
	{
		let newUser = new User(name)
		this.users.push(newUser)
	}

	Remove = (name:string) =>
	{
		// TODO: Stop passing strings around
		let targetUser = this.users.filter( user => user.name === name)[0]
		let userIdx = this.users.indexOf(targetUser)
		if (userIdx > 0)
		{
			this.users.splice(userIdx,1)
		}
	}
}



