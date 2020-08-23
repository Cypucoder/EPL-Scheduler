var express = require('express');
var app = express();
var mysql = require('mysql');
var server = require('http').createServer(app);
var io = require ('socket.io')(server);
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var moment = require('moment');

var smtpTransport = nodemailer.createTransport("SMTP",{
host: 'email.host.org',
port: 25,
domain:'domain.org',
tls: {ciphers:'SSLv3'}
});

// Keeps track of all the users online (mainly for use in chat systems, but could be useful for responding to [or commenting on] tickets)
var users = []

//Links mySQL database to the Node server
var db = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: 'password', 
    database: 'eventcal'
});

var socket;

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('add_schedule', function(schedule){
       /* console.log(schedule.eTitle, schedule.eStart, schedule.eEnd, schedule.eUrl, schedule.eAllDay, schedule.eDescription, schedule.prepStart, schedule.TearDownEnd, schedule.Room, schedule.Location, schedule.ContMail, schedule.ContName, schedule.eAttend, schedule.ePlaceholder, schedule.eComment, schedule.ePhone, schedule.Age, schedule.eMaxAtt, schedule.eEquipment, schedule.eOptionLoc, schedule.eEditor, schedule.eSpeaker);
*/
        add_schedule(schedule.eTitle, schedule.eUrl, schedule.eAllDay, schedule.eDescription, schedule.Room, schedule.Location, schedule.ContMail, schedule.ContName, schedule.eAttend, schedule.ePlaceholder, schedule.eComment, schedule.ePhone, schedule.Age, schedule.eMaxAtt, schedule.eEquipment, schedule.eOptionLoc, schedule.eEditor, schedule.RegisCheck, schedule.eSpeaker, schedule.eStH, schedule.eStM, schedule.eStAmPm, schedule.eEnH, schedule.eEnM, schedule.eEnAmPm, schedule.ePrH, schedule.ePrM, schedule.ePrAmPm, schedule.eTdH, schedule.eTdM, schedule.eTdAmPm, schedule.eStDay, schedule.eStMonth, schedule.eStYear, schedule.Chairs, function(res){
            if(res){
                console.log('reached part 1');
                if(res==true)
                    {
                        socket.emit('SchedChangeLoc', "http://localhost/epl/eventkeeper/events/#/Message/1");
                        io.emit('Realtime_Dat', "TESTING REALTIME_DAT");
                        console.log("Realtime_Dat sent");
                    }
                if(res!=undefined&&res!=""&&res!=true&&res!=false)
                    {
                        socket.emit('SchedResp', res);
                    }
            } else {
                io.emit('error');
                console.log('there was an error under socket.on chat message');
            }
        });
    });
    
    socket.on('update_schedule', function(schedule){
        
        update_schedule(schedule.eTitle, schedule.eUrl, schedule.eAllDay, schedule.eDescription, schedule.Room, schedule.Location, schedule.ContMail, schedule.ContName, schedule.eAttend, schedule.ePlaceholder, schedule.eComment, schedule.ePhone, schedule.Age, schedule.eMaxAtt, schedule.eEquipment, schedule.eOptionLoc, schedule.ePatron, schedule.eSpeaker, schedule.AUTH, schedule.eId, schedule.RegisCheck, schedule.eStH, schedule.eStM, schedule.eStAmPm, schedule.eEnH, schedule.eEnM, schedule.eEnAmPm, schedule.ePrH, schedule.ePrM, schedule.ePrAmPm, schedule.eTdH, schedule.eTdM, schedule.eTdAmPm, schedule.eStDay, schedule.eStMonth, schedule.eStYear, schedule.Chairs, function(res){
            if(res){
                console.log('reached part 1');
                if(res==true)
                    {
                        console.log("testing");
                        socket.emit('SchedChangeLoc', "http://localhost/epl/eventkeeper/events/#/Message/2");
                    }
                if(res!=undefined&&res!=""&&res!=true&&res!=false)
                    {
                        socket.emit('SchedResp', res);
                    }
            } else {
                io.emit('error');
                console.log('there was an error under socket.on chat message');
            }
        });
    });
        
    socket.on('add_Regis', function(Regis){
        console.log(Regis.regAttending, Regis.regFName, Regis.regLName, Regis.regEmail, Regis.regPhone, Regis.regHearAbout, Regis.regEvent);
        io.emit('add_Regis', {regAttending: Regis.regAttending, regFName: Regis.regFName, regLName: Regis.regLName, regEmail: Regis.regEmail, regPhone: Regis.regPhone, regHearAbout: Regis.regHearAbout, regEvent: Regis.regEvent});
        
        add_Regis(Regis.regAttending, Regis.regFName, Regis.regLName, Regis.regEmail, Regis.regPhone, Regis.regHearAbout, Regis.regEvent, function(res){
            if(res){
                        console.log('Reached socket.emit');
                        socket.emit('SchedChangeLoc', "/Message/3");
                
            } else {
                io.emit('error');
                console.log('there was an error under socket.on chat message');
            }
        });
    });
    
    socket.on('check_time', function(schedule){
        console.log(schedule.eStH, schedule.eStM, schedule.eStAmPm, schedule.eEnH, schedule.eEnM, schedule.eEnAmPm, schedule.ePrH, schedule.ePrM, schedule.ePrAmPm, schedule.eTdH, schedule.eTdM, schedule.eTdAmPm, schedule.eStDay, schedule.eStMonth, schedule.eStYear, schedule.Room);
        
        check_time(schedule.eStH, schedule.eStM, schedule.eStAmPm, schedule.eEnH, schedule.eEnM, schedule.eEnAmPm, schedule.ePrH, schedule.ePrM, schedule.ePrAmPm, schedule.eTdH, schedule.eTdM, schedule.eTdAmPm, schedule.eStDay, schedule.eStMonth, schedule.eStYear, schedule.Room, function(res){
            if(res){
                console.log('reached checking time res');
                socket.emit('available', res);
            }
            else{
                io.emit('error');
                socket.emit('available', res);
                console.log('there was an error under check_time socket');
            }
        });
    });
    
    socket.on('checkSched', function(schedule){
        console.log(schedule.eTitle, schedule.eUrl, schedule.eAllDay, schedule.eDescription, schedule.Room, schedule.Location, schedule.ContMail, schedule.ContName, schedule.eAttend, schedule.ePlaceholder, schedule.eComment, schedule.ePhone, schedule.Age, schedule.eMaxAtt, schedule.eEquipment, schedule.eOptionLoc, schedule.eEditor, schedule.eStH, schedule.eStM, schedule.eStAmPm, schedule.eEnH, schedule.eEnM, schedule.eEnAmPm, schedule.ePrH, schedule.ePrM, schedule.ePrAmPm, schedule.eTdH, schedule.eTdM, schedule.eTdAmPm, schedule.eStDay, schedule.eStMonth, schedule.eStYear);
        io.emit('check_Sched', {eTitle: schedule.eTitle, eStart: schedule.eStart, eEnd: schedule.eEnd, eUrl: schedule.eUrl, eAllDay: schedule.eAllDay, eDescription: schedule.eDescription, prepStart: schedule.prepStart, TearDownEnd: schedule.TearDownEnd, Room: schedule.Room, Location: schedule.Location, ContMail: schedule.ContMail, ContName: schedule.ContName, eAttend: schedule.eAttend, ePlaceholder: schedule.ePlaceholder, eComment: schedule.eComment, ePhone: schedule.ePhone, Age: schedule.Age, eMaxAtt: schedule.eMaxAtt, eEquipment: schedule.eEquipment, eOptionLoc: schedule.eOptionLoc, eEditor: schedule.eEditor});
        
        check_Sched(schedule.eTitle, schedule.eUrl, schedule.eAllDay, schedule.eDescription, schedule.Room, schedule.Location, schedule.ContMail, schedule.ContName, schedule.eAttend, schedule.ePlaceholder, schedule.eComment, schedule.ePhone, schedule.Age, schedule.eMaxAtt, schedule.eEquipment, schedule.eOptionLoc, schedule.eEditor, schedule.eStH, schedule.eStM, schedule.eStAmPm, schedule.eEnH, schedule.eEnM, schedule.eEnAmPm, schedule.ePrH, schedule.ePrM, schedule.ePrAmPm, schedule.eTdH, schedule.eTdM, schedule.eTdAmPm, schedule.eStDay, schedule.eStMonth, schedule.eStYear, function(res){
            if(res){
                console.log('reached check_Sched res');
                
                if(res!=undefined&&res!="")
                    {
                        socket.emit('SchedResp', res);
                    }
                else
                    {
                        socket.emit('SchedChangeLoc', "http://localhost/epl/eventkeeper/events/#/Message/1");
                    }
                                        
            }
            else{
                io.emit('error');
                socket.emit('LoginResp', res);
                console.log('there was an error under Login socket');
            }
        });
    });
    
    socket.on('Login', function(lI){
        console.log(lI.lUser, lI.lPass);
        
        Login(lI.lUser, lI.lPass, function(res){
            if(res){
                console.log('reached Login res');
                if(res=="No Results"||res=="Please enter your credentials"||res=="Please enter User Name"||res=="Please enter Password"||res=="No Results")
                    {
                        socket.emit('LoginResp', res);
                    }
                else
                    {
                        socket.emit('ChangeLoc', res);
                    }
                                        
            }
            else{
                io.emit('error');
                socket.emit('LoginResp', res);
                console.log('there was an error under Login socket');
            }
        });
    });
    
    socket.on('updWait', function(UpdReg){        
        upd_Wait(UpdReg, function(res){
            if(res){
                console.log('reached upd_Wait res');
                
                socket.emit('Upd_Att_Stream');
            }
            else{
                io.emit('error');
                console.log('there was an error under upd_Wait socket');
            }
        });
    });
    
    socket.on('updRemove', function(UpdRem){        
        upd_Remove(UpdRem, function(res){
            if(res){
                console.log('reached upd_Wait res in upd_Remove');
                
                socket.emit('Upd_Att_Stream');
            }
            else{
                io.emit('error');
                console.log('there was an error under upd_Remove socket');
            }
        });
    });
    
    socket.on('deleteEvent', function(eve){        
        delete_Event(eve, function(res){
            if(res){
                console.log('reached delete_Event res');
                socket.emit('SchedChangeLoc', "Message/4");
            }
            else{
                io.emit('error');
                console.log('there was an error under upd_Remove socket');
            }
        });
    });
    
    //disconnects link to server to prevent too many connections to the server
    socket.on('disconnect', function() {
     //Code inserted in here will run on user disconnect. 
     console.log('A user has disconnected');
        socket.disconnect();
        
    });
    
    });

