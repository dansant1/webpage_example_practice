import { Meteor } from 'meteor/meteor';


Meteor.methods({
  setTheme(datos) {
      if (this.userId) {
        datos.createdAt = new Date()
        if (Theme.find().fetch().length > 0) {
          Theme.update({} , {
            $set: {
                name: datos.name,
                email: datos.email,
                address: datos.address,
                time: datos.time,
                title: datos.title,
                subtitle: datos.subtitle,
                texto: datos.texto,
                color: datos.color,
                createdAt: datos.createdAt
            }
          })
        } else {
          Theme.insert(datos)
        }

      } else {
        return;
      }
  },
  confirmarRetiro(retiroId) {
    Withdraws.update({_id: retiroId}, {
      $set: {
        pagado: true
      }
    })
  },
  noconfirmarRetiro(retiroId) {
    Withdraws.update({_id: retiroId}, {
      $set: {
        pagado: false
      }
    })
  },
  deposit(datos) {

    if (this.userId) {

      let depositId = Deposits.insert({
        procesador: datos.procesador,
        amount: datos.amount,
        plan: datos.plan,
        userId: this.userId,
        confirmado: false,
        createdAt: new Date(),
        active: false,
        intereses: 0,
        dias: 0
      })

    } else {
      return;
    }

  },
  confirmarBitcoin(_id) {
      Bitcoins.update({_id}, {
        $set: {
          confirmado: true
        }
      })

      let datos = Bitcoins.findOne({_id})

      Deposits.insert({
          procesador: datos.procesador,
          amount: datos.amount,
          plan: datos.plan,
          userId: this.userId,
          confirmado: true,
          createdAt: new Date(),
          active: true,
          intereses: 0,
          dias: 0
      })

      Meteor.users.update({_id: this.userId}, {
        $set: {
          'profile.active': true
        }
      })
  },
  confirmar() {
    if (this.userId) {
      Deposits.update({userId: this.userId, confirmado: false}, {
        $set: {
          confirmado: true,
          active: true
        }
      })
      let total = 0;
      Deposits.find({userId: this.userId, confirmado: true, active: true}).forEach( (m) => {
        total += parseFloat(m.amount);
      })

      Meteor.users.update({_id: this.userId}, {
        $inc: {
          'profile.amounts': total
        }
      })

      Meteor.users.update({_id: this.userId}, {
        $set: {
          'profile.active': true
        }
      })

    } else {
      return;
    }
  },
  createDeposit(datos) {
    if (this.userId) {
      console.log(datos)
      Deposits.insert({
        procesador: datos.procesador,
        amount: datos.amount,
        plan: 1,
        userId: datos.user,
        confirmado: true,
        createdAt: new Date(),
        active: true,
        intereses: 0,
        dias: 0

      })
     /* Deposits.update({userId: this.userId, confirmado: false}, {
        $set: {
          confirmado: true,
          active: true
        }
      })*/

      let total = 0;
      Deposits.find({userId: datos.user, confirmado: true, active: true}).forEach( (m) => {
        total += parseFloat(m.amount);
      })

      Meteor.users.update({_id: datos.user}, {
        $inc: {
          'profile.amounts': total
        }
      })

      Meteor.users.update({_id: datos.user}, {
        $set: {
          'profile.active': true
        }
      })

    } else {
      return;
    }
  },
  cancelado() {
      Deposits.remove({userId: this.userId, confirmado: false})   
  },
  actualizarInfo(datos) {
    if (this.userId) {
       Meteor.users.update({_id: this.userId}, {
         $set: {
           'profile.name': datos.name,
           'profile.pm': datos.pm,
           'profile.payeer': datos.payeer,
           'profile.bitcoin': datos.bitcoin
         }
       })
    } else {
      return;
    }
  },
  makeWithdraw(numero) {

        numero = parseFloat(numero)
        
        let retiros = 0
        Withdraws.find({userId: this.userId, pagado: true}).forEach( w => {
          retiros += parseFloat(w.cantidad)
        })

        retiros = parseFloat(retiros)
        
        let total1 = 0;

        Deposits.find({userId: this.userId, confirmado: true}).forEach( p => {
          
          if (p.plan === 1) {
            total1 += parseFloat((p.intereses.toFixed(5) - (p.amount * 0.00000038/3) ).toFixed(5))
          } else if (p.plan === 2) {
            total1 += parseFloat((p.intereses.toFixed(5) - (p.amount * 0.00000038/3) ).toFixed(5))
          } else if (p.plan === 3) {
            total1 += parseFloat(( p.intereses.toFixed(5) - (p.amount * 0.00000038/3) ).toFixed(5))
          }
        })


        total1.toFixed(5)

        //Referidos
        let totals = 0;
        Meteor.users.find({'profile.referId': Meteor.userId()}).forEach( (e) => {
          Deposits.find({userId: e._id}).forEach( (d) => {
            totals += parseFloat(d.amount)
          })
        }) 

        let earn = totals/100*12

        let disponible = earn + total1 - retiros
       

        if ( numero <= ( earn + total1 - retiros ) ) {
          Withdraws.insert({
            userId: this.userId,
            createdAt: new Date(),
            cantidad: numero,
            pagado: false
          })

          let total = Meteor.users.findOne({_id: this.userId}).profile.amounts - numero;

          Meteor.users.update({_id: this.userId}, {
            $set: {
              'profile.amounts': total
            }
          })

          return 'Pending of Confirm';
        } else {
          return "You don't have enought balance for this operation"
        }

        
      
  },
  eliminarRetiro(_id) {
    if ( this.userId ) {
      Withdraws.remove({_id})
    } else {
      return;
    }
  },
  changePassword2(password) {
    if (this.userId) {
      Accounts.setPassword(this.userId, password)
    } else {
      return;
    }
  },
  referir(username) {
   
    Meteor.users.update({_id: this.userId}, {
      $set: {
        'profile.referId': Meteor.users.findOne({username: username})._id
      }
    })
  },
  sendEmail(email, password) {
    let nombre = Meteor.users.findOne({_id: this.userId}).profile.name;

    let texto = "Hello " + nombre + ", Thank you for registration on our site. Your login information: Login: " + email + " Password: " + password + " You can login here: https://epminvest.grupoddv.com Contact us immediately if you did not authorize this registration. Thank you."
    Meteor.defer( function () {
     /* Email.send({
        to: email,
        from: 'contact@grupoddv.com',
        subject: "Welcome to EPM Invest",
        text: texto
      })*/
    })
  }
})

