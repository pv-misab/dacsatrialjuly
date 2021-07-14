"use strict";

var sql = require('mssql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { prototype } = require('events');















var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

var connectionString = 'HostName=DACSAIOT.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=VYv8XMXd0lKl84wae/clyNWuWaBbeIMls6YiAg2VVnM=';
var targetDevice = 'iot2000';

var serviceClient = Client.fromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
      if (err) console.log(op + ' error: ' + err.toString());
      if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

function receiveFeedback(err, receiver){
    receiver.on('message', function (msg) {
      console.log('Feedback message:')
      console.log(msg.getData().toString('utf-8'));
    });
}



































var dbConfig = {
    server: "dtsmartaccess-sqlserver.database.windows.net", // Use your SQL server name
    database: "DTSmartAccess-DB", // Database to connect to
    user: "sqladmin", // Use your username
    password: "3p@hPWSGxStXvn4R!", // Use your password
    port: 1433,
    // Since we're on Windows Azure, we need to set the following options
    options: {
          encrypt: true
      }
   };
   
   var publicDir = require('path').join(__dirname,'/public');

   var app = express();
   app.use(express.static(publicDir))//images
   app.use(session({
       secret: 'secret',
       resave: true,
       saveUninitialized: true
   }));
   app.use(bodyParser.urlencoded({extended : true}));
   app.use(bodyParser.json());
   app.engine('html', require('ejs').renderFile);
   app.set('view engine', 'html');
   
   app.get('/', function(request, response) {
       response.sendFile(path.join(__dirname + '/login.html'));
   });
   
   app.get('/home', function (request, response) {
       response.sendFile(path.join(__dirname + '/home.html'));
   });
   
   app.get('/checklist', function (request, response) {
       response.sendFile(path.join(__dirname + '/checklist.html'));
   });
   
   app.get('/machines', function (request, response) {
       response.sendFile(path.join(__dirname + '/machines.html'));
   });
   
   app.get('/reports', function (request, response) {
       response.sendFile(path.join(__dirname + '/reports.html'));
   });
   
   app.get('/alerts', function (request, response) {
       response.sendFile(path.join(__dirname + '/alerts.html'));
   });
   
   app.get('/sessions', function (request, response) {
       response.sendFile(path.join(__dirname + '/sessions.html'));
   });
   
   //app.get('/users', function (request, response) {
   //    response.sendFile(path.join(__dirname + '/users.html'));
   //});

   var conn = new sql.ConnectionPool(dbConfig);

   app.post('/auth', function(request, response){
    var username = request.body.username;
	var password = request.body.password;
    var role;
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        req.input('inputField1', sql.VarChar, username)
        req.input('inputField2', sql.VarChar, password)
        req.query('SELECT * FROM accounts WHERE UserRole = @inputField1 AND UserPassword = @inputField2').then(function (records) {
            var rec = records.recordset;
            role =  rec[0].UserRole;
            if(role== 'loader'){
                request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/PreuseChecklist');
            }
            else if(role == 'admin') {
                request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
            }
            else if(role == 'mechanic') {
                request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/mechanic');
            }
            else if(role == 'electrician') {
                request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/MaintenanceElec');
            }
            else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        })
    })

   });

   app.get('/home', function(request, response) {
	if (request.session.loggedin) {
        response.sendFile(path.join(__dirname + '/home.html'));
		console.log('Welcome back, ' + request.session.username + '!');
		
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/MaintenanceElec', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/Electrician/eq1.html'));
});

app.get('/eq2', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/Electrician/eq2.html'));
});
app.get('/eq3', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/Electrician/eq3.html'));
});

app.get('/eq4', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/Electrician/eq4.html'));
});

app.get('/PreuseChecklist', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq1.html'));
});

