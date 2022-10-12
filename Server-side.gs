//var Mastersheet = "1K5YTfrUBAALlbRIIMBwdgHGMRQnn3WUs6dMrsOW-jVM"; //production mastersheet.  Only uncomment when ready to go live.
var Mastersheet = '1BvAn9Ojq9nSrMYfkDeN9N3AE4BVmpxh9d-XVyyP5b38'; // this is the DEV mastersheet.  Copy where things can be changed freely.
function doGet(e) {
   // Route.path("Info", loadInfo);
    var tmp = HtmlService.createTemplateFromFile("RoomLog");
    if(e.parameters.room)
    {
      //reserved
      Logger.log("test value room = "+e.parameters.room);
      var Roomname = String(e.parameters.room);
      var bldgcode = Roomname[0]+Roomname[1]+Roomname[2]+Roomname[3];
      var roomcode = "";
      Logger.log("string test:  "+Roomname[0]+Roomname[1]+Roomname[2]+Roomname[3]);
      for(i=4; i < Roomname.length; i++)
      {
        roomcode = roomcode + Roomname[i];
      }
      var fullroom = bldgcode+" "+roomcode;
      Logger.log("finalized string: "+fullroom)
      tmp.prefill = fullroom;
      tmp.title = "Room Logs";
      return tmp.evaluate();
    }
    else
    {
      tmp.title = "Room Logs";
      tmp.prefill = "";
      return tmp.evaluate();
    }
}

function clicktest()
{
  Logger.log("The button has been pressed");
}


function importRoominfo(room)
{
  Logger.log("function initialized successfully!");
  var roomsheet = "RoomLogs";
  var ss = SpreadsheetApp.openById(Mastersheet);
  var ws = ss.getSheetByName(roomsheet);
  var cv = ws.getLastColumn();
  var rv = ws.getLastRow();
  var data = ws.getDataRange().getValues();
  var target = 0;
  for(var i = 0; i < rv; i++)
  {
    if(data[i][0].toLowerCase() == room.toLowerCase())
    {
     target = i;
    // Logger.log("target defined as: "+target);
     break;
    }
  }
  if (target == 0)
  {
    Logger.log("No such room as: "+room)
    return -1;
  }
  else
  {
   var returndata = {};
   for(var j = 0; j < cv; j++)
   {
     Logger.log("key will be: "+data[0][j]+"\n Value is: "+data[target][j]);
     returndata[data[0][j]]=data[target][j];
   }
   /* for(var k = 0; k < rv; k++)
   {Logger.log(returndata[data[0][k]])} */
   Load_devices(room,returndata);
   Load_serials(returndata);
   return JSON.stringify(returndata);
  }
}

