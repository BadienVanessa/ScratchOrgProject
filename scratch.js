const sfdx = require ('sfdx');
//const createFile = require ('./Create_File')
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
//const sfdx = require('sfdx-node');

var createScratchOrg = function(alias,targetusername, branchName, query, folderName,fileNameJson,ttl){
    //Create a new local branch
    var gitBranch = `git branch ${branchName}`;
    // var gitPushBranch = `git push -u origin ${branchName}`;


    //createFile(alias, edition, features, settings);
    var passwordScratchOrg = `sfdx force:user:password:generate --targetusername ${alias} --length 20`;
    var passwordDisplay = `sfdx force:user:display --targetusername ${alias}`;
    var exportDataOrg = `sfdx force:data:tree:export -q "${query}" -u ${targetusername} -d ${folderName} -p`;
    var importDataScratchOrg = `sfdx force:data:tree:import -u ${alias} -p ${folderName}${path.sep}${fileNameJson}`;




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
        // //  push the new branch to the remote directory
        // exec(gitPushBranch, (error, stdout) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //     }
        //     if (stdout) {
        //         console.log(`stdout: ${stdout}`);
        //     }
           
        // });
        // Generate a password for the new scratch org
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
var param1 = 'alias';
var param2 = 'badienvan@playful-otter-k30t9x.com';
var param3 = 'scratch6';
var param4 = 'SELECT Name,(SELECT FirstName, LastName FROM Contacts) FROM Account';
var param5 = 'data';
var param6 = 'Account-Contact-plan.json';
var param7 = 1;
createScratchOrg(param1,param2,param3,param4,param5,param6,param7);