// Publish

Meteor.publish('depositos', function () {
  if (this.userId) {
     return Deposits.find({userId: this.userId, confirmado: true})
  } else {
    this.stop()
    return;
  }
})

Meteor.publish('referidos', function () {
  if (this.userId) {

     return Meteor.users.find({'profile.referId': this.userId})
  } else {
    this.stop()
    return;
  }
})


Meteor.publish('d', function () {
  if (Roles.userIsInRole(this.userId, ['manager'])) {
     return Deposits.find({confirmado: true})
  } else {
    this.stop()
    return
  }
})

Meteor.publish('d2', function () {

     return Deposits.find({confirmado: true})

})

Meteor.publish('w', function () {
  if (Roles.userIsInRole(this.userId, ['manager'])) {
     return Withdraws.find({})
  } else {
    this.stop()
    return;
  }
})

Meteor.publish('depositosPorReferidos', function () {
  if (this.userId) {
     return Deposits.find({active: true}, {
      fields: {
        "amount": 1,
        "userId": 1
      }})
  } else {
    this.stop()
    return;
  }
})


Meteor.publish('b', function () {
  if (Roles.userIsInRole(this.userId, ['manager'])) {
     return Bitcoins.find({})
  } else {
    this.stop()
    return;
  }
})

Meteor.publish('w2', function () {

     return Withdraws.find({})

})

Meteor.publish('withdraws', function () {
  if (this.userId) {
     return Withdraws.find({userId: this.userId})
  } else {
    this.stop()
    return;
  }
})


Meteor.publish('u2', function () {

  if (Roles.userIsInRole(this.userId, ['manager'])) {
     return Meteor.users.find()
  } else {
    return Meteor.users.find({}, {
      fields: {
        "profile.name": 1,
      }})
  }

     

})

