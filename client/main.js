function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function SHA256(s){

 


    var chrsz   = 8;


    var hexcase = 0;

 


    function safe_add (x, y) {


        var lsw = (x & 0xFFFF) + (y & 0xFFFF);


        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);


        return (msw << 16) | (lsw & 0xFFFF);


    }

 


    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }


    function R (X, n) { return ( X >>> n ); }


    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }


    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }


    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }


    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }


    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }


    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

 


    function core_sha256 (m, l) {


        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);


        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);


        var W = new Array(64);


        var a, b, c, d, e, f, g, h, i, j;


        var T1, T2;

 


        m[l >> 5] |= 0x80 << (24 - l % 32);


        m[((l + 64 >> 9) << 4) + 15] = l;

 


        for ( var i = 0; i<m.length; i+=16 ) {


            a = HASH[0];


            b = HASH[1];


            c = HASH[2];


            d = HASH[3];


            e = HASH[4];


            f = HASH[5];


            g = HASH[6];


            h = HASH[7];

 


            for ( var j = 0; j<64; j++) {


                if (j < 16) W[j] = m[j + i];


                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

 


                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);


                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

 


                h = g;


                g = f;


                f = e;


                e = safe_add(d, T1);


                d = c;


                c = b;


                b = a;


                a = safe_add(T1, T2);


            }

 


            HASH[0] = safe_add(a, HASH[0]);


            HASH[1] = safe_add(b, HASH[1]);


            HASH[2] = safe_add(c, HASH[2]);


            HASH[3] = safe_add(d, HASH[3]);


            HASH[4] = safe_add(e, HASH[4]);


            HASH[5] = safe_add(f, HASH[5]);


            HASH[6] = safe_add(g, HASH[6]);


            HASH[7] = safe_add(h, HASH[7]);


        }


        return HASH;


    }

 


    function str2binb (str) {


        var bin = Array();


        var mask = (1 << chrsz) - 1;


        for(var i = 0; i < str.length * chrsz; i += chrsz) {


            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);


        }


        return bin;


    }

 


    function Utf8Encode(string) {


        string = string.replace(/\r\n/g,"\n");


        var utftext = "";

 


        for (var n = 0; n < string.length; n++) {

 


            var c = string.charCodeAt(n);

 


            if (c < 128) {


                utftext += String.fromCharCode(c);


            }


            else if((c > 127) && (c < 2048)) {


                utftext += String.fromCharCode((c >> 6) | 192);


                utftext += String.fromCharCode((c & 63) | 128);


            }


            else {


                utftext += String.fromCharCode((c >> 12) | 224);


                utftext += String.fromCharCode(((c >> 6) & 63) | 128);


                utftext += String.fromCharCode((c & 63) | 128);


            }

 


        }

 


        return utftext;


    }

 


    function binb2hex (binarray) {


        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";


        var str = "";


        for(var i = 0; i < binarray.length * 4; i++) {


            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +


            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);


        }


        return str;


    }

 


    s = Utf8Encode(s);


    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

 

}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

Template.Home.onRendered( () => {
  $( window ).scroll(function() {
    if ($(window).scrollTop() > 110) {
      $( ".float__menu" ).addClass("top")
      $( ".wrap__image" ).addClass("reduce")
      
    } else {
      $( ".float__menu" ).removeClass("top")
      $( ".wrap__image" ).removeClass("reduce")
      
    }
  });
}) 