//used to start and run the server
server.listen(3000, function(){
    console.log("listening on *:3000");
});

app.use(express.static('files'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/DB', function(req, res){
    db.query('SELECT * FROM eventcal.events', function(err, rows)
                     {
        if (err) console.log(err);
        res.send(JSON.stringify(rows));
    });
});

app.get('/DB2', function(req, res){
    db.query('SELECT * FROM eventcal.events', function(err, rows)
                     {
        if (err) console.log(err);
        
        var newRows =[];
        
        for(var i = 0; i < rows.length; i++)
        {
        var newAllD;
        
        if(rows[i].allDay == "true")
        {
            newAllD = true;
        }
        else
        {
            newAllD = false;
        }
            newRows[i] = {id:rows[i].id, title: rows[i].title,start: moment(rows[i].prepStart), end: moment(rows[i].TearDownEnd), allDay: newAllD, url: "events/index.html#/event/"+ rows[i].id, dow: rows[i].dow, stick: false};
        }
        
        res.send(JSON.stringify(newRows));
    });
});

app.get('/DB3', function(req, res){
    db.query('SELECT * FROM eventcal.events WHERE events.start >= DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND events.start <= DATE_SUB(CURDATE(),INTERVAL -90 DAY) AND (CheckLy = 1 OR CheckLak = 1)', function(err, rows)
                     {
        if (err) console.log(err);
        
        var newRows =[];
        
        for(var i = 0; i < rows.length; i++)
        {
        var newAllD;
        
        if(rows[i].allDay == "true")
        {
            newAllD = true;
        }
        else
        {
            newAllD = false;
        }
            newRows[i] = {id:rows[i].id, title: rows[i].title,start: moment(rows[i].start), end: moment(rows[i].end), allDay: newAllD, url: "events/index.html#/event/"+ rows[i].id, dow: rows[i].dow, stick: false};
        }
        
        res.send(JSON.stringify(newRows));
    });
});

app.get('/DB3', function(req, res){
    db.query('SELECT * FROM eventcal.events', function(err, rows)
                     {
        if (err) console.log(err);
        
        var newRows =[];
        
        for(var i = 0; i < rows.length; i++)
        {
        var newAllD;
        
        if(rows[i].allDay == "true")
        {
            newAllD = true;
        }
        else
        {
            newAllD = false;
        }
            newRows[i] = {id:rows[i].id, title: rows[i].title,start: moment(rows[i].start), end: moment(rows[i].end), allDay: newAllD, url: "events/index.html#/event/"+ rows[i].id, dow: rows[i].dow, stick: false};
        }
        
        res.send(JSON.stringify(newRows));
    });
});

app.get('/REPTIMES/:title/:user/:location', function(req, res){
    db.query('SELECT DATE_FORMAT(start, "%b/%d/%Y %I:%i %p") AS fstart, DATE_FORMAT(end, "%b/%d/%Y %I:%i %p") AS fend FROM eventcal.events WHERE title = "'+req.params.title+'" AND ContMail = "'+req.params.user+'"  AND Location_Room = "'+req.params.location+'" ', function(err, rows)
                     {
        if (err) console.log(err);
        res.send(JSON.stringify(rows));
    });
});

app.get('/cal', function(req, res){
    db.query('SELECT * FROM eventcal.events WHERE events.start >= DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND events.start <= DATE_SUB(CURDATE(),INTERVAL -90 DAY)', function(err, rows)
                     {
        if (err) console.log(err);
        
        var newRows =[];
        
        for(var i = 0; i < rows.length; i++)
        {
        var newAllD;
        
        if(rows[i].allDay == "true")
        {
            newAllD = true;
        }
        else
        {
            newAllD = false;
        }
            newRows[i] = {id:rows[i].id, title: rows[i].title,start: new Date(rows[i].prepStart), end: new Date(rows[i].TearDownEnd), allDay: newAllD, url: "", dow: rows[i].dow, stick: false};
        }
        
        res.send(JSON.stringify(newRows));
    });
});

app.get('/event', function(req, res){
    db.query('SELECT *, DATE_FORMAT(start, "%b/%d/%Y %I:%i %p") AS fstart, DATE_FORMAT(end, "%b/%d/%Y %I:%i %p") AS fend, DATE_FORMAT(prepStart, "%b/%d/%Y %I:%i %p") AS fprep, DATE_FORMAT(TearDownEnd, "%b/%d/%Y %I:%i %p") AS ftear FROM eventcal.events WHERE events.start >= DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND events.start <= DATE_SUB(CURDATE(),INTERVAL -90 DAY) AND events.start >= NOW() ORDER BY start', function(err, rows)
                     {
        if (err) console.log(err);
        for(var i = 0; i < rows.length; i++)
            {
                //var sReplace = moment(eStart).subtract('h', 4).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                if (rows[i].Age == "Birth to Pre-K")
                    {
                        rows[i].XFilter = 'QFX Kids Birth to Pre-K';
                    }
                if (rows[i].Age == "School Age")
                    {
                        rows[i].XFilter = 'QFX Kids School Age';
                    }
                if (rows[i].Age == "Family")
                    {
                        rows[i].XFilter = 'QFX Family';
                    }
                if (rows[i].Age == "Teens")
                    {
                        rows[i].XFilter = 'QFX Teens';
                    }
                if (rows[i].Age == "Adults")
                    {
                        rows[i].XFilter = 'QFX Adults';
                    }
            }
                
        res.send(JSON.stringify(rows));
        console.log("event");
    });
});

app.get('/flEvent', function(req, res){
    db.query('SELECT *, DATE_FORMAT(start, "%b/%d/%Y %I:%i %p") AS fstart, DATE_FORMAT(end, "%b/%d/%Y %I:%i %p") AS fend, DATE_FORMAT(prepStart, "%b/%d/%Y %I:%i %p") AS fprep, DATE_FORMAT(TearDownEnd, "%b/%d/%Y %I:%i %p") AS ftear FROM eventcal.events WHERE events.start >= DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND events.start <= DATE_SUB(CURDATE(),INTERVAL -90 DAY) AND events.start >= NOW() AND events.Deleter != 1 ORDER BY start', function(err, rows)
                     {
        if (err) console.log(err);
        for(var i = 0; i < rows.length; i++)
            {
                //var sReplace = moment(eStart).subtract('h', 4).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                if (rows[i].Age == "Birth to Pre-K")
                    {
                        rows[i].XFilter = 'QFX Kids Birth to Pre-K';
                    }
                if (rows[i].Age == "School Age")
                    {
                        rows[i].XFilter = 'QFX Kids School Age';
                    }
                if (rows[i].Age == "Family")
                    {
                        rows[i].XFilter = 'QFX Family';
                    }
                if (rows[i].Age == "Teens")
                    {
                        rows[i].XFilter = 'QFX Teens';
                    }
                if (rows[i].Age == "Adults")
                    {
                        rows[i].XFilter = 'QFX Adults';
                    }
            }
                
        res.send(JSON.stringify(rows));
        console.log("event");
    });
});

app.get('/flEvent/a', function(req, res){
    db.query('SELECT *, DATE_FORMAT(start, "%b/%d/%Y %I:%i %p") AS fstart, DATE_FORMAT(end, "%b/%d/%Y %I:%i %p") AS fend, DATE_FORMAT(prepStart, "%b/%d/%Y %I:%i %p") AS fprep, DATE_FORMAT(TearDownEnd, "%b/%d/%Y %I:%i %p") AS ftear FROM eventcal.events WHERE events.start >= DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND events.start <= DATE_SUB(CURDATE(),INTERVAL -90 DAY) AND events.start <= NOW() ORDER BY start', function(err, rows)
                     {
        if (err) console.log(err);
        for(var i = 0; i < rows.length; i++)
            {
                //var sReplace = moment(eStart).subtract('h', 4).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                if (rows[i].Age == "Birth to Pre-K")
                    {
                        rows[i].XFilter = 'QFX Kids Birth to Pre-K';
                    }
                if (rows[i].Age == "School Age")
                    {
                        rows[i].XFilter = 'QFX Kids School Age';
                    }
                if (rows[i].Age == "Family")
                    {
                        rows[i].XFilter = 'QFX Family';
                    }
                if (rows[i].Age == "Teens")
                    {
                        rows[i].XFilter = 'QFX Teens';
                    }
                if (rows[i].Age == "Adults")
                    {
                        rows[i].XFilter = 'QFX Adults';
                    }
            }
                
        res.send(JSON.stringify(rows));
        console.log("event");
    });
});

