const express = require("express");
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));


let search = "";
let busno="";

let mysql = require('mysql2');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'busdepot'
});

/*
connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  connection.query("SELECT * FROM bus", function (err, result, fields) {
    console.log(result);
  });
  console.log('Connected to the MySQL server.');
});
*/

app.get("/", function(req,res){
  res.render("login");
});

app.get("/home", function(req, res){
  search="";
  res.render("home");
});

app.get("/duty", function(req,res){
  busno ="";

  connection.connect(function(err) {
    let items = new Array();
    let items1 = new Array();

    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="";

    if(search!=""){
      query='SELECT * FROM busdriver WHERE name="'+search+'";';

      connection.query(query, function (err, result, fields) {
        items = result;
      });

      query='SELECT * FROM busconductor WHERE name ="'+search+'";';

      connection.query(query, function (err, result, fields) {
        for (let i = 0; i < result.length; i++) {
          items1.push(result[i]);
        }
        res.render("duty_allocation",{items:items,items1:items1});
      });
    }
    else{
      query="SELECT * FROM busdriver";

      connection.query(query, function (err, result, fields) {
        items = result;
      });

      query="SELECT * FROM busconductor";

      connection.query(query, function (err, result, fields) {
        for (let i = 0; i < result.length; i++) {
          items1.push(result[i]);
        }
        res.render("duty_allocation",{items:items,items1:items1});
      });
    }
  });

});

app.post("/duty", function(req,res){
  search = req.body.search1;
  res.redirect("/duty");
});

app.get("/duty/:id/:id1", function(req,res){
  busno = req.body.busno1;
  console.log(busno);
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }



    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear()

    if(req.params['id1']!='conductor'){
      let query="INSERT INTO driverduty values('"+req.params['id']+"','KAT129553726','"+cYear+"-"+cMonth+"-"+cDay+"')";

      connection.query(query, function (err, result, fields) {
        if (err) {
          return console.error('error: ' + err.message);
        }
      });

      // query="INSERT INTO drives values('"+req.params['id']+"','"+busno+"','2021-12-12')";
      //
      // connection.query(query, function (err, result, fields) {
      //   if (err) {
      //     return console.error('error: ' + err.message);
      //   }
      // });
    }

    else{
      let query="INSERT INTO conductorduty values('"+req.params['id']+"','KAT129553726','"+cYear+"-"+cMonth+"-"+cDay+"')";

      connection.query(query, function (err, result, fields) {
        if (err) {
          return console.error('error: ' + err.message);
        }
      });

      // query="INSERT INTO drives values('"+req.params['id']+"','"+busno+"','2021-12-12')";
      //
      // connection.query(query, function (err, result, fields) {
      //   if (err) {
      //     return console.error('error: ' + err.message);
      //   }
      // });
    }
  });
  res.redirect("/duty");
});

app.get("/bus", function(req,res){
  let count=-1;

  if(search!=""){
    console.log(count);
    connection.connect(function(err) {
      if (err) {
        return console.error('error: ' + err.message);
      }
      let query = "SELECT count(bus_no) FROM bus where bus_no LIKE'"+search+"%';";
      connection.query(query, function (err, result, fields) {
        count = result[0]['count(bus_no)'];
        console.log(count);
      });
    });
  }

  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="";

    if(search!="")
      query="select * from bus inner join insurance on bus.insurance_no = insurance.insurance_no where bus_no LIKE'"+search+"%';";
    else
      query="select * from bus inner join insurance on bus.insurance_no = insurance.insurance_no;";

    if(count!=0 ){
      connection.query(query, function (err, result, fields) {
        res.render("bus_details",{items:result});
        search="";
      });
    }
    else{
      connection.query(query, function (err, result, fields) {
        let result1 = [];
        console.log(result1.length);
        res.render("bus_details",{items:result1});
        search="";
      });
    }
  });

});

app.post("/bus", function(req,res){
  search = req.body.search1;
  res.redirect("/bus");
});

