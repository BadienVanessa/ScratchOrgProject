const sfdx = require ('sfdx');
//const createFile = require ('./Create_File')
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
//const sfdx = require('sfdx-node');


openInterface = argv.s
if (openInterface=='start') {
    exec('start http://127.0.0.1:8081/scratch.html')
}

//It facilitates the rapid development of Node based Web applications
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var createScratchOrg = function(pullBranchName,targetusername,alias,projectScratchDefJson,InfoScratchOrg,time,branchName){
    //Create a new local branch
    var gitPull = `git pull origin ${pullBranchName}`;
    var gitBranch = `git branch ${branchName}`;
    var gitswitchBranch = `git switch ${branchName}`;


    //createFile(alias, edition, features, settings);
    var passwordScratchOrg = `sfdx force:user:password:generate --targetusername ${alias} --length 20`;
    var passwordDisplay = `sfdx force:user:display --targetusername ${alias}`;
    //var exportDataOrg = `sfdx force:data:tree:export -q "SELECT FIELDS(ALL) FROM ${Objects} LIMIT 200" -u ${targetusername} -d ${folderName} -p`;
    //var importDataScratchOrg = `sfdx force:data:tree:import -u ${alias} -p ${folderName}${path.sep}${Objects}-plan.json`;
    //var importDataScratchOrg = `sfdx force:data:tree:import -u ${alias} --plan ./data/sample-data-plan.json`;
    var ExportImport = `sfdx sfdmu:run --sourceusername ${targetusername} --targetusername ${alias}`;
    //var exportDataOrg = `sfdx sfdmu:run --sourceusername ${targetusername} --targetusername csvfile`;
    //var importDataScratchOrg = `sfdx sfdmu:run --sourceusername csvfile --targetusername ${alias}`;
    //var permitionSet = `sfdx force:user:permset:assign -n Dreamhouse`;




    //create scratch org
    let optionsCreate = {alias : alias, days : time, definitionfile: `${projectScratchDefJson}`};
    var optionsLogin = {alias : targetusername, devhub : true,sandbox: false};
    var optionsOrgInfo = {alias : alias, user : true};
    var optionOpen = {alias : alias};
    var optionsPush = {alias : alias, force : true, noflows : true};
    


    try{ 
        //This command do the pull in git 
        exec(gitPull, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
           
        });
        //Connects an org to this project via web login.
        sfdx.login(optionsLogin);
        // Create a new scratch org
        sfdx.create(optionsCreate);
        //generate the password of Scratch Org
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
            fs.writeFileSync(`${InfoScratchOrg}`,JSON.stringify(result));
        }).catch(err =>{
             console.error(err);
        });
        //Open the newly-created scratch org in a browser window
        sfdx.open(optionOpen);
        //  Push local code into the newly-created scratch org
        sfdx.push(optionsPush);
        // export import the Data in the Scratch org   
        exec(ExportImport, (error, stdout) => {
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
        //switch the new branch
        exec(gitswitchBranch, (error, stdout) => {
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


//declaration of static data like css, image,...
app.use(express.static(path.join(__dirname, 'public')));

//connection with html file
app.get('/scratch.html', function (req, res) {
    res.sendFile( __dirname + "/" + "scratch.html" );
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })

app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON
    response = {
        bodypullBranchName:req.body.pull_branch_name,
        bodyOrg:req.body.org_name,
        bodyAlias:req.body.alias_name,
        bodyProjectScratchDefJson:req.body.project_Scratch_Def_Json,
        bodyInfoScratchOrg:req.body.Info_Scratch_Org,
        bodyTime:req.body.time,
        bodyBranch:req.body.branch_name
    };
    console.log(response);
    res.end(JSON.stringify(response));

    var parampullBranchName = response.bodypullBranchName;
    var paramOrg = response.bodyOrg;
    var paramAlias =response.bodyAlias ;
    var paramProjectScratchDefJson =response.bodyProjectScratchDefJson ;
    var paramInfoScratchOrg =response.bodyInfoScratchOrg ;
    var paramTime = response.bodyTime;
    var paramBranch = response.bodyBranch;
    createScratchOrg(parampullBranchName,paramOrg,paramAlias,paramProjectScratchDefJson,paramInfoScratchOrg,paramTime,paramBranch);
})

//On your browser enter the url "http://127.0.0.1:8081/scratch.html"