//http://www.w3schools.com/sql/func_date_format.asp
 app.get('/event/:id', function(req, res){
    db.query('SELECT *, DATE_FORMAT(start, "%b/%d/%Y %I:%i %p") AS fstart, DATE_FORMAT(end, "%b/%d/%Y %I:%i %p") AS fend, DATE_FORMAT(prepStart, "%b/%d/%Y %I:%i %p") AS fprep, DATE_FORMAT(TearDownEnd, "%b/%d/%Y %I:%i %p") AS ftear FROM eventcal.events where events.id='+req.params.id+';', function(err, rows)
                     {
        
            if (err) console.log(err);
        
        if (rows[0].Location_Room == "B-1 Activity" || rows[0].Location_Room == "B-2 Artsy Toddler ‘A’" || rows[0].Location_Room == "B-3 Board" || rows[0].Location_Room == "B-4 Banquet" || rows[0].Location_Room == "B-5 Block" || rows[0].Location_Room == "B-6 Classroom" || rows[0].Location_Room == "B-7 Empty" || rows[0].Location_Room == "B-8 Forum" || rows[0].Location_Room == "B-9 Party" || rows[0].Location_Room == "B-10 Presentation" || rows[0].Location_Room == "B-11 Square" || rows[0].Location_Room == "B-12 Standard 1" || rows[0].Location_Room == "B-13 Standard 2" || rows[0].Location_Room == "B-14 Theater" || rows[0].Location_Room == "B-15 Standard Program 3" || rows[0].Location_Room == "C Childrens" || rows[0].Location_Room == "Central" || rows[0].Location_Room == "Small Central" )
                     {
                         if (rows[0].Location_Room == "B-1 Activity" || rows[0].Location_Room == "B-2 Artsy Toddler ‘A’" || rows[0].Location_Room == "B-3 Board" || rows[0].Location_Room == "B-4 Banquet" || rows[0].Location_Room == "B-5 Block" || rows[0].Location_Room == "B-6 Classroom" || rows[0].Location_Room == "B-7 Empty" || rows[0].Location_Room == "B-8 Forum" || rows[0].Location_Room == "B-9 Party" || rows[0].Location_Room == "B-10 Presentation" || rows[0].Location_Room == "B-11 Square" || rows[0].Location_Room == "B-12 Standard 1" || rows[0].Location_Room == "B-13 Standard 2" || rows[0].Location_Room == "B-14 Theater" || rows[0].Location_Room == "B-15 Standard Program 3")
                             {
                                rows[0].RoomName = "Scheide Room";     
                             }else if (rows[0].Location_Room == "C Childrens")
                             {
                                rows[0].RoomName = "Childrens Room";   
                             }else if (rows[0].Location_Room == "Small Central")
                             {
                                 rows[0].RoomName = "Small Conference Room";
                             }else{
                                 rows[0].RoomName = "Central";
                             }
                         
                     }


                 if (rows[0].Location_Room == "C-1 Activity" || rows[0].Location_Room == "C-2 Banquet (Rectangle)" || rows[0].Location_Room == "C-3 Banquet (Round)" || rows[0].Location_Room == "C-4 Block" || rows[0].Location_Room == "C-5 Board" || rows[0].Location_Room == "C-6 Classroom 1" || rows[0].Location_Room == "C-7 Classroom 2" || rows[0].Location_Room == "C-8 Craft" || rows[0].Location_Room == "C-9 Empty" || rows[0].Location_Room == "C-10 Forum" || rows[0].Location_Room == "C-11 Presentation" || rows[0].Location_Room == "C-12 Square" || rows[0].Location_Room == "C-13 Standard" || rows[0].Location_Room == "C-14 Theater" || rows[0].Location_Room == "A-1 Block 1" || rows[0].Location_Room == "A-2 Block 2" || rows[0].Location_Room == "A-3 Classroom 1" || rows[0].Location_Room == "A-4 Classroom 2")
                     {
                         if (rows[0].Location_Room == "A-1 Block 1" || rows[0].Location_Room == "A-2 Block 2" || rows[0].Location_Room == "A-3 Classroom 1" || rows[0].Location_Room == "A-4 Classroom 2")
                         {
                             rows[0].RoomName = "2nd Floor Conference Room";
                             
                         }else if(rows[0].Location_Room == "C-1 Activity" || rows[0].Location_Room == "C-2 Banquet (Rectangle)" || rows[0].Location_Room == "C-3 Banquet (Round)" || rows[0].Location_Room == "C-4 Block" || rows[0].Location_Room == "C-5 Board" || rows[0].Location_Room == "C-6 Classroom 1" || rows[0].Location_Room == "C-7 Classroom 2" || rows[0].Location_Room == "C-8 Craft" || rows[0].Location_Room == "C-9 Empty" || rows[0].Location_Room == "C-10 Forum" || rows[0].Location_Room == "C-11 Presentation" || rows[0].Location_Room == "C-12 Square" || rows[0].Location_Room == "C-13 Standard" || rows[0].Location_Room == "C-14 Theater")
                         {
                           rows[0].RoomName = "Miller Room"; 
                             
                         }else if(rows[0].Location_Room == "WR Childrens")
                         {
                            rows[0].RoomName = "Childrens"; 
                         }else{
                            rows[0].RoomName = rows[0].Location_Room;
                         }
        
                     }
                 
                 if (rows[0].Location_Room == "Keystone")
                     {
                         rows[0].RoomName = "Keystone";
                     }

                 if (rows[0].Location_Room == "South")
                     {
                         rows[0].RoomName = "South";
                     }

                 if (rows[0].Location_Room == "North" || rows[0].Location_Room == "Room 210" || rows[0].Location_Room == "Room 231" || rows[0].Location_Room == "LC125")
                     {
                         
                         
                         if (rows[0].Location_Room == "North")
                            { 
                                rows[0].RoomName = "North";
                            }else{
                                rows[0].RoomName = rows[0].Location_Room;
                            }   
                         
                     }

                 if (rows[0].Location_Room == "Bookmobile")
                     {
                         rows[0].RoomName = "Bookmobile";
                     }
       console.log(rows[0].RoomName);
        
                rows[0].updStart = moment(rows[0].start).subtract('h', 4);
                rows[0].updEnd = moment(rows[0].end).subtract('h', 4);
                rows[0].updPrepStart = moment(rows[0].prepStart).subtract('h', 4);
                rows[0].updTearDownEnd = moment(rows[0].TearDownEnd).subtract('h', 4);
        
            res.send(JSON.stringify(rows[0]));
                 
                 
    });
});

app.get('/eventLogged/:user', function(req, res){
    db.query('SELECT *, DATE_FORMAT(start, "%b/%d/%Y %I:%i %p") AS fstart, DATE_FORMAT(end, "%b/%d/%Y %I:%i %p") AS fend FROM eventcal.events WHERE events.start >= DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND events.start <= DATE_SUB(CURDATE(),INTERVAL -90 DAY) AND Editor="'+req.params.user+'"', function(err, rows)
                     {
        if (err) console.log(err);
        res.send(JSON.stringify(rows));
        console.log("eventLogged/user");
    });
});

app.get('/fevent/:building/:age/:order', function(req, res){
    
    if (req.params.building == "" || req.params.building == undefined || req.params.building == "*" || req.params.building == "None")
        {
            var building = " ";
        }
    else
        {
            var building = 'AND events.Building = "'+ req.params.building +'" ';
            
        }
    
    if (req.params.age == "" || req.params.age == undefined || req.params.age == "*" || req.params.age == "None")
        {
            var age = " ";
        }
    else
        {
            var age = 'AND events.Age = "'+req.params.age+'" ';
        }
    
    if (req.params.order == "" || req.params.order == undefined || req.params.order == "*" || req.params.order == "None")
        {
            var order = " ";
        }
    else
        {
            var order =  "ORDER BY "+req.params.order+" ";
        }
    
    
    console.log(building,age,order);
    db.query('SELECT *, DATE_FORMAT(start, "%b/%d/%Y %I:%i %p") AS fstart, DATE_FORMAT(end, "%b/%d/%Y %I:%i %p") AS fend FROM eventcal.events WHERE events.start >= DATE_SUB(CURDATE(),INTERVAL 90 DAY) AND events.start <= DATE_SUB(CURDATE(),INTERVAL -90 DAY) '+building+' '+ age +' '+ order +' ;', function(err, rows)
                     {
        if (err) console.log(err);
        console.log(rows);
        res.send(JSON.stringify(rows));
    });
});

app.get('/Attendings/:id/:max', function(req, res){
    db.query('SELECT * FROM eventcal.registration where registration.regEvent = '+ req.params.id +';', function(err, rows)
                     {
        if (err) console.log(err);
        
        console.log(req.params.max);
        var total = 0;
        var count = 0;
        var AttendCap = req.params.max;
         //console.log(AttendCap);
        for(var i = 0; i < rows.length; i++)
            {
                
                if (count + rows[i].regAttending <= AttendCap){
                
                    count = count + rows[i].regAttending;
                    console.log("Count: "+count);
                    total = total + 1;
                    rows[i].wait = "1";
                    console.log(i+": 1");
                }
                else 
                {
                    rows[i].wait = "0";
                    console.log(i+": 0");
                }
                //console.log(i);
            }
            
        console.log("Count: "+count);
        console.log("Total: "+total);
        
        
        res.send(JSON.stringify(rows));

    });
});

app.get('/Attendees/:id', function(req, res){
    db.query('SELECT * FROM eventcal.registration where registration.id_Registration = '+ req.params.id +';', function(err, rows)
                     {
        if (err) console.log(err);
        res.send(JSON.stringify(rows[0]));

    });
});

app.get('/Title/:id/', function(req, res){
    
    var total = 0;
    var count = 0;
    var AttendCap = 0;
    db.query('SELECT AttendCap FROM eventcal.events where events.id = '+ req.params.id +';', function(err, rows)
                     {
        if (err) console.log(err);
        AttendCap = rows[0].AttendCap;
        console.log("Attendcap: " + AttendCap);
        
    });
    
    db.query('SELECT * FROM eventcal.registration where registration.regEvent = '+ req.params.id +';', function(err, rows)
                     {
        if (err) console.log(err);

        for(var i = 0; i < rows.length; i++)
            {
                if (count + rows[i].regAttending <= AttendCap){
                
                    count = count + rows[i].regAttending;
                    total = total + 1;
                }
            }
            
        console.log("Count: "+count);
        console.log("Total: "+total);
        
    });
    
    db.query('SELECT title, AttendCount, AttendCap FROM eventcal.events where events.id = '+ req.params.id +';', function(err, rows)
                     {
        if (err) console.log(err);
        rows[0].total  = total;
        res.send(JSON.stringify(rows[0]));

    });
});

app.get('/Attendings/', function(req, res){
    db.query('SELECT * FROM eventcal.registration;', function(err, rows)
                     {
        if (err) console.log(err);
        res.send(JSON.stringify(rows));

    });
});

