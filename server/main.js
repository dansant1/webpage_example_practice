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
        active: true
      })
    } else {
      return;
    }
  },
  confirmar() {
    if (this.userId) {
      Deposits.update({userId: this.userId, confirmado: false}, {
        $set: {
          confirmado: true
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
           'profile.payeer': datos.payeer,
           'profile.advcash': datos.advcash
         }
       })
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