app.get('/lq2', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq2.html'));
});
app.get('/lq3', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq3.html'));
});
app.get('/lq4', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq4.html'));
});
app.get('/lq5', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq5.html'));
});
app.get('/lq6', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq6.html'));
});app.get('/lq7', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq7.html'));
});app.get('/lq8', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/loader/lq8.html'));
});
app.get('/mechanic', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/mechanic/mq1.html'));
});

app.get('/mq2', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/mechanic/mq2.html'));
});

app.get('/mq3', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/mechanic/mq3.html'));
});

app.get('/mq4', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/mechanic/mq4.html'));
});

app.get('/mq5', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/mechanic/mq5.html'));
});

//app.get('/mqfinal', function (request, response) {
//	response.sendFile(path.join(__dirname + '/public/mechanic/mechanicfinal.html'));
//});

//app.get('/eqfinal', function (request, response) {
//	response.sendFile(path.join(__dirname + '/public/Electrician/elecfinal.html'));
//});

//app.get('/loaderfinal', function (request, response) {
//	response.sendFile(path.join(__dirname + '/public/loader/loaderfinal.html'));
//});

app.get('/rus', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/authorised.html'));
});
app.get('/no', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/no.html'));
});
app.get('/override', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/override.html'));
});

app.get('/final', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/final.html'));
});








app.get('/on', function(request, response) {

    serviceClient.open(function (err) {
        if (err) {
          console.error('Could not connect: ' + err.message);
        } else {
          console.log('Service client connected');
          serviceClient.getFeedbackReceiver(receiveFeedback);
          var message = new Message('1');
          message.ack = 'full';
          message.messageId = "My Message ID";
          console.log('Sending message: ' + message.getData());
          serviceClient.send(targetDevice, message, printResultFor('send'));
        }
      });
    response.sendFile(path.join(__dirname + '/public/final.html'));
});

app.get('/off', function(request, response) {

    serviceClient.open(function (err) {
        if (err) {
          console.error('Could not connect: ' + err.message);
        } else {
          console.log('Service client connected');
          serviceClient.getFeedbackReceiver(receiveFeedback);
          var message = new Message('0');
          message.ack = 'full';
          message.messageId = "My Message ID";
          console.log('Sending message: ' + message.getData());
          serviceClient.send(targetDevice, message, printResultFor('send'));
        }
      });
      response.redirect('/logout');
});
















app.post('/checkbox', function(request, response) {
	var options = request.body.check;
    var id =request.body.item;
	console.log(options);
    console.log(id);
    var op="abcd";
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        req.input('inputField1', sql.VarChar, id)
        req.input('inputField2', sql.VarChar, options)
        req.query("update electrician set options=@inputField2 where q_id=@inputField1").then(function (records) {
        if(id == 1){
            response.redirect('/eq2');  
        }
        else if(id == 2){
            response.redirect('/eq3');
        }
        else if(id == 3){
            response.redirect('/eq4');
        }
        else {
            response.redirect('/eqfinal');
        }
            response.end();
        })
    })


});
//checking for no and yes
app.get('/noyes', function(req,res){
    var data;
    var rows;
    var flag=0;
    var kop;
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        
        req.query('SELECT options FROM electrician').then(function (records) {
            data=records.recordset;
            rows=records.rowsAffected;
            var i;
            for (i = 0; i < rows; i++) {
                if(data[i].options=='NO'){
                    flag=1;
                }
                else{
                    kop=0;
                }
              }
            if(flag==0){
                res.redirect('/rus');
            }
            else{
                res.redirect('/no');
            }
            res.end();
        })
    })
})

app.get('/noyesloader', function(req,res){
    var data;
    var rows;
    var flag=0;
    var kop;
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        
        req.query('SELECT options FROM loader').then(function (records) {
            data=records.recordset;
            rows=records.rowsAffected;
            var i;
            for (i = 0; i < rows; i++) {
                if(data[i].options=='NO'){
                    flag=1;
                }
                else{
                    kop=1
                }
              }
            if(flag==0){
                res.redirect('/rus');
            }
            else{
                res.redirect('/no');
            }
            res.end();
        })
    })
})