app.get('/Sched', function(req, res){
    db.query('SELECT * FROM eventcal.events WHERE YEARWEEK(start) = YEARWEEK(NOW() + INTERVAL 1 WEEK) AND Deleter != 1', function(err, rows)
                     {
        if (err) console.log(err);
        /*console.log(rows);*/
        
        if(rows.length != undefined && rows.length != "0")
            {
        for(var i = 0; i < rows.length; i++)
            {
                //var sReplace = moment(eStart).subtract('h', 4).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                if (moment(rows[i].start).weekday() == 1)
                    {
                        rows[i].dayFilt = 'QXMon';
                    }
                if (moment(rows[i].start).weekday() == 2)
                    {
                        rows[i].dayFilt = 'QXTue';
                    }
                if (moment(rows[i].start).weekday() == 3)
                    {
                        rows[i].dayFilt = 'QXWed';
                    }
                if (moment(rows[i].start).weekday() == 4)
                    {
                        rows[i].dayFilt = 'QXThu';
                    }
                if (moment(rows[i].start).weekday() == 5)
                    {
                        rows[i].dayFilt = 'QXFri';
                    }
                if (moment(rows[i].start).weekday() == 6)
                    {
                        rows[i].dayFilt = 'QXSat';
                    }
                if (moment(rows[i].start).weekday() == 7)
                    {
                        rows[i].dayFilt = 'QXSun';
                    }

                 var RoomName = "";
                 
                 if (rows[i].Location_Room == "B-1 Activity" || rows[i].Location_Room == "B-2 Artsy Toddler ‘A’" || rows[i].Location_Room == "B-3 Board" || rows[i].Location_Room == "B-4 Banquet" || rows[i].Location_Room == "B-5 Block" || rows[i].Location_Room == "B-6 Classroom" || rows[i].Location_Room == "B-7 Empty" || rows[i].Location_Room == "B-8 Forum" || rows[i].Location_Room == "B-9 Party" || rows[i].Location_Room == "B-10 Presentation" || rows[i].Location_Room == "B-11 Square" || rows[i].Location_Room == "B-12 Standard 1" || rows[i].Location_Room == "B-13 Standard 2" || rows[i].Location_Room == "B-14 Theater" || rows[i].Location_Room == "B-15 Standard Program 3" || rows[i].Location_Room == "C Childrens" || rows[i].Location_Room == "Central" || rows[i].Location_Room == "Small Central" )
                     {
                         rows[i].eBuilding = "C";
                         
                         if (rows[i].Location_Room == "B-1 Activity" || rows[i].Location_Room == "B-2 Artsy Toddler ‘A’" || rows[i].Location_Room == "B-3 Board" || rows[i].Location_Room == "B-4 Banquet" || rows[i].Location_Room == "B-5 Block" || rows[i].Location_Room == "B-6 Classroom" || rows[i].Location_Room == "B-7 Empty" || rows[i].Location_Room == "B-8 Forum" || rows[i].Location_Room == "B-9 Party" || rows[i].Location_Room == "B-10 Presentation" || rows[i].Location_Room == "B-11 Square" || rows[i].Location_Room == "B-12 Standard 1" || rows[i].Location_Room == "B-13 Standard 2" || rows[i].Location_Room == "B-14 Theater" || rows[i].Location_Room == "B-15 Standard Program 3")
                             {
                                rows[i].RoomName = "Scheide Room";     
                             }else if (rows[i].Location_Room == "C Childrens")
                             {
                                rows[i].RoomName = "Childrens Room";   
                             }else if (rows[i].Location_Room == "Small Central")
                             {
                                 rows[i].RoomName = "Small Conference Room";
                             }else{
                                 rows[i].RoomName = "Central";
                             }
                         
                     }


                 if (rows[i].Location_Room == "C-1 Activity" || rows[i].Location_Room == "C-2 Banquet (Rectangle)" || rows[i].Location_Room == "C-3 Banquet (Round)" || rows[i].Location_Room == "C-4 Block" || rows[i].Location_Room == "C-5 Board" || rows[i].Location_Room == "C-6 Classroom 1" || rows[i].Location_Room == "C-7 Classroom 2" || rows[i].Location_Room == "C-8 Craft" || rows[i].Location_Room == "C-9 Empty" || rows[i].Location_Room == "C-10 Forum" || rows[i].Location_Room == "C-11 Presentation" || rows[i].Location_Room == "C-12 Square" || rows[i].Location_Room == "C-13 Standard" || rows[i].Location_Room == "C-14 Theater" || rows[i].Location_Room == "A-1 Block 1" || rows[i].Location_Room == "A-2 Block 2" || rows[i].Location_Room == "A-3 Classroom 1" || rows[i].Location_Room == "A-4 Classroom 2" || rows[i].Location_Room == "WR Childrens" || rows[i].Location_Room == "Teen Lounge" || rows[i].Location_Room == "Tutor Room #1" || rows[i].Location_Room == "Tutor Room #2" || rows[i].Location_Room == "Tutor Room #3" || rows[i].Location_Room == "1st Floor Open Area" || rows[i].Location_Room == "2nd Floor Open Area")
                     {
                         rows[i].eBuilding = "WR";
                         
                         if (rows[i].Location_Room == "A-1 Block 1" || rows[i].Location_Room == "A-2 Block 2" || rows[i].Location_Room == "A-3 Classroom 1" || rows[i].Location_Room == "A-4 Classroom 2")
                         {
                             rows[i].RoomName = "2nd Floor Conference Room";
                             
                         }else if(rows[i].Location_Room == "C-1 Activity" || rows[i].Location_Room == "C-2 Banquet (Rectangle)" || rows[i].Location_Room == "C-3 Banquet (Round)" || rows[i].Location_Room == "C-4 Block" || rows[i].Location_Room == "C-5 Board" || rows[i].Location_Room == "C-6 Classroom 1" || rows[i].Location_Room == "C-7 Classroom 2" || rows[i].Location_Room == "C-8 Craft" || rows[i].Location_Room == "C-9 Empty" || rows[i].Location_Room == "C-10 Forum" || rows[i].Location_Room == "C-11 Presentation" || rows[i].Location_Room == "C-12 Square" || rows[i].Location_Room == "C-13 Standard" || rows[i].Location_Room == "C-14 Theater")
                         {
                             
                           rows[i].RoomName = "Miller Room"; 
                             
                         }else if(rows[i].Location_Room == "WR Childrens")
                         {
                            rows[i].RoomName = "Childrens"; 
                         }else{
                            rows[i].RoomName = rows[i].Location_Room;
                         }
        
                     }
                 
                 if (rows[i].Location_Room == "Keystone")
                     {
                         rows[i].eBuilding = "K";
                         rows[i].RoomName = "Keystone";
                     }

                 if (rows[i].Location_Room == "South")
                     {
                         rows[i].eBuilding = "S";
                         rows[i].RoomName = "South";
                     }

                 if (rows[i].Location_Room == "North" || rows[i].Location_Room == "Room 210" || rows[i].Location_Room == "Room 231" || rows[i].Location_Room == "LC125")
                     {
                         rows[i].eBuilding = "N";
                         
                         if (rows[i].Location_Room == "North")
                            { 
                                rows[i].RoomName = "North";
                            }else{
                                rows[i].RoomName = rows[i].Location_Room;
                            }   
                         
                     }

                 if (rows[i].Location_Room == "Bookmobile")
                     {
                         rows[i].eBuilding = "BM";
                         rows[i].RoomName = "Bookmobile";
                     }
                 console.log(rows[i].eBuilding);
             }
                }
        
      if(rows.length != undefined && rows.length != "0")
          {
      rows[0].Sun =  moment().add(1, 'weeks').weekday(0);
      rows[0].Mon =  moment().add(1, 'weeks').weekday(1);
      rows[0].Tue =  moment().add(1, 'weeks').weekday(2);
      rows[0].Wed =  moment().add(1, 'weeks').weekday(3);
      rows[0].Thu =  moment().add(1, 'weeks').weekday(4);
      rows[0].Fri =  moment().add(1, 'weeks').weekday(5);
      rows[0].Sat =  moment().add(1, 'weeks').weekday(6);
        }        
      res.send(JSON.stringify(rows));

    });
});


//In this version of app.get, the '/' sets the home page when you enter the page. 
app.get('/', function(req, res){
        res.sendFile(__dirname + '/files/ROS.html');
});

var check_time = function(eStH, eStM, eStAmPm, eEnH, eEnM, eEnAmPm, ePrH, ePrM, ePrAmPm, eTdH, eTdM, eTdAmPm, eStDay, eStMonth, eStYear, nLocation_Room, callback){
        //http://stackoverflow.com/questions/21123586/return-node-js-mysql-results-to-a-function 
    db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in the check_time section');
            connection.release();
            callback(false);
            return;
        }
        
        if(eStH != undefined && eStM != undefined && eStAmPm != undefined && eEnH != undefined && eEnM != undefined && eEnAmPm != undefined && ePrH != undefined && ePrM != undefined && ePrAmPm != undefined && eTdH != undefined && eTdM != undefined && eTdAmPm != undefined && eStDay != undefined && eStMonth != undefined && eStYear != undefined){

            if(parseInt(eStH) + parseInt(eStAmPm) == 24)
               {
                    eStH = 00; 
               }
            if(parseInt(eEnH) + parseInt(eEnAmPm) == 24)
               {
                    eEnH = 00; 
               }
            if(parseInt(ePrH) + parseInt(ePrAmPm) == 24)
               {
                    ePrH = 00; 
               }
            if(parseInt(eTdH) + parseInt(eTdAmPm) == 24)
               {
                    eTdH = 00; 
               }
            var StH = parseInt(eStH) + parseInt(eStAmPm);
            var nStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+StH+":"+eStM+":00";
            var EnH = parseInt(eEnH) + parseInt(eEnAmPm);
            var nEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+EnH+":"+eEnM+":00";
            var PrH = parseInt(ePrH) + parseInt(ePrAmPm);
            var nPrepStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+PrH+":"+ePrM+":00";
            var TdH = parseInt(eTdH) + parseInt(eTdAmPm);
            var nTearDownEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+TdH+":"+eTdM+":00";
            console.log("nStart: "+nStart);
             console.log("nEnd: "+nEnd);
             console.log("nPrepStart: "+nPrepStart);
             console.log("nTearDownEnd: "+nTearDownEnd);
            
        }else{
            var nStart = undefined;
            var nEnd = undefined;
            var nPrepStart = undefined;
            var nTearDownEnd = undefined;
        }
        
        if (nPrepStart == undefined || nTearDownEnd == undefined || nStart == undefined || nEnd == undefined)
            {
                callback("At least one time is missing, please check your times.");
                connection.release();
                return;
            }
        
        if (nLocation_Room == undefined || nLocation_Room == "")
            {
                callback("Please choose a room.");
                connection.release();
                return;
            }     
        if(moment(nPrepStart).isAfter(nTearDownEnd))
            {
                callback("Prep time is after tear down time. Please fix this.");
                connection.release();
                return;
            }
        if(moment(nStart).isAfter(nEnd))
            {
                callback("Start time is after end time. Please fix this.");
                connection.release();
                return;
            }
        if(moment(nStart).isBefore(nPrepStart))
            {
                callback("Start time is before preperation time. Please fix this.");
                connection.release();
                return;
            }
        if(moment(nEnd).isAfter(nTearDownEnd))
            {
                callback("End time is after tear down time. Please fix this.");
                connection.release();
                return;
            }
        
        
        if (nLocation_Room == "B-1 Activity" || nLocation_Room == "B-2 Artsy Toddler ‘A’" || nLocation_Room == "B-3 Board" || nLocation_Room == "B-4 Banquet" || nLocation_Room == "B-5 Block" || nLocation_Room == "B-6 Classroom" || nLocation_Room == "B-7 Empty" || nLocation_Room == "B-8 Forum" || nLocation_Room == "B-9 Party" || nLocation_Room == "B-10 Presentation" || nLocation_Room == "B-11 Square" || nLocation_Room == "B-12 Standard 1" || nLocation_Room == "B-13 Standard 2" || nLocation_Room == "B-14 Theater" || nLocation_Room == "B-15 Standard Program 3")
        {
                     
            RoomName = "Scheide Room";
        }else if (nLocation_Room == "C Childrens")
        {
                                
            RoomName = "Childrens Room";   
        }else if (nLocation_Room == "Small Central"){
                        
            RoomName = "Small Conference Room";
        }else if (nLocation_Room == "A-1 Block 1" || nLocation_Room == "A-2 Block 2" || nLocation_Room == "A-3 Classroom 1" || nLocation_Room == "A-4 Classroom 2")
        {
                         
            RoomName = "2nd Floor Conference Room";
        }else if (nLocation_Room == "C-1 Activity" || nLocation_Room == "C-2 Banquet (Rectangle)" || nLocation_Room == "C-3 Banquet (Round)" || nLocation_Room == "C-4 Block" || nLocation_Room == "C-5 Board" || nLocation_Room == "C-6 Classroom 1" || nLocation_Room == "C-7 Classroom 2" || nLocation_Room == "C-8 Craft" || nLocation_Room == "C-9 Empty" || nLocation_Room == "C-10 Forum" || nLocation_Room == "C-11 Presentation" || nLocation_Room == "C-12 Square" || nLocation_Room == "C-13 Standard" || nLocation_Room == "C-14 Theater")
        {
                         
            RoomName = "Miller Room";
        }else if (nLocation_Room == "Keystone")
        {
                         
            RoomName = "Keystone";
        }else if (nLocation_Room == "South")
        {
                         
            RoomName = "South";
        }else if (nLocation_Room == "North")
        {
                         
            RoomName = "North";
        }else if (nLocation_Room == "Bookmobile")
        {
                         
            RoomName = "Bookmobile";
        }else{
            RoomName = nLocation_Room;
        }
        
        
        //put in different version for "other" room type
    connection.query("SELECT events.id FROM eventcal.events WHERE ('"+nPrepStart+"' <= `TearDownEnd`) AND ('"+nTearDownEnd+"' >= `prepStart`) AND ('"+ RoomName +"' = `RoomName`) AND `Deleter` !=1", function(err, rows, fields){
        if (err){
            console.log(err);
            callback(false);
            connection.release();
            return;
        }
        
        console.log(nPrepStart);
        console.log(nTearDownEnd);
        console.log(RoomName);
        //http://stackoverflow.com/questions/19889615/can-an-angular-directive-pass-arguments-to-functions-in-expressions-specified-in
        console.log("Events with same time and rooms:")
        for (var i in rows){
            console.log('Event: ', rows[i].id);
        }        
        if (rows.length != 0){
            console.log('Conflict found. Room is unavailable at specified times');
            callback("The time specified is already taken. Please try again.");
            
        }else if (rows.length == undefined){
            console.log('Rows undefined.');
            callback("Server error, please enter times again");
            
        }else if (rows.length == 0){
            console.log('None! :D');
            console.log('No conflicts! Room is available at specified times');
            callback("Time is available");
        }
    });
        connection.release();
    });
}

