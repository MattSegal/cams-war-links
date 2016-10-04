/// <reference path="../tools/observer.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../views/navbar_view.ts" />

class NavbarEvents
{ 
	userNavbarView : UserNavbarView

	constructor(o:Observer)
	{
		this.userNavbarView = new UserNavbarView(o)

		o.AddEvent(Events.UserCreated,this.UserAdded)
		o.AddEvent(Events.UserDeleted,this.UserDeleted)
	}

	UserAdded = (user:User) => 
	{
		// TODO: ensure this doesn't get out of sync if ajax fails
		this.userNavbarView.AddUser(user)
	}

	UserDeleted = (user:User) => 
	{
		// TODO: ensure this doesn't get out of sync if ajax fails
		this.userNavbarView.RemoveUser(user)
	}
}