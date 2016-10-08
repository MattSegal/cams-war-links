/// <reference path="tools/observer.ts" />
/// <reference path="tools/helper.ts" />
/// <reference path="models/model.ts" />
/// <reference path="controllers/link_controller.ts" />
/// <reference path="controllers/user_controller.ts" />
/// <reference path="events/link_events.ts" />
/// <reference path="events/link_page_events.ts" />
/// <reference path="events/user_page_events.ts" />
/// <reference path="events/navbar_events.ts" />
/// <reference path="views/welcome_page_view.ts" />

// Singletons
let observer 		= new Observer()

let userController  = new UserController(observer)
let linkController  = new LinkController()

let welcomePage 	= new WelcomePage()

let linkEvents 		= new LinkEvents(observer,linkController)
let linkPageEvents  = new LinkPageEvents(observer,linkController,userController)
let userPageEvents  = new UserPageEvents(observer,userController)
let navbarEvents 	= new NavbarEvents(observer)

// Load the welcome page
welcomePage.Show()
observer.AddEvent(Events.NavigateLinks,() => welcomePage.Hide())
observer.AddEvent(Events.NavigateUserPage,() => welcomePage.Hide())

// Load initial data from API
userController.Load()
.done( () => 
{
	let users = userController.GetAll()
	for (let user of users)
	{
		observer.EmitEvent(Events.UserCreated,user)
	}
	linkController.Load()
})