app.get("/driver", function(req,res){
  let count=-1;

  if(search!=""){
    console.log(count);
    connection.connect(function(err) {
      if (err) {
        return console.error('error: ' + err.message);
      }
      let query = "SELECT count(name) FROM busdriver where name like'"+search+"%';";
      connection.query(query, function (err, result, fields) {
        count = result[0]['count(name)'];
        console.log(count);
      });
    });
  }

  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="";

    if(search!="")
      query="SELECT * FROM busdriver where name like'"+search+"%';";
    else
      query="SELECT * FROM busdriver";

    if(count!=0 ){
      connection.query(query, function (err, result, fields) {
        res.render("driver_info",{items:result});
        search="";
      });
    }
    else{
      connection.query(query, function (err, result, fields) {
        let result1 = [];
        console.log(result1.length);
        res.render("driver_info",{items:result1});
        search="";
      });
    }

  });
});

app.post("/driver", function(req,res){
  search = req.body.search1;
  res.redirect("/driver");
});

app.get("/conductor", function(req,res){
  let count=-1;

  if(search!=""){
    console.log(count);
    connection.connect(function(err) {
      if (err) {
        return console.error('error: ' + err.message);
      }
      let query = "SELECT count(name) FROM busconductor where name like'"+search+"%';";
      connection.query(query, function (err, result, fields) {
        count = result[0]['count(name)'];
        console.log(count);
      });
    });
  }


  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="";

    if(search!="")
      query="SELECT * FROM busconductor where name like'"+search+"%';";
    else
      query="SELECT * FROM busconductor";

    if(count!=0 ){
      connection.query(query, function (err, result, fields) {
        res.render("conductor_info",{items:result});
        search="";
      });
    }
    else{
      connection.query(query, function (err, result, fields) {
        let result1 = [];
        console.log(result1.length);
        res.render("conductor_info",{items:result1});
        search="";
      });
    }
  });

});

app.post("/conductor", function(req,res){
  search = req.body.search1;
  res.redirect("/conductor");
});

app.get("/accidents", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="";

    if(search!="")
      query='SELECT * FROM accident WHERE bus_no="'+search+'";';
    else
      query="SELECT * FROM accident";

    connection.query(query, function (err, result, fields) {
      res.render("accident_history",{items:result});
      search="";
      console.log(result);

    });
  });
});

app.post("/accidents", function(req,res){
  search = req.body.search1;
  res.redirect("/accidents");
});

app.get("/repair", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="";

    if(search!="")
      query='SELECT * FROM repair WHERE bus_no="'+search+'";';
    else
      query="SELECT * FROM repair";

    connection.query(query, function (err, result, fields) {
      res.render("repairs",{items:result});
      search="";
    });
  });
});

app.post("/repair", function(req,res){
  search = req.body.search1;
  res.redirect("/repair");
});

app.get("/login", function(req,res){
  res.render("DBlogin");
});

app.post("/login", function(req,res){
  console.log(req.body.email+req.body.pwd);
  if(req.body.email=='db@gmail.com' && req.body.pwd=='pwd')
    res.redirect("/DBhome");
  else{
    res.redirect("/login");
  }

});

app.get("/DBhome", function(req,res){
  res.render("DBhome");
});

app.get("/DBdriver", function(req,res){
  res.render("DBdriver");
});

app.post("/DBdriver", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="INSERT INTO busdriver VALUES('"+req.body.driver_id+"','"+req.body.name+"','"+req.body.dl_no+"',"+req.body.aadhar_no+",'"+req.body.address+"');";

    connection.query(query, function (err, result, fields) {

    });
  });
  res.redirect("/DBdriver");
});

app.get("/DBconductor", function(req,res){
  res.render("DBconductor");
});

app.post("/DBconductor", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="INSERT INTO busconductor VALUES('"+req.body.conductor_id+"','"+req.body.name+"','"+req.body.dl_no+"',"+req.body.aadhar_no+",'"+req.body.address+"');";

    connection.query(query, function (err, result, fields) {

    });
  });
  res.redirect("/DBconductor");
});

app.get("/DBbus", function(req,res){
  res.render("DBbus");
});