function Load_devices(room, array)
{
  var devicesheet = "DeviceLogs";
  var ss = SpreadsheetApp.openById(Mastersheet);
  var ws = ss.getSheetByName(devicesheet);
  var cv = ws.getLastColumn();
  var rv = ws.getLastRow();
  var data = ws.getDataRange().getValues();
  var target = [];
  var arcount = 0;
  array["Keys"] = data[0];
  for(var l = 0; l<cv; l++)
  {
    switch (array["Keys"][l])
    {
      case "Model":
        var modelkey = l;
        break;
      case "Serial":
        var serialkey = l;
        break;
      case "LogURL":
        var logkey = l;
        break;
      default:
    }
  }
  for(var i = 0; i < rv; i++)
  {
    if(data[i][0].toLowerCase() == room.toLowerCase())
    {
     target[arcount++] = i;
    }
  }
  for(var j = 0; j < target.length; j++)
  {
  //the following hard coding will be replaced with a "settings page in the master sheet"
    
    var temparray = data[target[j]];
    var model = data[target[j]][modelkey];
    var stringph = '';
    // let's clean all of this up with a switch statement later.
    if(model == "MPS 602 no amp" || model == "IN 1608" || model == "IN 1606" || model == "MPS 602 SA" || model == "MPS 602 MA")
    {
      array["SwitcherLog"] = data[target[j]][logkey];
      array["SwitcherID"] = data[target[j]][serialkey];
      Logger.log("Sheet has: "+data[target[j]][serialkey]+"\nArray has: "+array["SwitcherID"])
      
      for(var k = 0; k < temparray.length; k++)
      {
        stringph = stringph.concat("<p>"+array["Keys"][k]+": "+temparray[k]+"</p>");
        // Logger.log(stringph);
      }
      //Logger.log(stringph);
      array["SwitcherInfo"] = stringph;
    }
    if(model == "MLC 226" || model == "MLC 104")
    {
      array["ControllerLog"] = data[target[j]][logkey];
      array["ControllerID"] = data[target[j]][serialkey];
    //  Logger.log("Sheet has: "+data[target[j]][serialkey]+"\nArray has: "+array["ControllerID"])
      for(var k = 0; k < temparray.length; k++)
      {
        stringph = stringph.concat("<p>"+array["Keys"][k]+": "+temparray[k]+"</p>");
      //  Logger.log(stringph);
      }
      array["ControllerInfo"] = stringph;
    }
    if(model == "DSW 233 4k Tx" || model == "UWP 232 Tx" || model == "XTP T USW 103" || model == "DTP USW 233 Tx")
    {
      array["TransmitterLog"] = data[target[j]][logkey];
      array["TransmitterID"] = data[target[j]][serialkey];
     // Logger.log("Sheet has: "+data[target[j]][serialkey]+"\nArray has: "+array["TransmitterID"])
      for(var k = 0; k < temparray.length; k++)
      {
        stringph = stringph.concat("<p>"+array["Keys"][k]+": "+temparray[k]+"</p>");
       // Logger.log(stringph);
      }
      array["TransmitterInfo"] = stringph;
    }
    if(model == "HDMI 230 Rx" || model == "XTP R HDMI")
    {
      array["ReceiverLog"] = data[target[j]][logkey];
      array["ReceiverID"] = data[target[j]][serialkey];
     // Logger.log("Sheet has: "+data[target[j]][serialkey]+"\nArray has: "+array["ReceiverID"])
      for(var k = 0; k < temparray.length; k++)
      {
        stringph = stringph.concat("<p>"+array["Keys"][k]+": "+temparray[k]+"</p>");
       // Logger.log(stringph);
      }
      array["ReceiverInfo"] = stringph;
    }
    
  }
}

function Load_serials(array)
{
  var devicesheet = "DeviceLogs";
  var ss = SpreadsheetApp.openById(Mastersheet);
  var ws = ss.getSheetByName(devicesheet);
  var cv = ws.getLastColumn();
  var rv = ws.getLastRow();
  var data = ws.getDataRange().getValues();
  var switcher = [];
  var transmitter = [];
  var controller = [];
  var receiver = [];
  var dsp = [];
  for(var i = 0; i<(rv-1); i++)
  {
    Logger.log(data[i+1][0]);
    // pushing the result into an array is a great way to make a list in an array.
    switch (data[i+1][2])
    {
        case "MPS 602 SA":
          switcher.push(data[i+1][3]);
          break;
        case "MPS 602 MA":
          switcher.push(data[i+1][3]);
          break;
        case "MPS 602 no amp":
          switcher.push(data[i+1][3]);
          break;
        case "IN 1606":
          switcher.push(data[i+1][3]);
          break;
        case "IN 1608":
          switcher.push(data[i+1][3]);
          break;
        case "MLC 104":
          controller.push(data[i+1][3]);
          break;
        case "MLC 226":
          controller.push(data[i+1][3]);
          break;
        case "XTP R HDMI":
          receiver.push(data[i+1][3]);
          break;
        case "HDMI 230 Rx":
          receiver.push(data[i+1][3]);
          break;
        case "UWP 232 Tx":
          transmitter.push(data[i+1][3]);
          break;  
        case "DSW 233 4k Tx":
          transmitter.push(data[i+1][3]);
          break;
        case "USW 233 Tx":
          transmitter.push(data[i+1][3]);
          break;
        case "USP 232 Tx":
          transmitter.push(data[i+1][3]);
          break;
        case "XTP T USW 103":
          transmitter.push(data[i+1][3]);
          break;
        case "DMP 44":
          dsp.push(data[i+1][3]);
          break;
        default:
          console.log("EOL or error on line: "+(i+1));
    }
  }
  array["SwitcherSerials"] = switcher;
  //Logger.log("Switcher Serials: "+switcher);
  array["ControlTypeSerials"] = controller;
 // Logger.log("Control Serials: "+controller);
  array["ReceiverSerials"] = receiver;
  //Logger.log("Receiver Serials: "+receiver);
  array["TransmitterSerials"] = transmitter;
  //Logger.log("Transmitter Serials: "+transmitter);
  array["DSPSerials"] = dsp;
  //Logger.log("DSP Serials: "+dsp);
}

