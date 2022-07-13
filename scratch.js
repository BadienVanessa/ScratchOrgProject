const sfdx = require ('sfdx');
//const createFile = require ('./Create_File')
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
//const sfdx = require('sfdx-node');

//It facilitates the rapid development of Node based Web applications
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var createScratchOrg = function(alias,targetusername, branchName,ttl){
    //Create a new local branch
    var gitBranch = `git branch ${branchName}`;
    // var gitPushBranch = `git push -u origin ${branchName}`;


    //createFile(alias, edition, features, settings);
    var passwordScratchOrg = `sfdx force:user:password:generate --targetusername ${alias} --length 20`;
    var passwordDisplay = `sfdx force:user:display --targetusername ${alias}`;
    // var exportDataOrg = `sfdx force:data:tree:export -q "SELECT FIELDS(ALL) FROM ${Objects} LIMIT 200" -u ${targetusername} -d ${folderName} -p`;
    // var importDataScratchOrg = `sfdx force:data:tree:import -u ${alias} -p ${folderName}${path.sep}${Objects}-plan.json`;
    var startExportImport = `sfdx sfdmu:run --sourceusername ${targetusername} --targetusername ${alias}`;
    var exportDataOrg = `sfdx sfdmu:run --sourceusername ${targetusername} --targetusername csvfile`;
    var importDataScratchOrg = `sfdx sfdmu:run --sourceusername csvfile --targetusername ${targetusername}`;




    //create scratch org
    let optionsCreate = {alias : alias, days : ttl, definitionfile: './config/project-scratch-def.json'};
    var optionsLogin = {alias : alias, devhub : true,sandbox: false};
    var optionsOrgInfo = {alias : alias, user : true};
    var optionOpen = {alias : alias};
    var optionsPush = {alias : alias, force : true, noflows : true};
    


    try{  
        //Connects an org to this project via web login.
        sfdx.login(optionsLogin);
        // Create a new scratch org
        sfdx.create(optionsCreate);
        // Use following console command to start the export from one Org to another:
        exec(startExportImport, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
           
        });
        // export data from an org by creating a folder and files that will contain this data  
        exec(exportDataOrg, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
           
        });
        //Create a new local branch
        exec(gitBranch, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
        });
        exec(passwordScratchOrg, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
           
        });
        // displays news coordinate from the new scratch org
        exec(passwordDisplay, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
        });
        //  Gets info about an org
        sfdx.orgInfo(optionsOrgInfo).then(result=>{
            fs.writeFileSync('./config/infos.json',JSON.stringify(result));
        }).catch(err =>{
             console.error(err);
        });
        //Open the newly-created scratch org in a browser window
        sfdx.open(optionOpen);
        //  Push local code into the newly-created scratch org
        sfdx.push(optionsPush);
        // Import the local Data in the Scratch org
        exec(importDataScratchOrg, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
           
        });
    } catch(error){

    }
}

app.get('/scratch.html', function (req, res) {
    res.sendFile( __dirname + "/" + "scratch.html" );
 })
 
 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })
var responses={};
 app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        bodyAlias:req.body.alias_name,
        bodyOrg:req.body.org_name,
        bodyBranch:req.body.branch_name,
        bodyTime:req.body.time
    };
    responses=response;
    console.log(response);

   var paramAlias =response.bodyAlias ;
   var paramOrg = response.bodyOrg;
   var paramBranch = response.bodyBranch;
   var paramTime = response.bodyTime;
    createScratchOrg(paramAlias,paramOrg,paramBranch,paramTime);
    res.end(JSON.stringify(response));
 })

 