var delete_Event = function(eve, callback){
    
    db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in the Login section');
            connection.release();
            callback(false);
            return;
        }        
        
    connection.query("UPDATE `eventcal`.`events` SET `Deleter`='1' WHERE `id`='"+eve+"'", function(err, rows){
             if(!err) {
                callback(true);
            }
                //console.log("Patron "+regFName+" "+regLName+" was moved from the update list.");
        });
        
        connection.query("SELECT * FROM eventcal.events WHERE events.id='"+eve+"'", function(err, rows, fields){
        if (err){
            console.log(err);
            callback(false);
            connection.release();
            return;
        }
            
        
        /*================Mail==========================*/
                 console.log('Emailed to: '+ rows[0].ContMail);
                 console.log('Title: '+ rows[0].title);
                    var mailOptions={
                    to : 'Reciever <'+ rows[0].ContMail +'>',
                    subject :'Event CANCELED',
                    html :
                        "One of your events has recently been canceled. If you believe your event "+rows[0].title+" was canceled by a mistake, please contact a manager to have this fixed.",
                    from: 'Mailer <' + rows[0].ContMail + '>'
                    }

                        console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                    console.log(error);

                    }else{
                    console.log("Message sent: " + response.message);
                    }
                    });
                /*==============================================*/
        });
        
        connection.release();
        callback(true);
    });
    
    
    
                
}

var upd_Wait = function(UpdReg, callback){
    
    db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in the Login section');
            connection.release();
            callback(false);
            return;
        }        
        
    connection.query("UPDATE `eventcal`.`registration` SET `regWait`='0' WHERE `id_Registration`='"+UpdReg+"'", function(err, rows){
             if(!err) {
                callback(true);
            }
                //console.log("Patron "+regFName+" "+regLName+" was moved from the update list.");
        });
        
        connection.query("SELECT * FROM eventcal.registration, eventcal.events  WHERE registration.id_Registration='"+UpdReg+"' && events.id=registration.regEvent", function(err, rows, fields){
        if (err){
            console.log(err);
            callback(false);
            connection.release();
            return;
        }
            
        
        /*================Mail==========================*/
                 console.log('Emailed to: '+ rows[0].regEmail);
                 console.log('Title: '+ rows[0].title)
                    var mailOptions={
                    to : 'EPL Patron <'+ rows[0].regEmail +'>',
                    subject :'Eoved from waiting list',
                    html :
                        "Thank you for your interest in the event: <a href='http://localhost:3000/events/#/event/"+rows[0].id+"'>"+rows[0].title+"</a>. You have been moved to the class list. If you cannot attend please let us know",
                    from: 'Mailer <' + rows[0].regEmail + '>'
                    }

                        console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                    console.log(error);

                    }else{
                    console.log("Message sent: " + response.message);
                    }
                    });
                /*==============================================*/
        });
        
        connection.release();
        callback(true);
    });
    
    
    
                
}

var upd_Remove = function(UpdRem, callback){
    
    db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in the Login section');
            connection.release();
            callback(false);
            return;
        }        
        
    connection.query("UPDATE `eventcal`.`registration` SET `regWait`='2' WHERE `id_Registration`='"+UpdRem+"'", function(err, rows){
             if(!err) {
                callback(true);
            }
                //console.log("Patron "+regFName+" "+regLName+" was moved from the update list.");
        });
        
        
        connection.release();
        callback(true);
    });
}

var Login = function(lUser, lPass, callback){
        //http://stackoverflow.com/questions/21123586/return-node-js-mysql-results-to-a-function 
    db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in the Login section');
            connection.release();
            callback(false);
            return;
        }
        
        if (lUser == undefined && lPass == undefined)
            {
                callback("Please enter your credentials");
                connection.release();
                return;
            }
        
        if (lUser == undefined || lUser == "")
            {
                callback("Please enter User Name");
                connection.release();
                return;
            }
        
        if (lPass == undefined || lPass == "")
            {
                callback("Please enter Password");
                connection.release();
                return;
            }
        
    connection.query("SELECT * FROM eventcal.t_Login WHERE BINARY v_User='"+lUser+"' AND v_Pass='"+lPass+"'", function(err, rows, fields){
        if (err){
            console.log(err);
            callback(false);
            connection.release();
            return;
        }
        //http://stackoverflow.com/questions/19889615/can-an-angular-directive-pass-arguments-to-functions-in-expressions-specified-in
        console.log("Selecting login things")
        for (var i in rows){
            console.log('Event: ', rows[0].v_lLink);
        }        
        if (rows.length != 0){
            console.log('Login Found, sending link');
            //callback("YAY!: "+rows[0].v_lLink);
            callback(rows[0].v_lLink);
            
        }else if (rows.length == undefined){
            console.log('Rows undefined');
            callback("No Results");
            
        }else if (rows.length == 0){
            console.log('0 Results found');
            callback("No Results");
        }
    });
        connection.release();
    });
}

var check_Sched = function(eTitle, eUrl, eAllDay, eDescription, Room, Location, ContMail, ContName, eAttend, ePlaceholder, eComment, ePhone, Age, eMaxAtt, eEquipment, eOptionLoc, eEditor, eStH, eStM, eStAmPm, eEnH, eEnM, eEnAmPm, ePrH, ePrM, ePrAmPm, eTdH, eTdM, eTdAmPm, eStDay, eStMonth, eStYear, callback){
    
    if(eStH != undefined && eStM != undefined && eStAmPm != undefined && eEnH != undefined && eEnM != undefined && eEnAmPm != undefined && ePrH != undefined && ePrM != undefined && ePrAmPm != undefined && eTdH != undefined && eTdM != undefined && eTdAmPm != undefined && eStDay != undefined && eStMonth != undefined && eStYear != undefined){
            var StH = parseInt(eStH) + parseInt(eStAmPm);
            var eStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+StH+":"+eStM+":00";
            var EnH = parseInt(eEnH) + parseInt(eEnAmPm);
            var eEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+EnH+":"+eEnM+":00";
            var PrH = parseInt(ePrH) + parseInt(ePrAmPm);
            var prepStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+PrH+":"+ePrM+":00";
            var TdH = parseInt(eTdH) + parseInt(eTdAmPm);
            var TearDownEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+TdH+":"+eTdM+":00";
             console.log("eStart: "+eStart);
             console.log("eEnd: "+eEnd);
             console.log("prepStart: "+prepStart);
             console.log("TearDownEnd: "+TearDownEnd);
        }else{
            var eStart = undefined;
            var eEnd = undefined;
            var prepStart = undefined;
            var TearDownEnd = undefined;
        }
         
    if(nPrepStart > nTearDownEnd)
        {
            callback("Prep time is after tear down time. Please fix this.");
        }
    if(nStart > nEnd)
        {
            callback("Start time is after end time. Please fix this.");
        }
    if(nStart < nPrepStart)
        {
            callback("Start time is before preperation time. Please fix this.");
        }
    if(nEnd > nTearDownEnd)
        {
            callback("End time is after tear down time. Please fix this.");
        }
    
    if (eTitle == undefined||eTitle=="")
        {
            callback("Please enter a title");
        }
            
    if (eStart == undefined||eStart=="")
        {
            callback("Please enter a Start Time");
        }
            
    if (eEnd == undefined||eEnd=="")
        {
            callback("Please enter an End Time");
        }
              
    if (eAllDay == undefined||eAllDay=="")
        {
            callback("Somehow, Allday button has been undefined. How'd you do that? ");
        }
            
    if (eDescription == undefined||eDescription=="")
        {
            callback("Please enter a Description");
        }
            
    if (prepStart == undefined||prepStart=="")
        {
            callback("Please enter a Preperation time");
        }
            
    if (TearDownEnd == undefined||TearDownEnd=="")
        {
            callback("Please enter a Tear Down Time");
        }
            
    if (Room == undefined||Room=="")
        {
            callback("Please enter a Room");
        }
    
    if (Chairs == undefined||Chairs=="")
        {
            Chairs = '0';
        }
            
    if (Location == undefined||Location=="")
        {
            callback("Please enter a Location");
        }
            
    if (ContMail == undefined||ContMail=="")
        {
            callback("Please enter an Email");
        }
            
    if (ContName == undefined||ContName=="")
        {
            callback("Please enter a Contact Name");
        }
            
    if (eAttend == undefined||eAttend=="")
        {
            callback("Please enter how many are attending");
        }
              
    if (eComment == undefined||eComment=="")
        {
            callback("Please enter a Comment");
        }
            
    if (ePhone == undefined||ePhone=="")
        {
            callback("Please enter a Phone Number");
        }
            
    if (Age == undefined||Age=="")
        {
            callback("Please enter an Age Group");
        }
            
    if (eEquipment == undefined||eEquipment=="")
        {
            callback("Please enter a Equipment needed");
        }
            
    if (eEditor == undefined||eEditor=="")
        {
            callback("Who are you? Have you logged in yet?");
        }
    
    return;
        
}

