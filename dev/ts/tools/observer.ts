enum Events
{
	// Navigation
	NavigateUserPage,
	NavigateLinks,

	// Links
	CreateLinkSuccess,
	CreateLinkFailure,
	DeleteLinkButtonPress,
	CancelDeleteLinkButtonPress,
	ConfirmDeleteLinkButtonPress,
	EditLinkButtonPress,
	CancelEditLinkButtonPress,
	ConfirmEditLinkButtonPress,
	OpenLinkForm,
	ExitLinkForm,

	// Users
	CreateUserButtonPress,
	DeleteUserButtonPress,
	UserCreated,
	UserDeleted
}

class Observer 
{
	events = {}

	AddEvent(event:Events, fn) 
	{
		// add function to listener list for event
		let name = Events[event]
		this.events[name] = this.events[name] || [];
		this.events[name].push(fn)
	}
	
	RemoveEvent(event:Events, fn) 
	{
		// remove function from listener list for event
		let name = Events[event]
		if (this.events[name]) 
		{
			for (var idx=0;idx<this.events[name].length;idx++) 
			{
				if (this.events[name][idx] === fn) 
				{
					this.events[name].splice(idx,1);
					break;
				}
			};
		}
	}

	EmitEvent(event:Events, data) 
	{
		let name = Events[event]
		if (this.events[name]) {
			this.events[name].forEach( (fn) => 
			{
				fn(data);
			});
		}
	}
}