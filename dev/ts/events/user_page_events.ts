/// <reference path="../tools/observer.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../controllers/user_controller.ts" />
/// <reference path="../views/user_page_view.ts" />
/// <reference path="../views/user_view.ts" />


class UserPageEvents
{ 
	observer: Observer
	userPage : UserPage
	userController : UserController
	userViews : {[username:string] : UserView;} = {}

	constructor(o:Observer,userController:UserController)
	{
		this.userController = userController
		this.userPage = new UserPage()

		o.AddEvent(Events.NavigateUserPage,this.NavigateUserPage)
		o.AddEvent(Events.NavigateLinks,this.PageExited)
		o.AddEvent(Events.CreateUserButtonPress,this.CreateUserSubmitted)
		o.AddEvent(Events.DeleteUserButtonPress,this.DeleteUserSubmitted)
		this.observer = o
	}

	CreateUserSubmitted = (user:User) =>
	{
		this.userController.Create(user)
		.done( () =>
		{
			this.userViews[user.name] = new UserView(user,this.observer)
			this.observer.EmitEvent(Events.UserCreated,user)
		})
		this.userPage.HideNewUserForm()
	}

	DeleteUserSubmitted = (user:User) =>
	{
		let userView = this.userViews[user.name]

		if (userView.isDeleteFormOpen)
		{
			this.userController.Delete(user)
			.done( () =>
			{
				userView.RenderDelete()
				delete this.userViews[user.name]
				this.observer.EmitEvent(Events.UserDeleted,user)
			})
			.fail( () =>
			{
				userView.CancelDeleteForm()
			})
		}
		else
		{
			userView.RenderDeleteForm()
		}
	}

	NavigateUserPage = () => 
	{
		if (!this.userPage.IsInDOM())
		{
			this.userPage.Show(this.observer)
			let users = this.userController.GetAll()
			for (let user of users)
			{
				this.userViews[user.name] = new UserView(user,this.observer)
			}
		}
	}

	PageExited = () =>
	{
		this.userPage.Hide()
	}
}