var add_Regis = function(regAttending, regFName, regLName, regEmail, regPhone, regHearAbout, regEvent, callback){
   
     db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in at the add_Regis section');
            connection.release();
            callback(false);
            return;
        }
         
          //checks if user exists, if not, creates user. 
        connection.query("SELECT AttendCount, ContMail, start, end, prepStart, TearDownEnd, DATE_FORMAT(start, '%b/%d/%Y %I:%i %p') AS fstart, DATE_FORMAT(end, '%b/%d/%Y %I:%i %p') AS fend, DATE_FORMAT(prepStart, '%b/%d/%Y %I:%i %p') AS fprepStart, DATE_FORMAT(TearDownEnd, '%b/%d/%Y %I:%i %p') AS fTearDownEnd, title, AttendCap, Waitlist FROM events WHERE id = '" + regEvent +"'", function(err, rows){
        console.log(err);
        console.log(rows);
            
            
            if(rows[0].AttendCount <=0 || rows[0].AttendCount == undefined){
               connection.query("INSERT INTO `eventcal`.`registration` (`regAttending`, `regFName`, `regLName`, `regEmail`, `regPhone`, `regHearAbout`, `regEvent`, `regWait`, `regEmailed`) VALUES ('" + regAttending + "', '" + regFName + "', '" + regLName + "', '" + regEmail + "', '" + regPhone + "','" + regHearAbout + "','" + regEvent + "','0','0')", function(err, rows){
             if(!err) {
                callback(true);
            }
                   
                    
        });
                
            connection.query("UPDATE `eventcal`.`events` SET `AttendCount`='"+regAttending+"',`Waitlist`='"+(rows[0].Waitlist + regAttending)+"' WHERE `id`='"+regEvent+"'", function(err, rows){
             if(!err) {
                callback(true);
            }
                console.log("AttendCount was updated to 1 from 0 or null")
        });
                
        connection.on('error', function(err) {
            console.log("insert issue found");
            callback(false);
            return;
        });
                
            } else if(parseInt(regAttending) + parseInt(rows[0].Waitlist) > rows[0].AttendCap){
                
                console.log("Put on waiting list");
                console.log("Att= "+regAttending+" Wait= "+rows[0].Waitlist+" Cap="+rows[0].AttendCap)
                var UpdAttCou = rows[0].AttendCount + parseInt(regAttending);
                console.log("UpdAttCou: " +UpdAttCou);
                connection.query("INSERT INTO `eventcal`.`registration` (`regAttending`, `regFName`, `regLName`, `regEmail`, `regPhone`, `regHearAbout`, `regEvent`, `regWait`, `regEmailed`) VALUES ('" + regAttending + "', '" + regFName + "', '" + regLName + "', '" + regEmail + "', '" + regPhone + "','" + regHearAbout + "','" + regEvent + "','1','0')", function(err, rows){
             if(!err) {
                callback(true);
            }
        });
         
         connection.query("UPDATE `eventcal`.`events` SET `AttendCount`='"+UpdAttCou+"' WHERE `id`='"+regEvent+"'", function(err, rows){
             if(!err) {
                callback(true);
                 
            }
        });
         
          connection.on('error', function(err) {
            console.log("insert issue found");
            callback(false);
            connection.release();

            return;
        });
                
            } else {
                console.log("no update");
                
                var UpdAttCou = rows[0].AttendCount + parseInt(regAttending);
                console.log("UpdAttCou: " +UpdAttCou);
                connection.query("INSERT INTO `eventcal`.`registration` (`regAttending`, `regFName`, `regLName`, `regEmail`, `regPhone`, `regHearAbout`, `regEvent`, `regWait`, `regEmailed`) VALUES ('" + regAttending + "', '" + regFName + "', '" + regLName + "', '" + regEmail + "', '" + regPhone + "','" + regHearAbout + "','" + regEvent + "','0','0')", function(err, rows){
             if(!err) {
                callback(true);
            }          
        });
         
         connection.query("UPDATE `eventcal`.`events` SET `AttendCount`='"+UpdAttCou+"',`Waitlist`='"+(rows[0].Waitlist + 1)+"' WHERE `id`='"+regEvent+"'", function(err, rows){
             if(!err) {
                callback(true);
                 
            }
        });
         
          connection.on('error', function(err) {
            console.log("insert issue found");
            callback(false);
            connection.release();

            return;
        });
            }
            
            
            /*================Mail==========================*/
                 console.log('Emailed to: '+ rows[0].ContMail);
                    var mailOptions={
                    to : 'New Registration <'+ rows[0].ContMail +'>',
                    subject :'Registration: '+rows[0].title,
                    html :
                        '<h1>'+rows[0].title+'</h1></br><h3>Name: </h3>'+regFName+' '+regLName+'</br><h3>Email: </h3>'+regEmail+'</br><h3>Phone number: </h3> '+regPhone+'</br><h3>Attending: </h3>'+regAttending+'</br><h3>Start:</h3> '+rows[0].fstart+'</br><h3>End:</h3> '+rows[0].fend+'</br><h3>Setup:</h3> '+rows[0].fprepStart+'</br><h3>Tear Down:</h3> '+rows[0].fTearDownEnd+'</br>',
                    from: 'Patron <' + regEmail + '>'
                    }

                        console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                    console.log(error);

                    }else{
                    console.log("Message sent: " + response.message);
                    }
                    });
                /*==============================================*/
            
            /*================Mail==========================*/
                 console.log('Emailed to: '+ regEmail);
                    var mailOptions={
                    to : 'EPL Patron <'+ regEmail +'>',
                    subject :'Thanks for registering for: '+rows[0].title,
                    html :
                        "<h1>Thank you for registering for: "+rows[0].title+"</h1><br><h3>If your name isn't "+regFName+" "+regLName+", please disregard </h3>",
                    from: 'Mailer <' + regEmail + '>'
                    }

                        console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                    console.log(error);

                    }else{
                    console.log("Message sent: " + response.message);
                    }
                    });
                /*==============================================*/
            
            connection.release();
        });           
         
         


});
}