Template.Signup.events({
  'click .login-button'(e, t) {
    e.preventDefault()


    if (t.find("[name='password']").value !== "" && t.find("[name='username']").value !== "" && t.find("[name='email']").value !== "" && t.find("[name='name']").value !== "" ) {
      $('.save').attr('disabled','disabled');
      if (t.find("[name='password']").value === t.find("[name='confirm']").value) {
        if (FlowRouter.getQueryParam("href")) {
          let id = Accounts.createUser({
            username: t.find("[name='username']").value,
            email: t.find("[name='email']").value,
            password: t.find("[name='password']").value,
            profile: {
              name: t.find("[name='name']").value,
              pm: t.find("[name='pm']").value,
              payeer: t.find("[name='payeer']").value,
              bitcoin: t.find("[name='bitcoin']").value
            }
          }, (err) => {
            //u
            if (err) {
              alert(err)
              $('.save').removeAttr('disabled');
            } else {

              Meteor.loginWithPassword( t.find("[name='email']").value , t.find("[name='password']").value, (err) => {
                if (err) {
                  alert(err)
                  $('.save').removeAttr('disabled');
                } else {
                  analytics.identify( Meteor.userId(), {
                    email: Meteor.user().emails[0].address,
                    name: Meteor.user().profile.name
                  });
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
              name:t.find("[name='name']").value,
              pm: t.find("[name='pm']").value,
              payeer: t.find("[name='payeer']").value,
              bitcoin: t.find("[name='bitcoin']").value
            }
          }, (err) => {
            if (err) {
              alert(err)
              $('.save').removeAttr('disabled');
            } else {
               

              Meteor.loginWithPassword( t.find("[name='email']").value , t.find("[name='password']").value, (err) => {
                if (err) {
                  alert(err)
                  $('.save').removeAttr('disabled');
                 
                } else {
                  analytics.identify( Meteor.userId(), {
                    email: Meteor.user().emails[0].address,
                    name: Meteor.user().profile.name
                  });
                  Meteor.call('sendEmail', t.find("[name='email']").value, t.find("[name='password']").value)
                  FlowRouter.go('/admin')
                }
              })



            }
          })
        }

      } else {
        alert('Confirm Your Password')
        $('.save').removeAttr('disabled');
      }
    } else {
      alert('Complete the form')
      $('.save').removeAttr('disabled');
    }




  }
})

Template.menu.events({
  'click .logout'() {
    Meteor.logout()
    analytics.track( 'Logout', {
      title: 'Usuario se deslogeo'
    });
  }
})

Template.Login.events({
  'click .login-button'(e, t) {
    e.preventDefault()

    if (t.find("[name='email']").value !== "" && t.find("[name='password']").value !== "") {
      Meteor.loginWithPassword( t.find("[name='email']").value , t.find("[name='password']").value, (err) => {
        if (err) {
          alert(err)
        } else {
          analytics.identify( Meteor.userId(), {
                    email: Meteor.user().emails[0].address,
                    name: Meteor.user().profile.name
                  });
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
    FlowRouter.go('/')
  },
  'click .dep'() {
    analytics.track( 'Deposito', {
      title: 'Usuario ingreso a la pagina de deposito'
    });
  },
  'click .with'() {
    analytics.track( 'Retiro - Withdraw', {
      title: 'Usuario ingreso a la pagina de retiro - withdraw'
    });
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
      template.subscribe('b')
    } else {
      template.subscribe('depositos')
      template.subscribe('withdraws')
    }

    if (FlowRouter.getQueryParam("c") == 'true' ) {

      Meteor.call('confirmar', (err) => {
        if (!err) {
           analytics.track( 'Deposito', {
              title: 'Usuario finalizo el deposito '
            });
        }
      })
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
  'click .confirmar-bitcoin'() {
  
    Meteor.call('confirmarBitcoin', this._id)
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
  isBitcoin() {
    console.log(this.bitcoin)
    return this.bitcoin
  },
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
  interes1() {

    if (this.plan === 1) {
      return (this.intereses - (this.amount * 0.00000033) ).toFixed(5)
    } else if (this.plan === 2) {
      return (this.intereses.toFixed(2) - (this.amount * 0.00000038) ).toFixed(5)
    } else if (this.plan === 3) {
      return ( this.intereses.toFixed(2) - (this.amount * 0.00000042) ).toFixed(5)
    }
   
    
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
  bitcoinDeposits() {
    return Bitcoins.find()
  },
  totalWithDrew() {
    let total = 0;

    Deposits.find().forEach( p => {
      
      if (p.plan === 1) {
        total += parseFloat((p.intereses.toFixed(5) - (p.amount * 0.00000033) ).toFixed(5))
      } else if (p.plan === 2) {
        total += parseFloat((p.intereses.toFixed(5) - (p.amount * 0.00000038) ).toFixed(5))
      } else if (p.plan === 3) {
        total += parseFloat(( p.intereses.toFixed(5) - (p.amount * 0.00000042) ).toFixed(5))
      }
    })


    return total
  },
  WithDrew() {
    let total = 0;
    Withdraws.find({pagado: false}).forEach( (w) => {
      total += parseFloat(w.cantidad)
    })

    return total.toFixed(5)
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
  totalBitcoin() {
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
  interes1() {
    let interes = (this.intereses - (this.amount * 0.00000033) ).toFixed(5)

    if ( interes <= 0) {
      return 0
    } 

    return interes 
  },
  interes2() {
    let interes = (this.intereses.toFixed(2) - (this.amount * 0.00000038) ).toFixed(5)
    if ( interes <= 0) {
      return 0
    } 

    return interes 
    

  },
  interes3() {
    let interes =  ( this.intereses.toFixed(2) - (this.amount * 0.00000042) ).toFixed(5)

    if ( interes <= 0) {
      return 0
    } 

    return interes 
    

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
  plan4() {
    return Deposits.find({plan: 4})
  },
  fecha() {
    let rightNow = this.createdAt;
    let res = rightNow.toISOString().substring(0, 10);
    return res;
  }
})

Template.AdminMakeDeposit.onCreated( () => {
  let template = Template.instance()
  template.amount = new ReactiveVar(0.01)
})

Template.AdminMakeDeposit.helpers({
  amount() {
    
    return Template.instance().amount.get()
  },
  sign() {
   
    return Template.instance().sign.get()
    
    
  }
})



Template.AdminMakeDeposit.onCreated( () => {
    let template = Template.instance()

    template.sign = new ReactiveVar();

    template.autorun( () => {
      Meteor.call('cancelado')
    })

})

Template.AdminMakeDeposit.events({
  'keyup #amount'(e, t) {
    t.amount.set(e.target.value)
    let m_shop = "366349551";
    let m_orderid = "1";
    let m_amount = e.target.value
    m_amount = parseFloat(m_amount).toFixed(2)
    let m_curr = "USD"
    let m_desc = "UGF5IHRvIEZYVFJBREU=";
    let m_key = Meteor.settings.public.payeer;

    let str = [m_shop, m_orderid, m_amount, m_curr, m_desc, m_key]
    let list = [];
    let words;

    let l = str.join(":")

   
    
    let sign = SHA256(l).toUpperCase();

    t.sign.set(sign)
  },
  'click .ppm'(e, t) {
    let plan;

    if ($('.p1').is(':checked')) {
      plan = 1;
    } else if ($('.p2').is(':checked')) {
      plan = 2;
    } else if ($('.p3').is(':checked')) {
      plan = 3
    } else {
      plan = 4
    }

    let datos = {
      procesador: 1,
      plan: plan,
      amount: t.amount.get(),
      bitcoin: false
    }

    if (datos.amount > 0 ) {
      Meteor.call('deposit', datos, (err) => {
        if (err) {
          alert(err)
        } else {
           analytics.track( 'Deposito', {
              title: 'Usuario inicio el proceso de deposito port ' + t.amount.get(),
            });
        }
      })
    } else {
      alert('Amount denied')
    }
  },
  'click .payeer'(e, t) {
    let plan;

    if ($('.p1').is(':checked')) {
      plan = 1;
    } else if ($('.p2').is(':checked')) {
      plan = 2;
    } else if ($('.p3').is(':checked')) {
      plan = 3
    } else {
      plan = 4
    }

    let datos = {
      procesador: 2,
      plan: plan,
      amount: t.amount.get(),
      bitcoin: false
    }

    if (datos.amount > 0 ) {
      Meteor.call('deposit', datos, (err) => {
        if (err) {
          alert(err)
        } else {
           analytics.track( 'Deposito', {
              title: 'Usuario inicio el proceso de deposito por ' + t.amount.get(),
            
            });
        }
      })
    } else {
      alert('Amount denied')
    }
  },
  'click .bitcoin'(e, t) {

    let plan;

    if ($('.p1').is(':checked')) {
      plan = 1;
    } else if ($('.p2').is(':checked')) {
      plan = 2;
    } else if ($('.p3').is(':checked')) {
      plan = 3
    } else {
      plan = 4
    }

    let datos = {
      procesador: 3,
      plan: plan,
      amount: t.amount.get()
    }

    if (datos.amount >= 0.01 ) {

      Meteor.call('deposit', datos, (err) => {
          if (err) {
            alert(err)
          } else {
           analytics.track( 'Deposito', {
              title: 'Usuario inicio el proceso de deposito por ' + t.amount.get(),
              
            });
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
      payeer: t.find("[name='payeer']").value,
      bitcoin: t.find("[name='bitcoina']").value, 
    }

    Meteor.call('actualizarInfo', datos, (err) => {
      if (err) {
        alert(err)
      } else {
        analytics.track( 'Cuenta Actualizado', {
          title: 'Usuario actualizo los datos de su cuenta'
        });
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
          analytics.track( 'Cuenta Actualizado - password', {
            title: 'Usuario actualizo su contraseña'
          });
          alert('Password Changed')
        }
      })
    } else {
      alert('Put the same password')
    }

  }
})

Template.AdminWithDraw.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('depositos')
    template.subscribe('withdraws')
  })
})

Template.AdminWithDraw.helpers({
  balance() {

    let retiros = 0
        Withdraws.find({pagado: true}).forEach( w => {
          retiros += parseFloat(w.cantidad)
        })

        retiros = parseFloat(retiros)
        
        let total1 = 0;

        Deposits.find({confirmado: true}).forEach( p => {
          
          if (p.plan === 1) {
            total1 += parseFloat((p.intereses.toFixed(5) - (p.amount * 0.00000033) ).toFixed(5))
          } else if (p.plan === 2) {
            total1 += parseFloat((p.intereses.toFixed(5) - (p.amount * 0.00000038) ).toFixed(5))
          } else if (p.plan === 3) {
            total1 += parseFloat(( p.intereses.toFixed(5) - (p.amount * 0.00000042) ).toFixed(5))
          }
        })


        total1.toFixed(5)

        return total1 - retiros
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
          analytics.track( 'Withdraw', {
            title: 'Usuario solicito retiro de ' + cantidad + 'BTC'
          });
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

Template.inicio.helpers({
  days() {
    let date = daysBetween(new Date("18-06-2017"), new Date())
    return "1"
  },
  ref() {
    let ref = FlowRouter.getQueryParam('href')
    if (ref) {
      return '?href=' + ref
    } else {
      return ''
    }
  },
  Totalaccounts() {
    console.log(Meteor.users.find().fetch().length)
    return Meteor.users.find().fetch().length;
  },
  TotalActiveAccounts() {
    return Meteor.users.find({'profile.active': true}).fetch().length
  },
  TotalDeposit() {
    let t = 0;

    Deposits.find({confirmado: true}).forEach( (d) => {
      t += parseFloat(d.amount)
    })

    return t //+ 10.47;
  },
  totalWithDrawn() {
    let total = 0
    Withdraws.find({pagado: true}).forEach( (w) => {
      total += parseFloat(w.cantidad)
      console.log(total);
    })

    return total //+ 2.31
  }
})

Template.Home.helpers({
  days() {
    
    return "1"
  },
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

    return t + 10.5;
  },
  totalWithDrawn() {
    let total = 0
    Withdraws.find().forEach( (w) => {
      total += parseFloat(w.cantidad)
      console.log(total);
    })

    return total + 1.40
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
