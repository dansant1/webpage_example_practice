Template.Signup.events({
  'submit form'(e, t) {
    e.preventDefault()

    if (t.find("[name='password']").value !== "" && t.find("[name='username']").value !== "" && t.find("[name='email']").value !== "" && t.find("[name='name']").value !== "" ) {
      if (t.find("[name='password']").value === t.find("[name='confirm']").value) {
        if (FlowRouter.getQueryParam("href")) {
          let id = Accounts.createUser({
            username: t.find("[name='username']").value,
            email: t.find("[name='email']").value,
            password: t.find("[name='password']").value,
            profile: {
              name: t.find("[name='name']").value
            }
          }, (err) => {
            if (err) {
              alert(err)
            } else {

              Meteor.loginWithPassword( t.find("[name='email']").value , t.find("[name='password']").value, (err) => {
                if (err) {
                  alert(err)
                } else {
                  Meteor.call('sendEmail', t.find("[name='email']").value, t.find("[name='password']").value)
                  Meteor.call('referir', FlowRouter.getQueryParam("href"))
                  FlowRouter.go('/admin')
                }
              })

            }
          })
        } else {
          Accounts.createUser({
            username: t.find("[name='username']").value,
            email: t.find("[name='email']").value,
            password: t.find("[name='password']").value,
            profile: {
              name:t.find("[name='name']").value
            }
          }, (err) => {
            if (err) {
              alert(err)
            } else {
              Meteor.loginWithPassword( t.find("[name='email']").value , t.find("[name='password']").value, (err) => {
                if (err) {
                  alert(err)
                } else {
                  Meteor.call('sendEmail', t.find("[name='email']").value, t.find("[name='password']").value)
                  FlowRouter.go('/admin')
                }
              })

            }
          })
        }

      } else {
        alert('Confirm Your Password')
      }
    } else {
      alert('Complete the form')
    }




  }
})

Template.Login.events({
  'submit form'(e, t) {
    e.preventDefault()

    if (t.find("[name='email']").value !== "" && t.find("[name='password']").value !== "") {
      Meteor.loginWithPassword( t.find("[name='email']").value , t.find("[name='password']").value, (err) => {
        if (err) {
          alert(err)
        } else {
          FlowRouter.go('/admin')
        }
      })
    } else {
      alert('Complete')
    }



  }
})

Template.AdminLayout.events({
  'click .logout'() {
    Meteor.logout()
  }
})

Template.AdminMakeDeposit.events({
  'click .deposit'() {
    Modal.show('DepositConfirmation')
  }
})

Template.AdminInicio.onCreated( () => {
  let template = Template.instance()
  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );
  template.autorun( () => {
    if (Roles.userIsInRole(Meteor.userId(), ['manager'])) {
      template.subscribe('users', template.searchQuery.get(), () => {
          setTimeout( () => {
            template.searching.set( false );
          }, 400 );
      });
      template.subscribe('d')
      template.subscribe('w')
    } else {
      template.subscribe('depositos')
      template.subscribe('withdraws')
    }

    if (FlowRouter.getQueryParam("c") == 'true' ) {

      Meteor.call('confirmar')
    } else {
      Meteor.call('cancelado')
    }

  })
})

Template.AdminInicio.events({
  'click [name="pagado"]'() {
    Meteor.call('confirmarRetiro', this._id, (err) => {
      if (err) {
        alert(err)
      }
    })
  },
  'click [name="no-pagado"]'() {
    Meteor.call('noconfirmarRetiro', this._id, (err) => {
      if (err) {
        alert(err)
      }
    })
  },
  'keyup [name="search"]' ( event, template ) {
   let value = event.target.value.trim();

   if ( value !== '' && event.keyCode === 13 ) {
     template.searchQuery.set( value );
     template.searching.set( true );
   }

   if ( value === '' ) {
     template.searchQuery.set( value );
   }
 }
})

