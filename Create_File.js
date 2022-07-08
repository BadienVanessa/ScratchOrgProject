const fs = require('fs');
var createFile =  function (orgName, edition, features, settings){
    let org = {orgName: orgName, edition: edition, features: features, settings: []}

    try{
        fs.mkdir('config', function (err, data){
            if(err){
                console.log(err)
            }else{
                fs.writeFileSync('./config/project-scratch-def.json', JSON.stringify(org));
                console.log('creee');
            }
        });  
    }catch(err){
        if(err.code == 'EEXIST'){
            console.log('file exist')
        }else{
            console.log(err);
        }
    }
}

module.exports = createFile;