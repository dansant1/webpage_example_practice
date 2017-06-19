import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
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
        dias: 0,
        bitcoin: datos.bitcoin
      })

      if (datos.bitcoin) {

        Bitcoins.insert({
          procesador: datos.procesador,
          amount: datos.amount,
          plan: datos.plan,
          userId: this.userId,
          confirmado: false,
          createdAt: new Date(),
          active: false,
          intereses: 0,
          dias: 0,
        })

      }

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
  cancelado() {
      Deposits.remove({userId: this.userId, confirmado: false})   
  },
  actualizarInfo(datos) {
    if (this.userId) {
       Meteor.users.update({_id: this.userId}, {
         $set: {
           'profile.name': datos.name,
           'profile.pm': datos.pm,

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
            total1 += parseFloat((p.intereses.toFixed(2) - (p.amount * 0.12) ).toFixed(2))
          } else if (p.plan === 2) {
            total1 += parseFloat((p.intereses.toFixed(2) - (p.amount * 0.07) ).toFixed(2))
          } else if (p.plan === 3) {
            total1 += parseFloat(( p.intereses.toFixed(2) - (p.amount * 0.06) ).toFixed(2))
          }
        })


        total1.toFixed(2)

        console.log(retiros)

        console.log('TOTAL: ', total1 - retiros)

        if ( numero <= (total1 - retiros) ) {
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
  changePassword2(password) {
    if (this.userId) {
      Accounts.setPassword(this.userId, password)
    } else {
      return;
    }
  },
  referir(username) {
    console.log(username);
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

     return Meteor.users.find()

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
        intereses = (d.amount / 100 * 12) 
        console.log('INTERESES: ', intereses)
        
        Deposits.update({ _id: d._id, active: true }, {
          $inc: {
            intereses: intereses,
            dias: 1
          }
        })



      } else if (d.plan === 2) {
        intereses = (d.amount / 100 * 7) 
        console.log('INTERESES: ', intereses)
        
        Deposits.update({ _id: d._id, active: true }, {
          $inc: {
            intereses: intereses,
            dias: 1
          }
        })

      } else if (d.plan === 3) {
        intereses = (d.amount / 100 * 6) 
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

    Deposits.find({ plan: 1,  dias: { $gt: 10}  }).forEach( (p) => {
      Deposits.update({ _id: p._id }, {
        $set: {
          active: false
        }
      })
    })

    Deposits.find({ plan: 2,  dias: { $gt: 22}  }).forEach( (p) => {
      Deposits.update({ _id: p._id }, {
        $set: {
          active: false
        }
      })
    })

    Deposits.find({ plan: 3,  dias: { $gt: 36}  }).forEach( (p) => {
      Deposits.update({ _id: p._id }, {
        $set: {
          active: false
        }
      })
    })

    /*Deposits.find({ plan: 4,  dias: { $gt: 22}  }).forEach( (p) => {
      Deposits.update({ _id: p._id }, {
        $set: {
          active: false
        }
      })
    })*/



    

  }
});

Meteor.startup( function () {
  /*let users = [{nombre: "Admin", email: "manager@dvinvest.com"}]
  
     _.each(users, ( user ) => {
  
     		let id;
  
      	  id = Accounts.createUser({
       	         email: user.email,
      	         password: "developer24",
    	         profile: { name: user.nombre }
      	    })
          Roles.addUsersToRoles(id, 'manager');
     });
   console.log('Listo!');*/
  //process.env.MAIL_URL = "smtp://postmaster@m.financex.trade:bb2222e118d98fa0789f1a322d9a415e@smtp.mailgun.org:587";

  SyncedCron.start();
})