function importALLrooms()
{
  var roomsheet = "RoomLogs";
  var ss = SpreadsheetApp.openById(Mastersheet);
  var ws = ss.getSheetByName(roomsheet);
  var cv = ws.getLastColumn();
  var rv = ws.getLastRow();
  var data = ws.getDataRange().getValues();
  var returndata = [];
  for(var i = 0; i < rv; i++)
  {
    returndata[i] = data[i][0];
  }
  return JSON.stringify(returndata);
}

function DeviceSwap_server(room, newserial, oldserial)
{
  Logger.log("Devswap called!")
  Logger.log("oldserial is: "+oldserial+"\nNewserial is: "+newserial)
  if(newserial == oldserial)
  {
    return 3;
  }
  var devsheet = SpreadsheetApp.openById(Mastersheet).getSheetByName("DeviceLogs");
  var data = devsheet.getDataRange().getValues();
  var cv = devsheet.getLastColumn();
  var rv = devsheet.getLastRow();
  var roomcol = 0;
  var serialcol = 0;
  var logcol =0;
  var KEY = data[0];
  var oarr = [];
  var narr = [];
  for(var i =0; i<cv; i++)
  {
    switch(data[0][i])
    {
      case "Room":
        roomcol = i;
        Logger.log("Room column found")
        break;
      case "Serial":
        serialcol = i;
        Logger.log("Serial column found")
        break;
      case "LogURL":
        logcol = i;
        Logger.log("log column found: "+data[0][i])
        break;
      default:
    }
  }
  Logger.log("Entering for loop")
  //creating placeholder variables to store the row value we found our targets at.  Going to do the swap outside of the loop so that when an invalid serial number gets passed into new we can end without changing anything.
  var osm = 0;
  var nsm = 0;
  for(var j = 0; j < rv; j++)
  {
    if(data[j][serialcol] == oldserial)
    {
      osm = j;
    }
    if(data[j][serialcol] == newserial)
    {
      nsm = j;
    }
    else
    {
      continue;
    }
  }
  if(nsm != 0)
  {
    Logger.log("Old serial found: "+data[osm][serialcol]+" Room is: "+data[osm][roomcol])
    Logger.log("new serial found: "+data[nsm][serialcol]+" Room is: "+data[nsm][roomcol])
    var ocell = devsheet.getRange((osm+1), (roomcol+1)).setValue("Inventory");
    
    var olog = DocumentApp.openByUrl(data[osm][logcol]+"/edit");
    
    var ncell = devsheet.getRange((nsm+1), (roomcol+1)).setValue(room);
    
    var nlog = DocumentApp.openByUrl(data[nsm][logcol]+"/edit");
    
    var newdata = devsheet.getDataRange().getValues();
    oarr = newdata[osm];
    narr = newdata[nsm];
    updatelog(oarr, olog, narr, nlog, KEY, room);
    Logger.log("New room for: "+oldserial+" "+newdata[(osm+1)][(roomcol+1)]+"\nNew Room for: "+newserial+" "+newdata[(nsm+1)][(roomcol+1)]);
    Logger.log("End of function");
    return 1;
  }
  if(nsm == 0)
  {
    return 2;
  }
  else
  {
    return 0;
  }
}