app.post("/DBbus", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="INSERT INTO bus VALUES('"+req.body.bus_no+"','"+req.body.start_dest+"','"+req.body.end_dest+"','"+req.body.reg_no+"','"+req.body.insurance_no+"');";

    connection.query(query, function (err, result, fields) {

    });
  });
  res.redirect("/DBbus");
});

app.get("/DBaccidents", function(req,res){
  res.render("DBaccident_history");
});

app.post("/DBaccidents", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="INSERT INTO accident VALUES('"+req.body.location+"','"+req.body.date+"','"+req.body.time+"','"+req.body.bus_no+"','"+req.body.driver_id+"');";

    connection.query(query, function (err, result, fields) {

    });
  });
  res.redirect("/DBaccidents");
});

app.get("/DBrepair", function(req,res){
  res.render("DBrepair");
});

app.post("/DBrepair", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="INSERT INTO repair VALUES('"+req.body.type+"',"+req.body.fee+",'"+req.body.date+"','"+req.body.status+"','"+req.body.bus_no+"');";

    connection.query(query, function (err, result, fields) {

    });
  });
  res.redirect("/DBrepair");
});

app.get("/DBabsent", function(req,res){
  res.render("DBabsent");
});

app.post("/DBabsent", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="INSERT INTO absent VALUES('"+req.body.driver_id+"','"+req.body.date+"');";
    //let query="select * from absent order by driver_id,date;";
    connection.query(query, function (err, result, fields) {
      if (err) {
        return console.error('error: ' + err.message);
      }
    });
  });
  res.redirect("/DBabsent");
});

app.get("/DBrevenue", function(req,res){
  res.render("DBrevenue");
});

app.post("/DBrevenue", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="UPDATE conducts SET revenue = "+req.body.revenue+" WHERE conductor_id = '"+req.body.conductor_id+"' AND date= '"+req.body.date+"';";
    console.log(10);
    connection.query(query, function (err, result, fields) {

    });
  });
  res.redirect("/DBrevenue");
});

app.get("/DBinsurance", function(req,res){
  res.render("DBinsurance");
});

app.post("/DBinsurance", function(req,res){
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    let query="INSERT INTO insurance VALUES('"+req.body.insurance_no+"','"+req.body.name+"','"+req.body.validity+"',"+req.body.insurance_fees+");";
    console.log(10);
    connection.query(query, function (err, result, fields) {
      if (err) {
        return console.error('error: ' + err.message);
      }
    });
  });
  res.redirect("/DBinsurance");
});

app.get("/notifications", function(req,res){
  const ans = [];
  const ans1 = [];
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }

    let query="select * from absent order by driver_id,date;";
    connection.query(query, function (err, result, fields) {

      let count=0,max=0;

      for(let i=0;i<result.length-1;i++){
        if(result[i]['driver_id']!=result[i+1]['driver_id']){
          if(max>3)
            ans.push(result[i]['driver_id']);
          count=1;
          max=1;
        }
        else{
          if((result[i+1]['date'].getTime()-result[i]['date'].getTime())/(1000 * 60 * 60 * 24)==1){
            count+=1;
            if(i==result.length-2)
              count+=1;
            if(count>max)
              max=count;
          }
          else{
            count=0;
          }

          if(i==result.length-2 && max>3)
            ans.push(result[i]['driver_id']);
        }
      }
    });

    query="select * from insurance;";
    connection.query(query, function (err, result, fields) {

      let count=0,max=0;
      let currentDate = new Date();
      for(let i=0;i<result.length-1;i++){
        if(((result[i]['validity'].getTime()-currentDate.getTime())/(1000 * 60 * 60 * 24 * 30)<=1) && ((result[i]['validity'].getTime()-currentDate.getTime())/(1000 * 60 * 60 * 24 * 30)>=0)){
          ans1.push(result[i]['insurance_no']);
        }
      }
      res.render("notifications",{noti:ans,ins:ans1});
    });
  });
});


app.listen(3000, function(){
 console.log("Server running on localhost 3000");
});
