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
            url: '/api/links'
        });
    };
    LinksRepository.prototype.Delete = function (linkId) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/link/' + linkId,
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
            url: '/api/link',
            contentType: 'application/json',
            data: JSON.stringify(newLink)
        });
    };
    LinksRepository.prototype.Update = function (newLink) {
        return $.ajax({
            type: 'PUT',
            url: '/api/link/' + newLink.id,
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
        this.linksRepository.GetAll()
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
            url: '/api/user/'
        });
    };
    UserRepository.prototype.Create = function (username) {
        return $.ajax({
            type: 'POST',
            url: '/api/user/' + username
        });
    };
    UserRepository.prototype.Delete = function (username) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/user/' + username
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
            var isValidName = !CheckIsEmpty(user.name) && user.name.length < 13;
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
            _this.link.addClass('active');
            _this.editUrl.val(_this.hyperlink.attr('href'));
            _this.editTitle.val(_this.hyperlink.html());
            _this.editForm.slideDown(200);
        };
        this.CloseAllForms = function () {
            _this.CancelEditForm(true);
            _this.CancelDeleteForm(true);
        };
        this.CancelEditForm = function (fastHide) {
            _this.link.removeClass('active');
            if (fastHide) {
                _this.editForm.hide();
                _this.FixHoverBug(true);
            }
            else {
                _this.editForm.slideUp(300);
                _this.FixHoverBug(false);
            }
            _this.FixHoverBug(false);
        };
        this.RenderDeleteForm = function () {
            _this.link.addClass('active');
            _this.deleteForm.slideDown(200);
        };
        this.CancelDeleteForm = function (fastHide) {
            _this.link.removeClass('active');
            if (fastHide) {
                _this.deleteForm.hide();
                _this.FixHoverBug(true);
            }
            else {
                _this.deleteForm.slideUp(300);
                _this.FixHoverBug(false);
            }
        };
        this.RenderDelete = function () {
            _this.link.fadeOut(300, _this.DestroyLink);
        };
        this.RenderLinkHover = function () {
            if (_this.link.hasClass('active')) {
                return;
            }
            if (_this.link.hasClass('hover')) {
                _this.link.removeClass('hover');
                _this.deleteButton.removeClass('hover');
                _this.editButton.removeClass('hover');
            }
            else {
                _this.link.addClass('hover');
                _this.deleteButton.addClass('hover');
                _this.editButton.addClass('hover');
            }
        };
        this.FixHoverBug = function (fastHide) {
            var delay = fastHide ? 0 : 302;
            setTimeout(function () {
                if (_this.link.hasClass('hover') && !_this.link.is(":hover")) {
                    _this.RenderLinkHover.call(_this.link);
                }
            }, delay);
        };
        this.linkId = link.id;
        $('.linkList').prepend(Mustache.render($('#linkTemplate').html(), link));
        this.link = $('#link' + this.linkId);
        this.deleteButton = this.link.find('.linkDelete');
        this.editButton = this.link.find('.linkEdit');
        this.deleteForm = this.link.find('.linkDeleteForm');
        this.editForm = this.link.find('.linkEditForm');
        this.editTitle = this.editForm.find('.title');
        this.editUrl = this.editForm.find('.url');
        this.hyperlink = this.link.find('a');
        this.link.on('mouseenter mouseleave', this.RenderLinkHover);
        var publishEditButtonPress = function () { return observer.EmitEvent(Events.EditLinkButtonPress, _this.linkId); };
        this.editButton.on('click', publishEditButtonPress);
        var publishEditCancelPress = function () { return observer.EmitEvent(Events.CancelEditLinkButtonPress, _this.linkId); };
        this.editForm.find('.cancel').on('click', publishEditCancelPress);
        var publishEditConfirmPress = function () { return observer.EmitEvent(Events.ConfirmEditLinkButtonPress, {
            url: _this.editUrl.val(),
            title: _this.editTitle.val(),
            linkId: _this.linkId
        }); };
        this.editForm.find('.submit').on('click', publishEditConfirmPress);
        this.editTitle.on('keypress', function (e) { return OnEnterPress(e, publishEditConfirmPress); });
        this.editUrl.on('keypress', function (e) { return OnEnterPress(e, publishEditConfirmPress); });
        var publishDeleteButtonPress = function () { return observer.EmitEvent(Events.DeleteLinkButtonPress, _this.linkId); };
        this.deleteButton.on('click', publishDeleteButtonPress);
        var publishDeleteCancelPress = function () { return observer.EmitEvent(Events.CancelDeleteLinkButtonPress, _this.linkId); };
        this.deleteForm.find('.cancel').on('click', publishDeleteCancelPress);
        var publishDeleteConfimPress = function () { return observer.EmitEvent(Events.ConfirmDeleteLinkButtonPress, _this.linkId); };
        this.deleteForm.find('.delete').on('click', publishDeleteConfimPress);
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
        this.template = $('#userBoxTemplate').html();
        this.Show = function (username, o) {
            $('.userBox').append(Mustache.render(_this.template, { name: username }));
            _this.page = $('#' + username);
            _this.newLinkButton = $('.newItemButton');
            _this.newLinkForm = $('.newItemForm');
            _this.newLinkUrl = _this.newLinkForm.find('.url');
            _this.newLinkTitle = _this.newLinkForm.find('.title');
            _this.cancelNewLinkButton = _this.newLinkForm.find('.cancel');
            _this.confirmNewLinkButton = _this.newLinkForm.find('.submit');
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
            _this.newLinkForm.slideDown(200);
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
            _this.template = $('#editScreenTemplate').html();
            var pageHtml = Mustache.render(_this.template, {});
            $('.userBox').append(pageHtml);
            _this.page = $('.editScreen');
            _this.addUserButton = $('.addUser');
            _this.confirmAddUserButton = $('.add');
            _this.usernameField = $('.name');
            _this.newUserForm = $('.newUserForm');
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
            var cancelAddUserButton = $('.cancel');
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
            _this.deleteButton.addClass('deleteConfirm');
            _this.cancelDeleteButton.animate({ width: 'show' }, 350);
        };
        this.CancelDeleteForm = function () {
            _this.isDeleteFormOpen = false;
            _this.deleteButton.removeClass('deleteConfirm');
            _this.deleteButton.on('click', _this.RenderDeleteForm);
            _this.cancelDeleteButton.animate({ width: 'hide' }, 350);
        };
        this.username = user.name;
        this.isDeleteFormOpen = false;
        this.template = $('#editUserTemplate').html();
        var userHtml = Mustache.render(this.template, { name: user.name });
        $('.editScreen').find('ul').append(userHtml);
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
        this.AddUsers = function (users) {
            for (var _i = 0, users_2 = users; _i < users_2.length; _i++) {
                var user = users_2[_i];
                _this.AddUser(user);
            }
        };
        this.AddUser = function (user) {
            _this.RenderUser(user);
            var publishNavigateLinks = _this.publishNavigateLinksFactory(user);
            $('#select' + user.name).on('click', publishNavigateLinks);
        };
        this.RemoveUser = function (user) {
            _this.navbar.find('#select' + user.name).slideUp(300);
            var removeUser = function () { return _this.navbar.find('#select' + user.name).remove(); };
            setTimeout(removeUser, 300);
        };
        this.RenderUser = function (user) {
            var html = Mustache.render(_this.template, { name: user.name });
            _this.navbar.find('ul').append(html);
        };
        this.template = $('#userListTemplate').html();
        this.navbar = $('.userNav');
        this.editButton = $('.editUsersButton');
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
        var _this = this;
        this.Show = function () {
            $('.userBox').append(_this.template);
        };
        this.Hide = function () {
            var welcomePage = $('#welcomeUser');
            if (welcomePage) {
                welcomePage.remove();
            }
        };
        this.template = $('#welcomeTemplate').html();
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
welcomePage.Show();
observer.AddEvent(Events.NavigateLinks, function () { return welcomePage.Hide(); });
observer.AddEvent(Events.NavigateUserPage, function () { return welcomePage.Hide(); });
userController.Load()
    .done(function () {
    var users = userController.GetAll();
    for (var _i = 0, users_3 = users; _i < users_3.length; _i++) {
        var user = users_3[_i];
        observer.EmitEvent(Events.UserCreated, user);
    }
    linkController.Load();
});