function newdevice_server(data)
{
 /* var data = {
    role: "testdev",
    roleother: "devother",
    model: "testmodel",
    modelother: "modother",
    room: "TEST A123",
    serial: "A123456",
    manfacturer: "JA INC",
    firmware: "1.00",
    engrev: "AA123",
    rma: "",
    devhist: "this is a test",
    devnote: "this is a test"
  }; */
  Logger.log("Server side newdevice triggered.\nData received: "+data.role);
  var role = data.role;
  var model = data.model;
  var keys = [];
  if(data.roleother != "")
  {
    role = data.roleother;
  }
  if(data.modelother != "")
  {
    model = data.modelother;
  }
  var docurl = 'https://docs.google.com/document/d/';
  var doc = DocumentApp.create(model+'-'+data.serial);
  var UI = doc.getId();
  var logURL = docurl+UI;
  var time_sub = new Date();
  var user_sub = Session.getActiveUser().getEmail();
  var master = SpreadsheetApp.openById(Mastersheet);
  var devsheet = master.getSheetByName("DeviceLogs");
  var rv = devsheet.getLastRow();
  var cv = devsheet.getLastColumn();
  var QRph = String(data.room);
  var QR = QRph.split(" ").join("");
  Logger.log(QRph);
  var shdata = devsheet.getDataRange().getValues();
  for(var l = 0; l<cv; l++)
  {
    switch (shdata[0][l])
    {
      case "Model":
        var modelkey = l;
        break;
      case "Serial":
        var serialkey = l;
        break;
      case "Role":
        var rolekey = l;
        break;
        case "Room":
        var roomkey = l;
        break;
      default:
    }
  }
   for(var q = 0; q < rv; q++)
  {
    if(shdata[q][roomkey] == data.room && shdata[q][rolekey] == data.role)
    {
      var cell = devsheet.getRange((q+1), (roomkey+1)).setValue("Inventory");
    }
  } 
  Logger.log("modded room code is now: "+QR);
 /* for(var i = 0; i < cv; i++)
  {
    keys[i] = shdata[0][i];
   // Logger.log(keys[i]);
  } */
  for(var i = 0; i < rv; i++)
  {
    switch(shdata[0][i])
    {
      case "Room":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.room);
        break;
      case "Role":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(role);
        break;
      case "Model":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(model);
        break;
      case "Serial":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.serial);
        break;
      case "Manufacturer":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.manufacturer);
        break;
      case "Firmware":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.firmware);
        break;
      case "EngineeringRevision":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.engrev);
        break;
      case "RMA":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.rma);
        break;
      case "History":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.devhist);
        break;
      case "Notes":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(data.devnote);
        break;
      case "LogURL":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(logURL);
        break;
      case "TimeStamp":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(time_sub);
        break;
      case "User":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue(user_sub);
        break;
      case "LogQR":
        var cell = devsheet.getRange((rv + 1), (i+1)).setValue('=image("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://script.google.com/a/colorado.edu/macros/s/AKfycbzu18ZCvfTho_M3ND7h4hNQT7LvG6uoF42XbyU56MB7/dev?room='+QR+'", 4, 150, 150)');
        break;
        
    }
  }
  
  // adding content to changelog.
  var pc = 0;
  var body = doc.getBody();
  body.insertHorizontalRule(pc++);
  data.time = new Date();
  data.user = Session.getActiveUser().getEmail();
  
   var message = "updated: "+data.time+"\n"+
    "Submitted by: "+data.user+"\n"+
    "Model: "+data.model+"\n"+
    "Manufacturer: "+data.manufacturer+"\n"+
    "Serial Number: "+data.serial+"\n"+
    "Firmware version: "+data.firmware+"\n"+
    "Engineering Revision: "+data.engrev+"\n"+
    "RMA: "+data.rma+"\n"+
    "Room: "+data.room+"\n"+
    "Device History: "+data.devhist+"\n"+
    "Notes: "+data.devnotes+"\n"; 
   body.insertParagraph(pc++, message);
   body.insertHorizontalRule(pc);
  // return 1;
}

function updatelog(oldarr, oldlog, newarr, newlog, keys, room)
{
  var time_changed = new Date();
  for(var i = 0; i<keys.length; i++)
  {
    switch (keys[i])
    {
      case "LogURL":
      oldarr.splice(i,1);
      newarr.splice(i,1);
      keys.splice(i,1);
      break;
      case "TimeStamp":
      oldarr.splice(i,1);
      newarr.splice(i,1);
      keys.splice(i,1);
      break;
      case "User":
      oldarr.splice(i,1);
      newarr.splice(i,1);
      keys.splice(i,1);
      break;
      case "LogQR":
      oldarr.splice(i,1);
      newarr.splice(i,1);
      keys.splice(i,1);
      break;
    }
  }
  var oldchangesum = "Room changed to Inventory on: "+time_changed;
  var newchangesum = "Room changed to "+room+" on: "+time_changed;
  var oldsum = "";
  var newsum = "";
  for(var k = 0; k < keys.length; k++)
  {
    oldsum = oldsum+(keys[k]+": "+oldarr[k]+"\n")
    newsum = newsum+(keys[k]+": "+newarr[k]+"\n")
  }
  var olbody = oldlog.getBody();
  var nlbody = newlog.getBody();
  olbody.insertHorizontalRule(0);
  olbody.insertParagraph(1, oldsum);
  olbody.insertHorizontalRule(2);
  olbody.insertParagraph(3, oldchangesum);
  olbody.insertHorizontalRule(4);
  
  nlbody.insertHorizontalRule(0);
  nlbody.insertParagraph(1, newsum);
  nlbody.insertHorizontalRule(2);
  nlbody.insertParagraph(3, newchangesum);
  nlbody.insertHorizontalRule(4);
  
  return;
}

function bugreport(name, message)
{
  MailApp.sendEmail("joak4482@colorado.edu", 'Bug report from: '+name, message);
}

function include(filename)
{
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
