import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  deposit(datos) {
    if (this.userId) {
      Deposits.insert({
        procesador: datos.procesador,
        amount: datos.amount,
        plan: datos.plan,
        userId: this.userId,
        confirmado: false,
        createdAt: new Date(),
        active: false
      })
    } else {
      return;
    }
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
    } else {
      return;
    }
  },
  cancelado() {
      if (this.userId) {
        Deposits.remove({userId: this.userId, confirmado: false})
      } else {
        return;
      }
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

    // let fondos = Deposits.find({userId: this.userId, confirmado: true, active: true});
    // let amount = 0;
    // fondos.forEach( (f) => {
    //   amount += parseFloat(f.amount);
    // })
    //
    // console.log(amount);

    //if (amount >= numero) {

      if (Meteor.users.findOne({_id: this.userId}).profile.amounts >= numero ) {
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
        return "Doesn't has sufficient money in the account"
      }





    // } else {
    //   return "Doesn't has sufficient money in the account"
    // }


  },
  changePassword2(password) {
    if (this.userId) {
      Accounts.setPassword(this.userId, password)
    } else {
      return;
    }
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



Meteor.publish('withdraws', function () {
  if (this.userId) {
     return Withdraws.find({userId: this.userId})
  } else {
    this.stop()
    return;
  }
})