Meteor.publish('u3', function () {

  if (Roles.userIsInRole(this.userId, ['manager'])) {
     return Meteor.users.find()
  } else {
    return Meteor.users.find({}, {
      fields: {
        "emails": 1,
      }})
  }

     

})

Meteor.publish('theme', function () {

     return Theme.find()

})

Meteor.publish('users', function (search) {
  if (Roles.userIsInRole(this.userId, ['manager'])) {
    //check( search, Match.OneOf( String, null, undefined ) );

  let query      = {},
      projection = { limit: 100, sort: { 'profile.name': 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { 'profile.name': regex }
      ]
    };

    projection.limit = 100;
  }

  return Meteor.users.find( query, projection );
    //return Meteor.users.find();
  } else {
    this.stop()
    return;
  }

})

SyncedCron.add({
  name: 'Intereses',
  schedule: function(parser) {
    return parser.text('every 1 hour');
    //return parser.text('every 1 seconds');
  },
  job: function() {

    Meteor.users.find().forEach( (user) => {
      let totalRetiros = 0.00
      let retiros = Withdraws.find({userId: user._id})
      retiros.forEach((r) => {
        totalRetiros += parseFloat(r.cantidad);
      })

      let totalDeposits = 0.00
      let depositos = Deposits.find({userId: user._id, active: true})
      depositos.forEach( (de) => {
        totalDeposits += parseFloat(de.intereses);
      })

      console.log(totalDeposits);

      let totalAmount = parseFloat(totalDeposits) //- parseFloat(totalRetiros)

      console.log(totalAmount);

      Meteor.users.update({_id: user._id}, {
        $inc: {
          'profile.amounts': totalAmount
        }
      })
    })

    let intereses = 0;
    console.log('INICIO')
    Deposits.find({active: true}).forEach( (d) => {

      if (d.plan === 1) {
        intereses = (d.amount / 100 * 0.38/3) 
        console.log('INTERESES: ', intereses)
        
        Deposits.update({ _id: d._id, active: true }, {
          $inc: {
            intereses: intereses,
            dias: 1
          }
        })



      } else if (d.plan === 2) {
        intereses = (d.amount / 100 * 0.38/3) 
        console.log('INTERESES: ', intereses)
        
        Deposits.update({ _id: d._id, active: true }, {
          $inc: {
            intereses: intereses,
            dias: 1
          }
        })

      } else if (d.plan === 3) {
        intereses = (d.amount / 100 * 0.38/3) 
        console.log('INTERESES: ', intereses)
        
        Deposits.update({ _id: d._id, active: true }, {
          $inc: {
            intereses: intereses,
            dias: 1
          }
        })
      } 

    })

        console.log('FIN')

    Deposits.find({ plan: 1,  dias: { $gt: 10000}  }).forEach( (p) => {
      Deposits.update({ _id: p._id }, {
        $set: {
          active: false
        }
      })
    })

    Deposits.find({ plan: 2,  dias: { $gt: 10000}  }).forEach( (p) => {
      Deposits.update({ _id: p._id }, {
        $set: {
          active: false
        }
      })
    })

    Deposits.find({ plan: 3,  dias: { $gt: 10000}  }).forEach( (p) => {
      Deposits.update({ _id: p._id }, {
        $set: {
          active: false
        }
      })
    })
    
  }
});

Meteor.startup( function () {
 let nuevo = ""
  Accounts.setPassword(nuevo, "password")
  let users = [{nombre: "Admin", email: "admin@goldinvest.trade"},
                {nombre: "Admin", email: "manager@goldinvest.trade"}]
  
     _.each(users, ( user ) => {
  
     		let id;
  
      	  id = Accounts.createUser({
       	         email: user.email,
      	         password: "developer24",
    	         profile: { name: user.nombre }
      	    })
          Roles.addUsersToRoles(id, 'manager');
     });
   console.log('Listo!');
  process.env.MAIL_URL = "smtp://postmaster@m.financex.trade:bb2222e118d98fa0789f1a322d9a415e@smtp.mailgun.org:587";

  SyncedCron.start();
})