Template.AdminInicio.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  usuarios() {
    let users = Meteor.users.find();
    if ( users ) {
      return users;
    }
  },
  fecha() {
    let rightNow = this.createdAt;
    let res = rightNow.toISOString().substring(0, 10);
    return res;
  },
  amount() {
    if (this.profile.amounts) {
        return this.profile.amounts.toFixed(2)
    } else {
      return 0
    }

  },
  depositosPorUsuario() {
    return Deposits.find({userId: this._id})
  },
  usuario() {
    return Meteor.users.findOne({_id: this.userId}).profile.name
  },
  nombre() {
    return Meteor.users.findOne({_id: this._id}).profile.name
  },
  interes() {
    return this.intereses.toFixed(2)
  },
  pm() {
    if (this.profile.pm) {
      return this.profile.pm;
    } else {
      return "No tiene";
    }
  },
  users() {
    return Meteor.users.find();
  },
  deposits() {
    return Deposits.find()
  },
  withdraws() {
    return Withdraws.find()
  },
  totalWithDrew() {
    let total = 0;
    Withdraws.find({pagado: true}).forEach( (w) => {
      total += parseFloat(w.cantidad)
    })

    return total
  },
  PendingWithDrawTotal() {
    let total = 0;
    Withdraws.find({pagado: false}).forEach( (w) => {
      total += parseFloat(w.cantidad)
    })

    return total
  },
  lastWithdraw() {
    let number = Withdraws.find().fetch().length

    if (number > 0) {
      return Withdraws.find().fetch()[number - 1].cantidad;
    } else {
        return 0
    }

  },
  totalPM() {
    let total = 0;
    Deposits.find({procesador: 1}).forEach((d) => {
      total = total + parseFloat(d.amount)
    })

    return total;
  },
  totalPayeer() {
    let total = 0;
    Deposits.find({procesador: 2}).forEach((d) => {
      total = total + parseFloat(d.amount)
    })

    return total;
  },
  totalADVCash() {
    let total = 0;
    Deposits.find({procesador: 3}).forEach((d) => {
      total = total + parseFloat(d.amount)
    })

    return total;
  },
  total() {
    let total = 0;
    Deposits.find().forEach((d) => {
      total = total + parseFloat(d.amount)
    })

    return total;
  },
  lastDeposit() {
    let numero = Deposits.find().fetch().length - 1;
    return Deposits.find().fetch()[numero].amount;
  },
  activeDeposit() {
    let total = 0;

    Deposits.find({active: true}).forEach( (d) => {
      total = total + parseFloat(d.amount)
    })

    return total
  },
  email() {
    return Meteor.users.findOne({_id: this._id}).emails[0].address;
  }
})

Template.AdminDepositList.onCreated( () => {
  let template = Template.instance()
  template.autorun( () => {
    template.subscribe('depositos')
  })
})

Template.AdminDepositList.helpers({
  interes() {
    return this.intereses.toFixed(2)
  },
  total() {
    return parseFloat(this.amount ) + parseFloat(this.intereses.toFixed(2))
  },
   plan1() {
    return Deposits.find({plan: 1})
  },
  plan2() {
    return Deposits.find({plan: 2})
  },
  plan3() {
    return Deposits.find({plan: 3})
  },
  fecha() {
    let rightNow = this.createdAt;
    let res = rightNow.toISOString().substring(0, 10);
    return res;
  }
})

Template.AdminMakeDeposit.onCreated( () => {
  let template = Template.instance()
  template.amount = new ReactiveVar(10)
})

Template.AdminMakeDeposit.helpers({
  amount() {
    console.log(Template.instance().amount.get());
    return Template.instance().amount.get()
  }
})

Template.AdminMakeDeposit.onCreated( () => {
    let template = Template.instance()

    template.autorun( () => {
      Meteor.call('cancelado')
    })

})