//speaker Request needed?, patron event, auth for updating 
var update_schedule = function(eTitle, eUrl, eAllDay, eDescription, Room, Location, ContMail, ContName, eAttend, ePlaceholder, eComment, ePhone, Age, eMaxAtt, eEquipment, eOptionLoc, ePatron, eSpeaker, AUTH, eId, RegisCheck, eStH, eStM, eStAmPm, eEnH, eEnM, eEnAmPm, ePrH, ePrM, ePrAmPm, eTdH, eTdM, eTdAmPm, eStDay, eStMonth, eStYear, Chairs, callback){
     db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in at the update_schedule section');
            connection.release();
            callback(false);
            return;
        }

                     
        if (Room == undefined||Room=="")
            {
                callback("Please enter a Room");
                return;
            }
                
        if (Chairs == undefined||Chairs=="")
            {
                Chairs = '0';
            }

         if(eStH != undefined && eStM != undefined && eStAmPm != undefined && eEnH != undefined && eEnM != undefined && eEnAmPm != undefined && ePrH != undefined && ePrM != undefined && ePrAmPm != undefined && eTdH != undefined && eTdM != undefined && eTdAmPm != undefined && eStDay != undefined && eStMonth != undefined && eStYear != undefined){
            var StH = parseInt(eStH) + parseInt(eStAmPm);
            var eStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+StH+":"+eStM+":00";
            var EnH = parseInt(eEnH) + parseInt(eEnAmPm);
            var eEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+EnH+":"+eEnM+":00";
            var PrH = parseInt(ePrH) + parseInt(ePrAmPm);
            var prepStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+PrH+":"+ePrM+":00";
            var TdH = parseInt(eTdH) + parseInt(eTdAmPm);
            var TearDownEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+TdH+":"+eTdM+":00";
        }else{
            var eStart = undefined;
            var eEnd = undefined;
            var prepStart = undefined;
            var TearDownEnd = undefined;
        }
         
         if(RegisCheck == "1")
            {
               eMaxAtt = "0";
            }
         if (eUrl == undefined)
             {
                var uRLBreakPrevent = "#";
                 console.log("eUrl was undefined");
                 console.log(uRLBreakPrevent);
             }
         else
            {
                var uRLBreakPrevent = eUrl;
            }
         
         if(eAllDay == undefined)
             {
                 var alldayBreakPrevent = "false";
                 console.log("eAllDay was undefined");
                 console.log(alldayBreakPrevent);
                 
             }
            else
                {
                    var alldayBreakPrevent = eAllDay;    
                }
         
         if (Room == "Other")
             {
                 var Location_Room = Location;
                 
                 var eBuilding = " ";
                 if(eOptionLoc == undefined || eOptionLoc =="")
                     {
                         callback("Please Describe the location");
                         return;
                     }
             }
         else
             {
                 var Location_Room = Room;
                 var RoomName = "";                 
                 
                 if (Location_Room == "B-1 Activity" || Location_Room == "B-2 Artsy Toddler ‘A’" || Location_Room == "B-3 Board" || Location_Room == "B-4 Banquet" || Location_Room == "B-5 Block" || Location_Room == "B-6 Classroom" || Location_Room == "B-7 Empty" || Location_Room == "B-8 Forum" || Location_Room == "B-9 Party" || Location_Room == "B-10 Presentation" || Location_Room == "B-11 Square" || Location_Room == "B-12 Standard 1" || Location_Room == "B-13 Standard 2" || Location_Room == "B-14 Theater" || Location_Room == "B-15 Standard Program 3" || Location_Room == "C Childrens" || Location_Room == "Central" || Location_Room == "Small Central" )
                     {
                         eBuilding = "Central";
                         
                         if (Location_Room == "B-1 Activity" || Location_Room == "B-2 Artsy Toddler ‘A’" || Location_Room == "B-3 Board" || Location_Room == "B-4 Banquet" || Location_Room == "B-5 Block" || Location_Room == "B-6 Classroom" || Location_Room == "B-7 Empty" || Location_Room == "B-8 Forum" || Location_Room == "B-9 Party" || Location_Room == "B-10 Presentation" || Location_Room == "B-11 Square" || Location_Room == "B-12 Standard 1" || Location_Room == "B-13 Standard 2" || Location_Room == "B-14 Theater" || Location_Room == "B-15 Standard Program 3")
                             {
                                RoomName = "Scheide Room";     
                             }else if (Location_Room == "C Childrens")
                             {
                                RoomName = "Childrens Room";   
                             }else if (Location_Room == "Small Central")
                             {
                                 RoomName = "Small Conference Room";
                             }else{
                                 RoomName = "Central";
                             }
                         
                     }


                 if (Location_Room == "C-1 Activity" || Location_Room == "C-2 Banquet (Rectangle)" || Location_Room == "C-3 Banquet (Round)" || Location_Room == "C-4 Block" || Location_Room == "C-5 Board" || Location_Room == "C-6 Classroom 1" || Location_Room == "C-7 Classroom 2" || Location_Room == "C-8 Craft" || Location_Room == "C-9 Empty" || Location_Room == "C-10 Forum" || Location_Room == "C-11 Presentation" || Location_Room == "C-12 Square" || Location_Room == "C-13 Standard" || Location_Room == "C-14 Theater" || Location_Room == "A-1 Block 1" || Location_Room == "A-2 Block 2" || Location_Room == "A-3 Classroom 1" || Location_Room == "A-4 Classroom 2" || Location_Room == "WR Childrens" || Location_Room == "Teen Lounge" || Location_Room == "Tutor Room #1" || Location_Room == "Tutor Room #2" || Location_Room == "Tutor Room #3" || Location_Room == "1st Floor Open Area" || Location_Room == "2nd Floor Open Area")
                     {
                         eBuilding = "West River";
                         
                         if (Location_Room == "A-1 Block 1" || Location_Room == "A-2 Block 2" || Location_Room == "A-3 Classroom 1" || Location_Room == "A-4 Classroom 2")
                         {
                             RoomName = "2nd Floor Conference Room";
                             
                         }else if(Location_Room == "C-1 Activity" || Location_Room == "C-2 Banquet (Rectangle)" || Location_Room == "C-3 Banquet (Round)" || Location_Room == "C-4 Block" || Location_Room == "C-5 Board" || Location_Room == "C-6 Classroom 1" || Location_Room == "C-7 Classroom 2" || Location_Room == "C-8 Craft" || Location_Room == "C-9 Empty" || Location_Room == "C-10 Forum" || Location_Room == "C-11 Presentation" || Location_Room == "C-12 Square" || Location_Room == "C-13 Standard" || Location_Room == "C-14 Theater")
                         {
                             
                           RoomName = "Miller Room"; 
                             
                         }else if(Location_Room == "WR Childrens")
                         {
                            RoomName = "Childrens"; 
                         }else{
                            RoomName = Location_Room;
                         }
        
                     }
                 
                 if (Location_Room == "Keystone")
                     {
                         eBuilding = "Keystone";
                         RoomName = "Keystone";
                     }

                 if (Location_Room == "South")
                     {
                         eBuilding = "South";
                         RoomName = "South";
                     }

                 if (Location_Room == "North" || Location_Room == "Room 210" || Location_Room == "Room 231" || Location_Room == "LC125")
                     {
                         eBuilding = "North";
                         
                         if (Location_Room == "North")
                            { 
                                RoomName = "North";
                            }else{
                                RoomName = Location_Room;
                            }   
                         
                     }

                 if (Location_Room == "Bookmobile")
                     {
                         eBuilding = "Bookmobile";
                         RoomName = "Bookmobile";
                     }
                 console.log(eBuilding);
             }
         
        var sReplace = eStart;
        var eReplace = eEnd;
        var pReplace = prepStart;
        var tReplace = TearDownEnd;
         
         //remove 0's in query
         connection.query("UPDATE `eventcal`.`events` SET `title`='"+eTitle+"', `start`='"+sReplace+"', `end`='"+eReplace+"', `url`='"+uRLBreakPrevent+"', `allDay`='"+alldayBreakPrevent+"', `eDescription`='"+eDescription+"', `prepStart`='"+pReplace+"', `TearDownEnd`='"+tReplace+"', `Location_Room`='"+Location_Room+"', `ContMail`='"+ContMail+"', `ContName`='"+ContName+"', `Attendance`='"+eAttend+"', `Placeholder`='"+ePlaceholder+"', `Comment`='"+eComment+"', `ePhone`='"+ePhone+"', `AttendCount`='0', `Building`='"+eBuilding+"', `Age`='"+Age+"', `AttendCap`='"+eMaxAtt+"', `Equipment`='"+eEquipment+"', `OtherDesc`='"+eOptionLoc+"', `RoomName`='"+RoomName+"', `Chairs`='"+Chairs+"' WHERE `id`='"+eId+"';", function(err, rows){
             if(!err) {
                callback(true);
            }
             
             if (AUTH == "Lyn" || AUTH == "Jen" || AUTH == "Lakesha")
             {
                 var chec = "";
                 if(AUTH == "Lyn")
                     {
                        chec = "CheckLy";
                     }
                 if(AUTH == "Jen")
                     {
                        chec = "CheckJ";
                     }
                 if(AUTH == "Lakesha")
                     {
                        chec = "CheckLak";
                     }
                 
            connection.query("UPDATE `eventcal`.`events` SET `"+chec+"`='1' WHERE `id`='"+eId+"';", function(err, rows){
             if(!err) {
                callback(true);
            }
                 console.log("Updated Manager acceptance: "+chec);
             });
                 
               connection.on('error', function(err) {
                    console.log("insert issue found");
                    callback(false);
                    connection.release();

                    return;
                });
             }
                    
             
                console.log("Update successful");
        });
           
         
          connection.on('error', function(err) {
            console.log("insert issue found");
            callback(false);
            connection.release();

            return;
        });
         
         /*================Mail==========================*/
                 console.log('Emailed to: '+ ContMail);
                    var mailOptions={
                    to : 'Event updated <'+ ContMail +'>',
                    subject :'Updated Event: '+ eTitle,
                    html :
                        '<h1>'+eTitle+' has been updated by:</h1></br>'+AUTH+'</br></br>',
                    from: 'Updated <' + ContMail + '>'
                    }

                        console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                    console.log(error);

                    }else{
                    console.log("Message sent: " + response.message);
                    }
                    });
                /*==============================================*/
         
    connection.release();
    console.log("connection released");

});
}

