var Events;
(function (Events) {
    Events[Events["NavigateUserPage"] = 0] = "NavigateUserPage";
    Events[Events["NavigateLinks"] = 1] = "NavigateLinks";
    Events[Events["CreateLinkSubmit"] = 2] = "CreateLinkSubmit";
    Events[Events["CreateLinkSuccess"] = 3] = "CreateLinkSuccess";
    Events[Events["CreateLinkFailure"] = 4] = "CreateLinkFailure";
    Events[Events["DeleteLinkButtonPress"] = 5] = "DeleteLinkButtonPress";
    Events[Events["CancelDeleteLinkButtonPress"] = 6] = "CancelDeleteLinkButtonPress";
    Events[Events["ConfirmDeleteLinkButtonPress"] = 7] = "ConfirmDeleteLinkButtonPress";
    Events[Events["EditLinkButtonPress"] = 8] = "EditLinkButtonPress";
    Events[Events["CancelEditLinkButtonPress"] = 9] = "CancelEditLinkButtonPress";
    Events[Events["ConfirmEditLinkButtonPress"] = 10] = "ConfirmEditLinkButtonPress";
    Events[Events["OpenLinkForm"] = 11] = "OpenLinkForm";
    Events[Events["ExitLinkForm"] = 12] = "ExitLinkForm";
    Events[Events["CreateUserButtonPress"] = 13] = "CreateUserButtonPress";
    Events[Events["DeleteUserButtonPress"] = 14] = "DeleteUserButtonPress";
    Events[Events["UserCreated"] = 15] = "UserCreated";
    Events[Events["UserDeleted"] = 16] = "UserDeleted";
})(Events || (Events = {}));
var Observer = (function () {
    function Observer() {
        this.events = {};
    }
    Observer.prototype.AddEvent = function (event, fn) {
        var name = Events[event];
        this.events[name] = this.events[name] || [];
        this.events[name].push(fn);
    };
    Observer.prototype.RemoveEvent = function (event, fn) {
        var name = Events[event];
        if (this.events[name]) {
            for (var idx = 0; idx < this.events[name].length; idx++) {
                if (this.events[name][idx] === fn) {
                    this.events[name].splice(idx, 1);
                    break;
                }
            }
            ;
        }
    };
    Observer.prototype.EmitEvent = function (event, data) {
        var name = Events[event];
        if (this.events[name]) {
            this.events[name].forEach(function (fn) {
                fn(data);
            });
        }
    };
    return Observer;
}());
function OnEnterPress(event, fn) {
    if (event.keyCode == 13) {
        fn();
    }
}
function CheckIsEmpty(str) {
    return str.replace(/^\s+|\s+$/g, '').length == 0;
}
function RemoveWhitespace(str) {
    return str.replace(/\s+/g, '');
}
function ParseURL(rawLinkText) {
    if (rawLinkText.slice(0, 7) === 'http://') {
        return rawLinkText;
    }
    else if (rawLinkText.slice(0, 8) === 'https://') {
        return 'http://' + rawLinkText.slice(8);
    }
    else {
        return 'http://' + rawLinkText;
    }
}
var LinkEditState;
(function (LinkEditState) {
    LinkEditState[LinkEditState["None"] = 0] = "None";
    LinkEditState[LinkEditState["Edit"] = 1] = "Edit";
    LinkEditState[LinkEditState["Delete"] = 2] = "Delete";
})(LinkEditState || (LinkEditState = {}));
var Link = (function () {
    function Link(url, title) {
        this.url = url;
        this.title = title;
    }
    return Link;
}());
var LinkModel = (function () {
    function LinkModel() {
        var _this = this;
        this.state = LinkEditState.None;
        this.links = {};
        this.GetUserLinks = function (user) {
            return Object.keys(_this.links)
                .map(function (linkId) { return _this.links[linkId]; })
                .filter(function (link) { return link.user === user.name; });
        };
    }
    return LinkModel;
}());
var User = (function () {
    function User(name) {
        this.name = RemoveWhitespace(name);
        this.name = name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
    }
    return User;
}());
var UserModel = (function () {
    function UserModel() {
        var _this = this;
        this.users = [];
        this.Add = function (name) {
            var newUser = new User(name);
            _this.users.push(newUser);
        };
        this.Remove = function (name) {
            var targetUser = _this.users.filter(function (user) { return user.name === name; })[0];
            var userIdx = _this.users.indexOf(targetUser);
            if (userIdx > 0) {
                _this.users.splice(userIdx, 1);
            }
        };
        this.current = new User('');
    }
    return UserModel;
}());
var LinksRepository = (function () {
    function LinksRepository() {
    }
    LinksRepository.prototype.GetAll = function () {
        return $.ajax({
            type: 'GET',
            url: '/links/api/links'
        });
    };
    LinksRepository.prototype.Delete = function (linkId) {
        return $.ajax({
            type: 'DELETE',
            url: '/links/api/link/' + linkId,
            success: function (resp) {
                console.log('link DELETE - success');
                console.log('server says: ' + resp);
            },
            error: function (resp) {
                console.log('link DELETE - failure');
                console.log(resp);
            }
        });
    };
    LinksRepository.prototype.Create = function (newLink) {
        return $.ajax({
            type: 'POST',
            url: '/links/api/link',
            contentType: 'application/json',
            data: JSON.stringify(newLink)
        });
    };
    LinksRepository.prototype.Update = function (newLink) {
        return $.ajax({
            type: 'PUT',
            url: '/links/api/link/' + newLink.id,
            contentType: 'application/json',
            data: JSON.stringify(newLink)
        });
    };
    return LinksRepository;
}());
var LinkController = (function () {
    function LinkController() {
        this.linksRepository = new LinksRepository();
        this.linkModel = new LinkModel();
    }
    LinkController.prototype.Get = function (user) {
        return this.linkModel.GetUserLinks(user);
    };
    LinkController.prototype.Load = function () {
        var linkStore = this.linkModel.links;
        console.log('Link GET');
        return this.linksRepository.GetAll()
            .done(function (links) {
            console.log('Success');
            for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
                var link = links_1[_i];
                linkStore[link.id] = link;
            }
        })
            .fail(function (response, status, error) {
            console.log("Failure: " + response.status + ' ' + response.responseText);
        });
    };
    LinkController.prototype.Create = function (newLink) {
        var _this = this;
        if (CheckIsEmpty(newLink.url) || CheckIsEmpty(newLink.user)) {
            console.log('Invalid fields for new link');
            var deferred = jQuery.Deferred();
            deferred.reject();
            return deferred.promise();
        }
        newLink.url = ParseURL(newLink.url);
        newLink.title = CheckIsEmpty(newLink.title) ? newLink.url.slice(7) : newLink.title;
        console.log('Link POST');
        return this.linksRepository.Create(newLink)
            .done(function (link_id) {
            newLink.id = parseInt(link_id, 10);
            _this.linkModel.links[newLink.id] = newLink;
            console.log('Success');
            console.log(newLink);
        })
            .fail(function (response, status, error) {
            console.log("Failure: " + response.status + ' ' + response.responseText);
        });
    };
    LinkController.prototype.Update = function (newLink) {
        var _this = this;
        if (CheckIsEmpty(newLink.title) || CheckIsEmpty(newLink.url)) {
            var deferred = jQuery.Deferred();
            deferred.reject();
            return deferred.promise();
        }
        console.log('Link PUT:');
        console.log(newLink);
        newLink.url = ParseURL(newLink.url);
        return this.linksRepository.Update(newLink)
            .done(function (response) {
            console.log('Success: ' + response);
            _this.linkModel.links[newLink.id] = newLink;
        })
            .fail(function (response, status, error) {
            console.log("Failure: " + response.status + ' ' + response.responseText);
        });
    };
    LinkController.prototype.Delete = function (id) {
        var _this = this;
        console.log('Link DELETE:');
        return this.linksRepository.Delete(id)
            .done(function () {
            console.log('Success');
            delete _this.linkModel.links[id];
        })
            .fail(function (response, status, error) {
            console.log("Failure: " + response.status + ' ' + response.responseText);
        });
    };
    LinkController.prototype.GetCurrentLink = function () {
        return this.linkModel.currentLinkId;
    };
    LinkController.prototype.CheckIsCurrentLink = function (linkId) {
        return this.linkModel.currentLinkId === linkId;
    };
    LinkController.prototype.CheckIsLinkDialogue = function () {
        return this.linkModel.state != LinkEditState.None;
    };
    LinkController.prototype.CheckIsLinkEditDialogue = function (linkId) {
        return this.linkModel.currentLinkId === linkId && this.linkModel.state === LinkEditState.Edit;
    };
    LinkController.prototype.CheckIsLinkDeleteDialogue = function (linkId) {
        return this.linkModel.currentLinkId === linkId && this.linkModel.state === LinkEditState.Delete;
    };
    LinkController.prototype.SetNoLinkDialogue = function () {
        this.linkModel.currentLinkId = -1;
        this.linkModel.state = LinkEditState.None;
    };
    LinkController.prototype.SetEditLinkDialogue = function (linkId) {
        this.linkModel.currentLinkId = linkId;
        this.linkModel.state = LinkEditState.Edit;
    };
    LinkController.prototype.SetDeleteLinkDialogue = function (linkId) {
        this.linkModel.currentLinkId = linkId;
        this.linkModel.state = LinkEditState.Delete;
    };
    return LinkController;
}());
var UserRepository = (function () {
    function UserRepository() {
    }
    UserRepository.prototype.GetAll = function () {
        return $.ajax({
            type: 'GET',
            url: '/links/api/user/'
        });
    };
    UserRepository.prototype.Create = function (username) {
        return $.ajax({
            type: 'POST',
            url: '/links/api/user/' + username
        });
    };
    UserRepository.prototype.Delete = function (username) {
        return $.ajax({
            type: 'DELETE',
            url: '/links/api/user/' + username
        });
    };
    return UserRepository;
}());
var UserController = (function () {
    function UserController(observer) {
        var _this = this;
        this.SetCurrent = function (user) {
            _this.userModel.current = user;
        };
        this.GetCurrent = function () {
            return _this.userModel.current;
        };
        this.GetAll = function () {
            return _this.userModel.users;
        };
        this.Create = function (user) {
            var isValidName = !CheckIsEmpty(user.name) && user.name.length <= 10;
            if (!isValidName) {
                console.log('Invalid username');
                var deferred = jQuery.Deferred();
                deferred.reject();
                return deferred.promise();
            }
            console.log('User POST: ', user.name);
            return _this.userRepository.Create(user.name)
                .done(function () {
                console.log('Success');
                _this.userModel.Add(user.name);
            })
                .fail(function (response, status, error) {
                console.log("Failure: " + response.status + ' ' + response.responseText);
            });
        };
        this.Load = function () {
            console.log('User GET');
            return _this.userRepository.GetAll()
                .done(function (userResponses) {
                for (var _i = 0, userResponses_1 = userResponses; _i < userResponses_1.length; _i++) {
                    var userResponse = userResponses_1[_i];
                    console.log('Success');
                    _this.userModel.Add(userResponse.name);
                }
            })
                .fail(function (response, status, error) {
                console.log("Failure: " + response.status + ' ' + response.responseText);
            });
        };
        this.Delete = function (user) {
            console.log('User DELETE: ', user.name);
            return _this.userRepository.Delete(user.name)
                .done(function (response) {
                console.log("Success: " + response);
                _this.userModel.Remove(user.name);
            })
                .fail(function (response, status, error) {
                console.log("Failure: " + response.status + ' ' + response.responseText);
            });
        };
        this.userModel = new UserModel();
        this.userRepository = new UserRepository();
        this.observer = observer;
    }
    return UserController;
}());
var LINK_PAGE_TEMPLATE = '#link-page-template';
var USER_PAGE_TEMPLATE = '#user-page-template';
var LINK_TEMPLATE = '#link-template';
var USER_FORM_TEMPLATE = '#user-form-template';
var NAVBAR_USER_TEMPLATE = '#navbar-user-template';
var PAGE_ROOT = '#page-root';
var WELCOME_PAGE = '#welcome-page';
var USER_PAGE = '#user-page';
var LINK_PAGE = '#link-page';
var LINK_LIST = '#link-list';
var USER_NAVBAR = '#users-navbar';
var EDIT_USERS_BUTTON = '#edit-users-button';
var NAVBAR_USERS_LIST = '#users-navbar-list';
var NEW_LINK_BUTTON = '#new-item-button';
var NEW_LINK_FORM = '#new-item-form';
var NEW_LINK_URL_CLASS = '.url';
var NEW_LINK_TITLE_CLASS = '.title';
var NEW_LINK_CANCEL_BUTTON_CLASS = '.cancel';
var NEW_LINK_SUBMIT_BUTTON_CLASS = '.submit';
var ADD_USER_FORM = '#new-user-form';
var ADD_USER_BUTTON = '#new-user-button';
var CONFIRM_ADD_USER_BUTTON = '#confirm-new-user-button';
var CANCEL_ADD_USER_BUTTON = '#cancel-new-user-button';
var USERNAME_TEXTBOX = '#new-user-name';
var LINK_DELETE_BUTTON = '.link-delete-button';
var LINK_DELETE_FORM = '.link-delete-form';
var CONFIRM_LINK_DELETE_BUTTON = '.delete';
var CANCEL_LINK_DELETE_BUTTON = '.cancel';
var LINK_EDIT_BUTTON = '.link-edit-button';
var LINK_EDIT_FORM = '.link-edit-form';
var CONFIRM_LINK_EDIT_BUTTON = '.submit';
var CANCEL_LINK_EDIT_BUTTON = '.cancel';
var LINK_EDIT_TITLE = '.title';
var LINK_EDIT_URL = '.url';
var LINK_HYPERLINK = 'a';
var LinkView = (function () {
    function LinkView(link, observer) {
        var _this = this;
        this.DestroyLink = function () {
            _this.link.remove();
        };
        this.UpdateHyperLink = function (link) {
            _this.hyperlink.attr('href', link.url);
            _this.hyperlink.html(link.title);
        };
        this.RenderEditForm = function () {
            _this.SetLinkActive();
            _this.editUrl.val(_this.hyperlink.attr('href'));
            _this.editTitle.val(_this.hyperlink.html());
            _this.editForm.slideDown(200);
        };
        this.CloseAllForms = function () {
            _this.CancelEditForm(true);
            _this.CancelDeleteForm(true);
        };
        this.CancelEditForm = function (fastHide) {
            _this.SetLinkInactive();
            if (fastHide) {
                _this.editForm.hide();
            }
            else {
                _this.editForm.slideUp(300);
            }
        };
        this.RenderDeleteForm = function () {
            _this.SetLinkActive();
            _this.deleteForm.slideDown(200);
        };
        this.CancelDeleteForm = function (fastHide) {
            _this.SetLinkInactive();
            if (fastHide) {
                _this.deleteForm.hide();
            }
            else {
                _this.deleteForm.slideUp(300);
            }
        };
        this.RenderDelete = function () {
            _this.link.fadeOut(300, _this.DestroyLink);
        };
        this.SetLinkActive = function () {
            _this.link.addClass('active-link');
        };
        this.SetLinkInactive = function () {
            if (_this.link.hasClass('active-link')) {
                _this.link.removeClass('active-link');
            }
        };
        this.linkId = link.id;
        $(LINK_LIST).prepend(Mustache.render($(LINK_TEMPLATE).html(), link));
        this.link = $('#link' + this.linkId);
        this.deleteButton = this.link.find(LINK_DELETE_BUTTON);
        this.editButton = this.link.find(LINK_EDIT_BUTTON);
        this.deleteForm = this.link.find(LINK_DELETE_FORM);
        this.editForm = this.link.find(LINK_EDIT_FORM);
        this.editTitle = this.editForm.find(LINK_EDIT_TITLE);
        this.editUrl = this.editForm.find(LINK_EDIT_URL);
        this.hyperlink = this.link.find(LINK_HYPERLINK);
        var publishEditButtonPress = function () { return observer.EmitEvent(Events.EditLinkButtonPress, _this.linkId); };
        this.editButton.on('click', publishEditButtonPress);
        var publishEditCancelPress = function () { return observer.EmitEvent(Events.CancelEditLinkButtonPress, _this.linkId); };
        this.editForm.find(CANCEL_LINK_EDIT_BUTTON).on('click', publishEditCancelPress);
        var publishEditConfirmPress = function () { return observer.EmitEvent(Events.ConfirmEditLinkButtonPress, {
            url: _this.editUrl.val(),
            title: _this.editTitle.val(),
            linkId: _this.linkId
        }); };
        this.editForm.find(CONFIRM_LINK_EDIT_BUTTON).on('click', publishEditConfirmPress);
        this.editTitle.on('keypress', function (e) { return OnEnterPress(e, publishEditConfirmPress); });
        this.editUrl.on('keypress', function (e) { return OnEnterPress(e, publishEditConfirmPress); });
        var publishDeleteButtonPress = function () { return observer.EmitEvent(Events.DeleteLinkButtonPress, _this.linkId); };
        this.deleteButton.on('click', publishDeleteButtonPress);
        var publishDeleteCancelPress = function () { return observer.EmitEvent(Events.CancelDeleteLinkButtonPress, _this.linkId); };
        this.deleteForm.find(CANCEL_LINK_DELETE_BUTTON).on('click', publishDeleteCancelPress);
        var publishDeleteConfimPress = function () { return observer.EmitEvent(Events.ConfirmDeleteLinkButtonPress, _this.linkId); };
        this.deleteForm.find(CONFIRM_LINK_DELETE_BUTTON).on('click', publishDeleteConfimPress);
    }
    return LinkView;
}());
var LinkEvents = (function () {
    function LinkEvents(o, linkController) {
        var _this = this;
        this.linkViews = {};
        this.NewLinkCreated = function (newLink) {
            _this.linkViews[newLink.id] = new LinkView(newLink, _this.observer);
        };
        this.LinkEditSelected = function (linkId) {
            var linkView = _this.linkViews[linkId];
            var isALinkAlreadyOpen = _this.linkController.CheckIsLinkDialogue();
            var isThisLinkBeingEdited = _this.linkController.CheckIsLinkEditDialogue(linkId);
            if (isALinkAlreadyOpen && isThisLinkBeingEdited) {
                linkView.CancelEditForm(false);
                _this.linkController.SetNoLinkDialogue();
                _this.observer.EmitEvent(Events.ExitLinkForm, {});
                return;
            }
            else if (isALinkAlreadyOpen) {
                var otherLinkId = _this.linkController.GetCurrentLink();
                var otherLinkView = _this.linkViews[otherLinkId];
                otherLinkView.CloseAllForms();
            }
            linkView.RenderEditForm();
            _this.linkController.SetEditLinkDialogue(linkId);
            _this.observer.EmitEvent(Events.OpenLinkForm, {});
        };
        this.LinkEditCancelled = function (linkId) {
            _this.linkController.SetNoLinkDialogue();
            var link = _this.linkViews[linkId];
            link.CancelEditForm(false);
            _this.observer.EmitEvent(Events.ExitLinkForm, {});
        };
        this.LinkEditConfirmed = function (linkData) {
            var updatedLink = new Link(linkData["url"], linkData["title"]);
            updatedLink.id = linkData["linkId"];
            var linkView = _this.linkViews[updatedLink.id];
            _this.linkController.Update(updatedLink)
                .done(function () {
                linkView.UpdateHyperLink(updatedLink);
            });
            _this.linkController.SetNoLinkDialogue();
            linkView.CancelEditForm(false);
            _this.observer.EmitEvent(Events.ExitLinkForm, {});
        };
        this.LinkDeleteSelected = function (linkId) {
            var linkView = _this.linkViews[linkId];
            var isALinkAlreadyOpen = _this.linkController.CheckIsLinkDialogue();
            var isThisLinkBeingDeleted = _this.linkController.CheckIsLinkDeleteDialogue(linkId);
            if (isALinkAlreadyOpen && isThisLinkBeingDeleted) {
                linkView.CancelDeleteForm(false);
                _this.linkController.SetNoLinkDialogue();
                _this.observer.EmitEvent(Events.ExitLinkForm, {});
                return;
            }
            else if (isALinkAlreadyOpen) {
                var otherLinkId = _this.linkController.GetCurrentLink();
                var otherLinkView = _this.linkViews[otherLinkId];
                otherLinkView.CloseAllForms();
            }
            linkView.RenderDeleteForm();
            _this.linkController.SetDeleteLinkDialogue(linkId);
            _this.observer.EmitEvent(Events.OpenLinkForm, {});
        };
        this.LinkDeleteCancelled = function (linkId) {
            _this.linkController.SetNoLinkDialogue();
            var linkView = _this.linkViews[linkId];
            linkView.CancelDeleteForm(false);
            _this.observer.EmitEvent(Events.ExitLinkForm, {});
        };
        this.LinkDeleteConfirmed = function (linkId) {
            var linkView = _this.linkViews[linkId];
            _this.linkController.Delete(linkId)
                .done(function () {
                linkView.RenderDelete();
                delete _this.linkViews[linkId];
            })
                .fail(function () {
                linkView.CancelDeleteForm(false);
            });
            _this.linkController.SetNoLinkDialogue();
            _this.observer.EmitEvent(Events.ExitLinkForm, {});
        };
        this.linkController = linkController;
        o.AddEvent(Events.CreateLinkSuccess, this.NewLinkCreated);
        o.AddEvent(Events.EditLinkButtonPress, this.LinkEditSelected);
        o.AddEvent(Events.CancelEditLinkButtonPress, this.LinkEditCancelled);
        o.AddEvent(Events.ConfirmEditLinkButtonPress, this.LinkEditConfirmed);
        o.AddEvent(Events.DeleteLinkButtonPress, this.LinkDeleteSelected);
        o.AddEvent(Events.CancelDeleteLinkButtonPress, this.LinkDeleteCancelled);
        o.AddEvent(Events.ConfirmDeleteLinkButtonPress, this.LinkDeleteConfirmed);
        this.observer = o;
    }
    return LinkEvents;
}());
var LinkPage = (function () {
    function LinkPage() {
        var _this = this;
        this.Show = function (username, o) {
            _this.template = $(LINK_PAGE_TEMPLATE).html();
            var pageTitle = username.slice(-1) === 's' ? username + "' Links" : username + "'s Links";
            $(PAGE_ROOT).append(Mustache.render(_this.template, { name: pageTitle }));
            _this.page = $(LINK_PAGE);
            _this.newLinkButton = $(NEW_LINK_BUTTON);
            _this.newLinkForm = $(NEW_LINK_FORM);
            _this.newLinkUrl = _this.newLinkForm.find(NEW_LINK_URL_CLASS);
            _this.newLinkTitle = _this.newLinkForm.find(NEW_LINK_TITLE_CLASS);
            _this.cancelNewLinkButton = _this.newLinkForm.find(NEW_LINK_CANCEL_BUTTON_CLASS);
            _this.confirmNewLinkButton = _this.newLinkForm.find(NEW_LINK_SUBMIT_BUTTON_CLASS);
            _this.newLinkButton.on('click', _this.RenderNewLinkForm);
            _this.cancelNewLinkButton.on('click', _this.RenderNewLinkButton);
            var submitNewLink = function () {
                var newLink = new Link(_this.newLinkUrl.val(), _this.newLinkTitle.val());
                o.EmitEvent(Events.CreateLinkSubmit, newLink);
            };
            _this.confirmNewLinkButton.on('click', submitNewLink);
            _this.newLinkUrl.on('keypress', function (e) { return OnEnterPress(e, submitNewLink); });
            _this.newLinkTitle.on('keypress', function (e) { return OnEnterPress(e, submitNewLink); });
            _this.page.fadeIn(400);
        };
        this.Hide = function () {
            if (_this.page) {
                _this.page.remove();
            }
        };
        this.RenderNewLinkForm = function () {
            _this.newLinkButton.hide();
            _this.newLinkForm.fadeIn(200);
        };
        this.RenderNewLinkButton = function () {
            _this.HideNewLinkForm();
            _this.newLinkButton.fadeIn(300);
        };
        this.HideNewLinkElements = function () {
            _this.newLinkButton.hide();
            _this.HideNewLinkForm();
        };
        this.HideNewLinkForm = function () {
            _this.newLinkUrl.val('');
            _this.newLinkTitle.val('');
            _this.newLinkForm.hide();
        };
    }
    return LinkPage;
}());
var LinkPageEvents = (function () {
    function LinkPageEvents(o, linkController, userController) {
        var _this = this;
        this.SubmitNewLink = function (newLink) {
            newLink.user = _this.userController.GetCurrent().name;
            _this.linkController.Create(newLink)
                .done(function () { return _this.observer.EmitEvent(Events.CreateLinkSuccess, newLink); })
                .fail(function () { return _this.observer.EmitEvent(Events.CreateLinkFailure, {}); });
            _this.linkPage.RenderNewLinkButton();
        };
        this.LinkEditFormOpened = function () {
            _this.linkPage.HideNewLinkElements();
        };
        this.LinkEditFormClosed = function () {
            _this.linkPage.RenderNewLinkButton();
        };
        this.NavigateLinkPage = function (user) {
            var currentUser = _this.userController.GetCurrent();
            if (currentUser.name === user.name) {
                return;
            }
            _this.userController.SetCurrent(user);
            _this.linkPage.Hide();
            _this.linkPage.Show(user.name, _this.observer);
            var userLinks = _this.linkController.Get(user);
            for (var _i = 0, userLinks_1 = userLinks; _i < userLinks_1.length; _i++) {
                var link = userLinks_1[_i];
                _this.observer.EmitEvent(Events.CreateLinkSuccess, link);
            }
        };
        this.PageExited = function () {
            var nullUser = new User('');
            _this.userController.SetCurrent(nullUser);
            _this.linkPage.Hide();
        };
        this.linkController = linkController;
        this.userController = userController;
        this.linkPage = new LinkPage();
        o.AddEvent(Events.NavigateLinks, this.NavigateLinkPage);
        o.AddEvent(Events.NavigateUserPage, this.PageExited);
        o.AddEvent(Events.ExitLinkForm, this.LinkEditFormClosed);
        o.AddEvent(Events.OpenLinkForm, this.LinkEditFormOpened);
        o.AddEvent(Events.CreateLinkSubmit, this.SubmitNewLink);
        this.observer = o;
    }
    return LinkPageEvents;
}());
var UserPage = (function () {
    function UserPage() {
        var _this = this;
        this.Show = function (observer) {
            _this.template = $(USER_PAGE_TEMPLATE).html();
            var pageHtml = Mustache.render(_this.template, {});
            $(PAGE_ROOT).append(pageHtml);
            _this.page = $(USER_PAGE);
            _this.newUserForm = _this.page.find(ADD_USER_FORM);
            _this.usernameField = _this.page.find(USERNAME_TEXTBOX);
            _this.addUserButton = _this.page.find(ADD_USER_BUTTON);
            _this.confirmAddUserButton = _this.page.find(CONFIRM_ADD_USER_BUTTON);
            var publishAddUser = function () {
                var username = _this.usernameField.val();
                var newUser = new User(username);
                observer.EmitEvent(Events.CreateUserButtonPress, newUser);
            };
            _this.confirmAddUserButton.on('click', publishAddUser);
            _this.usernameField.on('keypress', function (e) { if (e.keyCode == 13) {
                publishAddUser();
            } });
            _this.addUserButton.on('click', function () { return _this.RenderNewUserForm(); });
            var cancelAddUserButton = $(CANCEL_ADD_USER_BUTTON);
            cancelAddUserButton.on('click', _this.HideNewUserForm);
            _this.page.fadeIn(600);
        };
        this.IsInDOM = function () {
            return _this.page !== undefined && $(_this.page.selector).length > 0;
        };
        this.Hide = function () {
            if (_this.page) {
                _this.page.remove();
            }
        };
        this.RenderNewUserForm = function () {
            _this.addUserButton.hide();
            _this.newUserForm.fadeIn(300);
            setTimeout(function () {
                $.each($('.delete'), function (idx, val) {
                });
            }, 300);
        };
        this.HideNewUserForm = function () {
            _this.newUserForm.hide();
            _this.usernameField.val('');
            _this.addUserButton.fadeIn(300);
        };
    }
    return UserPage;
}());
var UserView = (function () {
    function UserView(user, observer) {
        var _this = this;
        this.RenderDelete = function () {
            _this.userElement.slideUp(300);
            setTimeout(function () { return _this.userElement.remove(); }, 300);
        };
        this.RenderDeleteForm = function () {
            _this.isDeleteFormOpen = true;
            _this.deleteButton.addClass('confirm-user-delete-button');
            _this.cancelDeleteButton.animate({ width: 'show' }, 350);
        };
        this.CancelDeleteForm = function () {
            _this.isDeleteFormOpen = false;
            _this.deleteButton.removeClass('confirm-user-delete-button');
            _this.deleteButton.on('click', _this.RenderDeleteForm);
            _this.cancelDeleteButton.animate({ width: 'hide' }, 350);
        };
        this.username = user.name;
        this.isDeleteFormOpen = false;
        this.template = $(USER_FORM_TEMPLATE).html();
        var userHtml = Mustache.render(this.template, { name: user.name });
        $(USER_PAGE).find('ul').append(userHtml);
        this.userElement = $('#edit' + user.name);
        this.deleteButton = $('#delete' + user.name);
        this.cancelDeleteButton = $('#cancel' + user.name);
        var publishUserDeleteButtonPress = function () { return observer.EmitEvent(Events.DeleteUserButtonPress, user); };
        this.deleteButton.on('click', publishUserDeleteButtonPress);
        this.cancelDeleteButton.on('click', this.CancelDeleteForm);
    }
    return UserView;
}());
var UserPageEvents = (function () {
    function UserPageEvents(o, userController) {
        var _this = this;
        this.userViews = {};
        this.CreateUserSubmitted = function (user) {
            _this.userController.Create(user)
                .done(function () {
                _this.userViews[user.name] = new UserView(user, _this.observer);
                _this.observer.EmitEvent(Events.UserCreated, user);
            });
            _this.userPage.HideNewUserForm();
        };
        this.DeleteUserSubmitted = function (user) {
            var userView = _this.userViews[user.name];
            if (userView.isDeleteFormOpen) {
                _this.userController.Delete(user)
                    .done(function () {
                    userView.RenderDelete();
                    delete _this.userViews[user.name];
                    _this.observer.EmitEvent(Events.UserDeleted, user);
                })
                    .fail(function () {
                    userView.CancelDeleteForm();
                });
            }
            else {
                userView.RenderDeleteForm();
            }
        };
        this.NavigateUserPage = function () {
            if (!_this.userPage.IsInDOM()) {
                _this.userPage.Show(_this.observer);
                var users = _this.userController.GetAll();
                for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
                    var user = users_1[_i];
                    _this.userViews[user.name] = new UserView(user, _this.observer);
                }
            }
        };
        this.PageExited = function () {
            _this.userPage.Hide();
        };
        this.userController = userController;
        this.userPage = new UserPage();
        o.AddEvent(Events.NavigateUserPage, this.NavigateUserPage);
        o.AddEvent(Events.NavigateLinks, this.PageExited);
        o.AddEvent(Events.CreateUserButtonPress, this.CreateUserSubmitted);
        o.AddEvent(Events.DeleteUserButtonPress, this.DeleteUserSubmitted);
        this.observer = o;
    }
    return UserPageEvents;
}());
var UserNavbarView = (function () {
    function UserNavbarView(observer) {
        var _this = this;
        this.GetUserSelector = function (user) {
            return _this.navbar.find("#select" + user.name);
        };
        this.AddUsers = function (users) {
            for (var _i = 0, users_2 = users; _i < users_2.length; _i++) {
                var user = users_2[_i];
                _this.AddUser(user);
            }
        };
        this.AddUser = function (user) {
            _this.RenderUser(user);
            var publishNavigateLinks = _this.publishNavigateLinksFactory(user);
            _this.GetUserSelector(user).on('click', publishNavigateLinks);
        };
        this.RemoveUser = function (user) {
            _this.GetUserSelector(user).slideUp(300);
            var removeUser = function () { return _this.GetUserSelector(user).remove(); };
            setTimeout(removeUser, 300);
        };
        this.RenderUser = function (user) {
            var html = Mustache.render(_this.template, { name: user.name });
            _this.userList.append(html);
        };
        this.template = $(NAVBAR_USER_TEMPLATE).html();
        this.navbar = $(USER_NAVBAR);
        this.userList = $(NAVBAR_USERS_LIST);
        this.editButton = $(EDIT_USERS_BUTTON);
        var publishUserPageNavigate = function () { return observer.EmitEvent(Events.NavigateUserPage, {}); };
        this.editButton.on('click', publishUserPageNavigate);
        this.publishNavigateLinksFactory = function (user) {
            return function () { return observer.EmitEvent(Events.NavigateLinks, user); };
        };
    }
    return UserNavbarView;
}());
var NavbarEvents = (function () {
    function NavbarEvents(o) {
        var _this = this;
        this.UserAdded = function (user) {
            _this.userNavbarView.AddUser(user);
        };
        this.UserDeleted = function (user) {
            _this.userNavbarView.RemoveUser(user);
        };
        this.userNavbarView = new UserNavbarView(o);
        o.AddEvent(Events.UserCreated, this.UserAdded);
        o.AddEvent(Events.UserDeleted, this.UserDeleted);
    }
    return NavbarEvents;
}());
var WelcomePage = (function () {
    function WelcomePage() {
        this.Hide = function () {
            var welcomePage = $(WELCOME_PAGE);
            if (welcomePage) {
                welcomePage.remove();
            }
        };
    }
    return WelcomePage;
}());
var observer = new Observer();
var userController = new UserController(observer);
var linkController = new LinkController();
var welcomePage = new WelcomePage();
var linkEvents = new LinkEvents(observer, linkController);
var linkPageEvents = new LinkPageEvents(observer, linkController, userController);
var userPageEvents = new UserPageEvents(observer, userController);
var navbarEvents = new NavbarEvents(observer);
observer.AddEvent(Events.NavigateLinks, function () { return welcomePage.Hide(); });
observer.AddEvent(Events.NavigateUserPage, function () { return welcomePage.Hide(); });
userController.Load()
    .done(function () {
    var users = userController.GetAll();
    for (var _i = 0, users_3 = users; _i < users_3.length; _i++) {
        var user = users_3[_i];
        observer.EmitEvent(Events.UserCreated, user);
    }
    linkController.Load()
        .done(function () {
    });
});