Template.AdminMakeDeposit.events({
  'keyup #amount'(e, t) {
    t.amount.set(e.target.value)
    //console.log(e.target.value);
  },
  'click .ppm'(e, t) {
    let plan;

    if ($('.p1').is(':checked')) {
      plan = 1;
    } else if ($('.p2').is(':checked')) {
      plan = 2;
    } else {
      plan = 3
    }
    let datos = {
      procesador: 1,
      plan: plan,
      amount: t.amount.get()
    }

    if (datos.amount > 0 ) {
      Meteor.call('deposit', datos, (err) => {
        if (err) {
          alert(err)
        }
      })
    } else {
      alert('Amount denied')
    }
  }

})


Template.AdminSettings.helpers({
  email() {
    return Meteor.user().emails[0].address
  }
})

Template.AdminSettings.events({
  'click .save'(e, t) {
    let datos = {
      name: t.find("[name='name']").value,
      pm: t.find("[name='pm']").value,

    }

    Meteor.call('actualizarInfo', datos, (err) => {
      if (err) {
        alert(err)
      } else {
        alert('Data Saved')
      }
    })
  },
  'click .change-password'(e, t) {
    let password = t.find("[name='password']").value;
    let confirm = t.find("[name='confirm']").value;

    if (password === confirm) {
      Meteor.call('changePassword2', password, (err) => {
        if (err) {
          alert(err)
        } else {
          alert('Password Changed')
        }
      })
    } else {
      alert('Put the same password')
    }

  }
})

Template.AdminWithDraw.events({
  'click [name="retirar"]'(e, t) {
    let cantidad = t.find('[name="cantidad"]').value
    if ( cantidad !== "") {
      Meteor.call('makeWithdraw', cantidad, (err, r) => {
        if (err) {
          t.find('[name="cantidad"]').value = ""
          alert(err)
        } else {
          t.find('[name="cantidad"]').value = ""
          alert(r)
        }
      })
    } else {
      alert('Complete fields');
    }
  }
})

Template.AdminWithDrawList.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('withdraws')
  })
})

Template.AdminWithDrawList.helpers({
  withdraws() {
    return Withdraws.find({})
  },
  fecha() {
    var today = this.createdAt;
    var dd = today.getDate();
    var mm = today.getMonth()+1;

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    return dd+'/'+mm+'/'+yyyy;
  }
})

Template.Home.onCreated(() => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('d2')
    template.subscribe('w2')
    template.subscribe('u2')
  })
})

Template.Home.helpers({
  ref() {
    let ref = FlowRouter.getQueryParam('href')
    if (ref) {
      return '?href=' + ref
    } else {
      return ''
    }
  },
  Totalaccounts() {
    return Meteor.users.find().fetch().length - 1;
  },
  TotalActiveAccounts() {
    return Meteor.users.find({'profile.active': true}).fetch().length
  },
  TotalDeposit() {
    let t = 0;

    Deposits.find({confirmado: true}).forEach( (d) => {
      t += parseFloat(d.amount)
    })

    return t;
  },
  totalWithDrawn() {
    let total = 0
    Withdraws.find().forEach( (w) => {
      total += parseFloat(w.cantidad)
      console.log(total);
    })

    return total
  }
})

Template.Home.events({
  'submit form'(e, t) {
    e.preventDefault()
    let email = t.find('[name="email"]').value;
    let password = t.find('[name="password"]').value;
    if (email !== "" && password !== "") {
      Meteor.loginWithPassword(email, password, (err) => {
        if (err) {
          console.log(err);
        } else {
          FlowRouter.go('/admin')
        }
      })
    }
  }
})

Template.support.events({
  'submit form'(e, t) {
    e.preventDefault()
    let email = t.find("[name='email']").value = ""
    let nombre = t.find("[name='name']").value = ""
    let comment = t.find("[name='comments']").value = ""

    alert("We'll respond you in 24 hours" )
  }
})

Template.AdminReferals.onCreated( () => {
  let template = Template.instance()

  template.autorun( () => {
    template.subscribe('referidos')
  })
})

Template.AdminReferals.helpers({
  email() {
    return Meteor.user().username
  },
  referidos() {
    return Meteor.users.find({'profile.referId': Meteor.userId()})
  }
})