var add_schedule = function(eTitle, eUrl, eAllDay, eDescription, Room, Location, ContMail, ContName, eAttend, ePlaceholder, eComment, ePhone, Age, eMaxAtt, eEquipment, eOptionLoc, eEditor, RegisCheck, eSpeaker, eStH, eStM, eStAmPm, eEnH, eEnM, eEnAmPm, ePrH, ePrM, ePrAmPm, eTdH, eTdM, eTdAmPm, eStDay, eStMonth, eStYear, Chairs, callback){
    
    /*http://stackoverflow.com/questions/6603015/check-whether-a-string-matches-a-regex*/
    var emailTester = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(ContMail);
    console.log(Location);
     db.getConnection(function(err, connection){
        if(err){
            console.log('there was an issue in at the add_schedule section');
            connection.release();
            callback(false);
            return;
        }
         
         var iID = "";
         
         if(eStH != undefined && eStM != undefined && eStAmPm != undefined && eEnH != undefined && eEnM != undefined && eEnAmPm != undefined && ePrH != undefined && ePrM != undefined && ePrAmPm != undefined && eTdH != undefined && eTdM != undefined && eTdAmPm != undefined && eStDay != undefined && eStMonth != undefined && eStYear != undefined){
             
             if(parseInt(eStH) + parseInt(eStAmPm) == 24)
               {
                    eStH = 00; 
               }
            if(parseInt(eEnH) + parseInt(eEnAmPm) == 24)
               {
                    eEnH = 00; 
               }
            if(parseInt(ePrH) + parseInt(ePrAmPm) == 24)
               {
                    ePrH = 00; 
               }
            if(parseInt(eTdH) + parseInt(eTdAmPm) == 24)
               {
                    eTdH = 00; 
               }
            var StH = parseInt(eStH) + parseInt(eStAmPm);
            var eStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+StH+":"+eStM+":00";
            var EnH = parseInt(eEnH) + parseInt(eEnAmPm);
            var eEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+EnH+":"+eEnM+":00";
            var PrH = parseInt(ePrH) + parseInt(ePrAmPm);
            var prepStart = eStYear+"-"+eStMonth+"-"+eStDay+" "+PrH+":"+ePrM+":00";
            var TdH = parseInt(eTdH) + parseInt(eTdAmPm);
            var TearDownEnd = eStYear+"-"+eStMonth+"-"+eStDay+" "+TdH+":"+eTdM+":00";
             console.log(eStart);
             console.log(eEnd);
             console.log(prepStart);
             console.log(TearDownEnd);
        }else{
            var eStart = undefined;
            var eEnd = undefined;
            var prepStart = undefined;
            var TearDownEnd = undefined;
        }

         console.log("We've reached add_schedule");
    
    if(prepStart > TearDownEnd)
        {
            callback("Prep time is after tear down time. Please fix this.");
            return;
        }
    if(eStart > eEnd)
        {
            callback("Start time is after end time. Please fix this.");
            return;
        }
    if(eStart < prepStart)
        {
            callback("Start time is before preperation time. Please fix this.");
            return;
        }
    if(eEnd > TearDownEnd)
        {
            callback("End time is after tear down time. Please fix this.");
            return;
        }
    
    if (eTitle == undefined||eTitle=="")
        {
            callback("Please enter a title");
            return;
        }
            
    if (eStart == undefined||eStart=="")
        {
            callback("Please enter a Start Time");
            return;
        }
            
    if (eEnd == undefined||eEnd=="")
        {
            callback("Please enter an End Time");
            return;
        }
              
    if (eAllDay == undefined||eAllDay=="")
        {
            callback("Somehow, Allday button has been undefined. How'd you do that? ");
            return;
        }
         
    if (prepStart == undefined||prepStart=="")
        {
            callback("Please enter a Preperation time");
            return;
        }
            
    if (TearDownEnd == undefined||TearDownEnd=="")
        {
            callback("Please enter a Tear Down Time");
            return;
        }
            
    if (Room == undefined||Room=="")
        {
            callback("Please enter a Room");
            return;
        }
            
    if (Chairs == undefined||Chairs=="")
        {
            Chairs = '0';
        }
         
    if(emailTester != true)
        {
            callback("Email is not valid");
            return;
            console.log("Email tester = false "+ emailTester);
        }
         
    if (ContMail == undefined||ContMail=="")
        {
            callback("Please enter an Email");
            return;
        }
            
    if (ContName == undefined||ContName=="")
        {
            callback("Please enter a Contact Name");
            return;
        }     
        
    if (ePhone == undefined||ePhone=="")
        {
            callback("Please enter a Phone Number");
            return;
        }
    
    if (eEditor == undefined||eEditor=="")
        {
            callback("Who are you? Have you logged in yet?");
            return;
        }    
    
    if (eUrl == undefined)
             {
                var uRLBreakPrevent = "#";
                 console.log("eUrl was undefined");
                 console.log(uRLBreakPrevent);
             }
         else
            {
                var uRLBreakPrevent = eUrl;
            }
         
         if(eAllDay == undefined)
             {
                 var alldayBreakPrevent = "false";
                 console.log("eAllDay was undefined");
                 console.log(alldayBreakPrevent);
                 
             }
            else
                {
                    var alldayBreakPrevent = eAllDay;    
                }
         if(RegisCheck == "1")
            {
               eMaxAtt = "0";
            }
         
         if (Room == "Other")
             {
                 var RoomName = "";
                 
                 var Location_Room = Location;
                 
                 var eBuilding = "Other";
                 
                 RoomName = Location;
                 
                 if(eOptionLoc == undefined || eOptionLoc =="")
                     {
                         callback("Please Describe the location");
                         return;
                     }
             }
         else
             {
                 var Location_Room = Room;
                 var RoomName = "";
                 
                 
                 if (Location_Room == "B-1 Activity" || Location_Room == "B-2 Artsy Toddler ‘A’" || Location_Room == "B-3 Board" || Location_Room == "B-4 Banquet" || Location_Room == "B-5 Block" || Location_Room == "B-6 Classroom" || Location_Room == "B-7 Empty" || Location_Room == "B-8 Forum" || Location_Room == "B-9 Party" || Location_Room == "B-10 Presentation" || Location_Room == "B-11 Square" || Location_Room == "B-12 Standard 1" || Location_Room == "B-13 Standard 2" || Location_Room == "B-14 Theater" || Location_Room == "B-15 Standard Program 3" || Location_Room == "C Childrens" || Location_Room == "Central" || Location_Room == "Small Central" )
                     {
                         eBuilding = "Central";
                         
                         if (Location_Room == "B-1 Activity" || Location_Room == "B-2 Artsy Toddler ‘A’" || Location_Room == "B-3 Board" || Location_Room == "B-4 Banquet" || Location_Room == "B-5 Block" || Location_Room == "B-6 Classroom" || Location_Room == "B-7 Empty" || Location_Room == "B-8 Forum" || Location_Room == "B-9 Party" || Location_Room == "B-10 Presentation" || Location_Room == "B-11 Square" || Location_Room == "B-12 Standard 1" || Location_Room == "B-13 Standard 2" || Location_Room == "B-14 Theater" || Location_Room == "B-15 Standard Program 3")
                             {
                                RoomName = "Scheide Room";     
                             }else if (Location_Room == "C Childrens")
                             {
                                RoomName = "Childrens Room";   
                             }else if (Location_Room == "Small Central")
                             {
                                 RoomName = "Small Conference Room";
                             }else{
                                 RoomName = "Central";
                             }
                         
                     }


                 if (Location_Room == "C-1 Activity" || Location_Room == "C-2 Banquet (Rectangle)" || Location_Room == "C-3 Banquet (Round)" || Location_Room == "C-4 Block" || Location_Room == "C-5 Board" || Location_Room == "C-6 Classroom 1" || Location_Room == "C-7 Classroom 2" || Location_Room == "C-8 Craft" || Location_Room == "C-9 Empty" || Location_Room == "C-10 Forum" || Location_Room == "C-11 Presentation" || Location_Room == "C-12 Square" || Location_Room == "C-13 Standard" || Location_Room == "C-14 Theater" || Location_Room == "A-1 Block 1" || Location_Room == "A-2 Block 2" || Location_Room == "A-3 Classroom 1" || Location_Room == "A-4 Classroom 2" || Location_Room == "WR Childrens" || Location_Room == "Teen Lounge" || Location_Room == "Tutor Room #1" || Location_Room == "Tutor Room #2" || Location_Room == "Tutor Room #3" || Location_Room == "1st Floor Open Area" || Location_Room == "2nd Floor Open Area")
                     {
                         eBuilding = "West River";
                         
                         if (Location_Room == "A-1 Block 1" || Location_Room == "A-2 Block 2" || Location_Room == "A-3 Classroom 1" || Location_Room == "A-4 Classroom 2")
                         {
                             RoomName = "2nd Floor Conference Room";
                             
                         }else if(Location_Room == "C-1 Activity" || Location_Room == "C-2 Banquet (Rectangle)" || Location_Room == "C-3 Banquet (Round)" || Location_Room == "C-4 Block" || Location_Room == "C-5 Board" || Location_Room == "C-6 Classroom 1" || Location_Room == "C-7 Classroom 2" || Location_Room == "C-8 Craft" || Location_Room == "C-9 Empty" || Location_Room == "C-10 Forum" || Location_Room == "C-11 Presentation" || Location_Room == "C-12 Square" || Location_Room == "C-13 Standard" || Location_Room == "C-14 Theater")
                         {
                             
                           RoomName = "Miller Room"; 
                             
                         }else if(Location_Room == "WR Childrens")
                         {
                            RoomName = "Childrens"; 
                         }else{
                            RoomName = Location_Room;
                         }
        
                     }
                 
                 if (Location_Room == "Keystone")
                     {
                         eBuilding = "Keystone";
                         RoomName = "Keystone";
                     }

                 if (Location_Room == "South")
                     {
                         eBuilding = "South";
                         RoomName = "South";
                     }

                 if (Location_Room == "North" || Location_Room == "Room 210" || Location_Room == "Room 231" || Location_Room == "LC125")
                     {
                         eBuilding = "North";
                         
                         if (Location_Room == "North")
                            { 
                                RoomName = "North";
                            }else{
                                RoomName = Location_Room;
                            }   
                         
                     }

                 if (Location_Room == "Bookmobile")
                     {
                         eBuilding = "Bookmobile";
                         RoomName = "Bookmobile";
                     }
                 console.log(eBuilding);
             }
              
         console.log("Placeholder: "+ePlaceholder);
    /*========Placeholder events============*/
    if(ePlaceholder == 1)
        {
            console.log("Placeholder event created");
            connection.query("INSERT INTO `eventcal`.`events` (`title`, `start`, `end`, `url`, `allDay`, `prepStart`, `TearDownEnd`, `Location_Room`, `ContMail`, `ContName`, `CheckLy`, `CheckJ`, `CheckLak`, `Placeholder`, `ePhone`, `AttendCount`, `Building`, `OtherDesc`, `Editor`, `RoomName`,`Waitlist`,`Deleter`) VALUES ('" + eTitle + "', '" + eStart + "', '" + eEnd + "', '" + uRLBreakPrevent + "', '" + alldayBreakPrevent + "','" + prepStart + "','" + TearDownEnd + "','" + Location_Room +  "','" + ContMail +  "','" + ContName + "', 0, 0, 0, '"+ePlaceholder+"', '"+ePhone+"', '0','" +eBuilding+ "','" +eOptionLoc+ "','"+eEditor+"','"+RoomName+"','0','0')", function(err, rows){
                if(!err) {
                    callback(true);
                }
            });
         
            connection.on('error', function(err) {
                console.log("insert issue found in placeholder");
                callback(false);
                connection.release();

                return;
            });
            connection.release();
            return
        }
    /*====================*/
            
    if (eDescription == undefined||eDescription=="")
        {
            eDescription = "None";
        }
            
    if (eAttend == undefined||eAttend=="")
        {
            callback("Please enter how many are attending");
            return;
        }
              
    if (eComment == undefined||eComment=="")
        {
            eComment = "None";
        }
              
    if (Age == undefined||Age=="")
        {
            callback("Please enter an Age Group");
            return;
        }
            
    if (eMaxAtt == undefined||eMaxAtt=="")
        {
            eMaxAtt = "0";
        }
            
    if (eEquipment == undefined||eEquipment=="")
        {
            eEquipment = "None";
        }
         
/*===============Send to database===============*/ 
         connection.query("INSERT INTO `eventcal`.`events` (`title`, `start`, `end`, `url`, `allDay`, `eDescription`, `prepStart`, `TearDownEnd`, `Location_Room`, `ContMail`, `ContName`, `CheckLy`, `CheckJ`, `CheckLak`, `Attendance`, `Placeholder`, `Comment`, `ePhone`, `AttendCount`, `Building`, `Age`, `AttendCap`, `Equipment`, `OtherDesc`, `Editor`, `RoomName`,`Waitlist`, `Chairs`, `Deleter`) VALUES ('" + eTitle + "', '" + eStart + "', '" + eEnd + "', '" + uRLBreakPrevent + "', '" + alldayBreakPrevent + "','" + eDescription + "','" + prepStart + "','" + TearDownEnd + "','" + Location_Room +  "','" + ContMail +  "','" + ContName + "', 0, 0, 0, '"+ eAttend +"', 0, '"+eComment+"', '"+ePhone+"', '0','"+eBuilding+"','"+Age+"','"+eMaxAtt+"','"+eEquipment+"','"+eOptionLoc+"','"+eEditor+"','"+RoomName+"','0', '"+Chairs+"', '0')", function(err, rows){
            if(!err) {
                callback(true);
            }
             console.log("Insert id: "+rows.insertId);
             iID = rows.insertId;
             console.log("iID: "+ iID)
             
         /*================Mail==========================*/
                 console.log('Emailed to: '+ ContMail);
                 console.log('iID before mailing: '+ iID);
                    var mailOptions={
                    to : 'New Event <'+ ContMail +'>',
                    subject :'New event successful: '+eTitle,
                    html :
                        '<h1> You have created an event called: '+eTitle+'</h1></br> <a href="http://localhost/epl/eventkeeper/events/#/event/'+iID+'">http://localhost/epl/eventkeeper/events/#/event/'+iID+'</a></br></br>',
                    from: 'New event <' + ContMail + '>'
                    }

                        console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                    console.log(error);

                    }else{
                    console.log("Message sent: " + response.message);
                    }
                    });
                /*==============================================*/
        });
         
          connection.on('error', function(err) {
            console.log("insert issue found");
            callback(false);
            connection.release();

            return;
        });
         
         
        
    connection.release();

});
}