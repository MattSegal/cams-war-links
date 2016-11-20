/// <reference path="view_constants.ts" />
/// <reference path="../tools/mustache.d.ts" />
/// <reference path="../tools/jquery.d.ts" />
/// <reference path="../tools/observer.ts" />
/// <reference path="../tools/helper.ts" />
/// <reference path="../models/model.ts" />

class LinkPage
{
    template:string
    page : JQuery
    newLinkButton : JQuery
    newLinkForm : JQuery        
    newLinkUrl : JQuery
    newLinkTitle : JQuery
    cancelNewLinkButton : JQuery
    confirmNewLinkButton : JQuery
    
    Show = (username:string,o:Observer) => 
    {
        // Render user's links page
        this.template = $(LINK_PAGE_TEMPLATE).html()

        let pageTitle = username.slice(-1) === 's' ? `${username}' Links` : `${username}'s Links`
        $(PAGE_ROOT).append(Mustache.render(this.template,{name:pageTitle}));
        
        // cache the DOM
        this.page                   = $(LINK_PAGE)
        this.newLinkButton          = $(NEW_LINK_BUTTON);
        this.newLinkForm            = $(NEW_LINK_FORM);
        this.newLinkUrl             = this.newLinkForm.find(NEW_LINK_URL_CLASS);
        this.newLinkTitle           = this.newLinkForm.find(NEW_LINK_TITLE_CLASS);
        this.cancelNewLinkButton    = this.newLinkForm.find(NEW_LINK_CANCEL_BUTTON_CLASS);
        this.confirmNewLinkButton   = this.newLinkForm.find(NEW_LINK_SUBMIT_BUTTON_CLASS);

        // Bind form navigation events
        this.newLinkButton.on('click',this.RenderNewLinkForm)
        this.cancelNewLinkButton.on('click',this.RenderNewLinkButton);

        // Bind submit new link event
        let submitNewLink = () => {
            let newLink = new Link(this.newLinkUrl.val(),this.newLinkTitle.val())
            o.EmitEvent(Events.CreateLinkSubmit, newLink)
        }

        this.confirmNewLinkButton.on('click',submitNewLink);
        this.newLinkUrl.on('keypress',(e)=>OnEnterPress(e,submitNewLink));
        this.newLinkTitle.on('keypress',(e)=>OnEnterPress(e,submitNewLink));

        // Render page
        this.page.fadeIn(400)
    }

    Hide = () => 
    {
        // TODO: Unbind events so we don't get memory leaks
        if (this.page)
        {
            this.page.remove()
        }
    }
    
    RenderNewLinkForm = () => 
    {
        this.newLinkButton.hide();
        this.newLinkForm.fadeIn(200);
    }

    RenderNewLinkButton = () => 
    {
        this.HideNewLinkForm()
        this.newLinkButton.fadeIn(300)
    }

    HideNewLinkElements = () => 
    {
        this.newLinkButton.hide();
        this.HideNewLinkForm()
    }
    
    private HideNewLinkForm = () => 
    {
        this.newLinkUrl.val('')
        this.newLinkTitle.val('')
        this.newLinkForm.hide();
    }
}


