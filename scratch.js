const sfdx = require ('sfdx')
//const createFile = require ('./Create_File')
const fs = require('fs');
const exec = require('child_process').exec;

var createScratchOrg = function(alias, edition, features, settings, ttl){
    //createFile(alias, edition, features, settings);
    var passwordScratchOrg = `sfdx force:user:password:generate --targetusername ${alias} --length 20`;
    var passwordDisplay = `sfdx force:user:display --targetusername ${alias}`;


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
        exec(passwordScratchOrg, (error, stdout) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
            }
           
        });

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
    } catch(error){

    }
}
createScratchOrg('alias', 'Enterprise', [], null , 1);