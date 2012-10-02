/**
 * Created with IntelliJ IDEA.
 * User: EBorshch
 */

//Load application with JQuery when DOM is ready
$(function () {


    /**********************************************************************************
     **                     Models
     **********************************************************************************/
    var Contact = Backbone.Model.extend(
        {
            // Default attributes for the Contact item
            defaults:function () {
                return {
                    name:"",
                    email:"",
                    phone:"No phone no cry"
                };
            },

            validation:{
                name:{
                    minLength:5,
                    msg:'Please enter a name'
                },
                phone:{
                    minLength:5,
                    pattern:'number',
                    msg:'Please enter a valid phone number'
                },
                email:{
                    pattern:'email',
                    minLength:5,
                    msg:'Please enter a valid email'
                }
            }
        }
    ); //Backbone.Model.extend end


    // The collection of contacts

    var ContactCollection = Backbone.Collection.extend(
        {
            model:Contact,
            localStorage:new Backbone.LocalStorage("phone-backbone"),

            comparator:function (contact) {
                return contact.get("name");
            }
        }
    );


    /**********************************************************************************
     **                     Views
     **********************************************************************************/
    var ContactListView = Backbone.View.extend(
        {
            el:$("#contact-list-block"), // DOM element with contact list


            template:_.template($('#contact-list-template').html()),

            initialize:function () {
                this.model.on('change', this.render, this);
                // this.model.on('destroy', this.remove, this);
            },

            render:function () {

                $(this.el).html(this.template({contact:this.model.toJSON()}));
                return this;
            }

        }
    );


    var ContactDetailsView = Backbone.View.extend(
        {
            el:$("#contact-details-block"), // DOM element with contact details


            template:_.template($('#contact-details-template').html()),

            events:{
                "click  #form-btn":"updateContact"

            },

            render:function () {
                $(this.el).html(this.template({contact:this.model.toJSON()}));

                Backbone.Validation.bind(this, {
                    valid:function (view, attr) {
                        var control;
                        if (attr == 'name')
                            control = $('#inputName');
                        var control;
                        if (attr == 'phone')
                            control = $('#inputPhone');
                        var control;
                        if (attr == 'email')
                            control = $('#inputEmail');
                        if (control != undefined) {
                            var group = control.parents(".control-group");
                            group.removeClass("error");
                        }
                    },
                    invalid:function (view, attr, error, selector) {
                        var control;
                        if (attr == 'name')
                            control = $('#inputName');
                        var control;
                        if (attr == 'phone')
                            control = $('#inputPhone');
                        var control;
                        if (attr == 'email')
                            control = $('#inputEmail');
                        if (control != undefined) {
                            var group = control.parents(".control-group");
                            group.addClass("error");
                        }

                    }
                });
                return this;
            },

            updateContact:function (e) {
                e.preventDefault();
                var newName = this.$("#inputName").val();
                var newPhone = this.$("#inputPhone").val();
                var newEmail = this.$("#inputEmail").val();

                this.model.set({name:newName, phone:newPhone, email:newEmail});
                var success;
                if (this.model.isNew()) {
                    console.log(this.model.isNew() + " is new");
                    sucess = contactCollection.create(this.model);
                }
                else {
                    sucess = this.model.save();
                }
                console.log(success);
                if (success) {
                    controller.navigate("!/", {trigger:true});
                }
            },

            close:function () {
                $(this.el).unbind();
                $(this.el).empty();
            }
        }
    );

    /**********************************************************************************
     **                     Router
     **********************************************************************************/



    var Controller = Backbone.Router.extend({
        routes:{
            "":"list",
            "!/":"list",
            "!/contact/:id":"details",
            "!/add":"add"
        },

        list:function () {
            if (this.contactView) {
                this.contactView.close();
            }
        },

        details:function (id) {
            var item = contactCollection.get(id);
            if (this.contactView) {
                this.contactView.close();
            }

            this.contactView = new ContactDetailsView({model:item});
            this.contactView.render();
        },

        add:function () {
            var item = new Contact();
            if (this.contactView) {
                this.contactView.close();
            }

            this.contactView = new ContactDetailsView({model:item});
            this.contactView.render();
        }


    });

    var controller = new Controller();

    Backbone.history.start();
    //TEST INIT
    var contactCollection = new ContactCollection();


    var contactView = new ContactListView({model:contactCollection});

    contactCollection.create({
        name:"John Smith",
        phone:"144412311231",
        email:"john@smith.com"
    });

    contactCollection.create({
        name:"Alison Burgers",
        phone:"2223333543",
        email:"alison@burgers.com"
    });

    contactCollection.create({
        name:"Ben Roonie",
        phone:"4444444",
        email:"ben@roonie.com"
    });

});