app.get('/noyesmech', function(req,res){
    var data;
    var rows;
    var flag=0;
    var kop;
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        
        req.query('SELECT options FROM maintenance').then(function (records) {
            data=records.recordset;
            rows=records.rowsAffected;
            var i;
            for (i = 0; i < rows; i++) {
                if(data[i].options=='NO'){
                    flag=1;
                }
                else{
                    kop=0;
                }
              }
            if(flag==0){
                res.redirect('/rus');
            }
            else{
                res.redirect('/no');
            }
            res.end();
        })
    })
})





app.post('/mechanic/mcheckbox', function(request, response) {
	var options = request.body.check;
    var id =request.body.item;
	console.log(options);
    console.log(id);

    conn.connect().then(function () {
        var req = new sql.Request(conn);
        req.input('inputField1', sql.VarChar, id)
        req.input('inputField2', sql.VarChar, options)
        req.query("update maintenance set options=@inputField2 where q_id=@inputField1").then(function (records) {
        if(id == 1){
            response.redirect('/mq2');  
        }
        else if(id == 2){
            response.redirect('/mq3');
        }
        else if(id == 3){
            response.redirect('/mq4');
        }
        else if(id == 4){
            response.redirect('/mq5');
        }
        else {
            response.redirect('/mqfinal');
        }
            response.end();
        })
    })


});



app.post('/lcheckbox', function(request, response) {
	var options = request.body.check;
    var id =request.body.item;
	console.log(options);
    console.log(id);
    
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        req.input('inputField1', sql.VarChar, id)
        req.input('inputField2', sql.VarChar, options)
        req.query("update loader set options=@inputField2 where q_id=@inputField1").then(function (records) {
        if(id == 1){
            response.redirect('/lq2');  
        }
        else if(id == 2){
            response.redirect('/lq3');
        }
        else if(id == 3){
            response.redirect('/lq4');
        }
        else if(id == 4){
            response.redirect('/lq5');
        }
        else if(id == 5){
            response.redirect('/lq6');
        }
        else if(id == 6){
            response.redirect('/lq7');
        }
        else if(id == 7){
            response.redirect('/lq8');
        }
        else {
            response.redirect('/loaderfinal');
        }
            response.end();
        })
    })


});


app.get('/eqfinal', function(req, res) {
    var data
    
    
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        
        req.query('SELECT options FROM electrician').then(function (records) {
            data=records.recordset;
            console.log(data[1].q_id)
            res.render(__dirname + "/public/Electrician/elecfinal.html", {data:data});
            res.end();
        })
    })


    

});

app.get('/loaderfinal', function(req, res) {
    var data
    
    
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        
        req.query('SELECT options FROM loader').then(function (records) {
            data=records.recordset;
            console.log(data[1].q_id)
            res.render(__dirname + "/public/loader/loaderfinal.html", {data:data});
            res.end();
        })
    })


    

});

app.get('/mqfinal', function(req, res) {
    var data
    
    
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        
        req.query('SELECT * FROM maintenance').then(function (records) {
            data=records.recordset;
            console.log(data[1].q_id)
            res.render(__dirname + "/public/mechanic/mechanicfinal.html", {data:data});
            res.end();
        })
    })


    

});




app.get('/users', function(req, res) {
        var uudata
		conn.connect().then(function() {
        var req = new sql.Request(conn); 
        req.query('SELECT * FROM accounts ').then(function(records){
        uudata= records;
        console.log(records.recordset);    
        })   
        })
		
        res.render(__dirname + "/users.html", {uudata:uudata});

 });



app.get('/checkboxfile', function (request, response) {
	response.sendFile(path.join(__dirname + '/public/user/checkbox.html'));
});

app.get('/logout', function (request,response){
    request.session.loggedin = false;
    response.redirect('/');
})
app.listen(8080)