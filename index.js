#!/usr/bin/env node

let shell = require('shelljs')
let colors = require('colors')
let fs = require('fs') //fs already comes included with node.
let templates = require('./templates/templates.js')

let appName = process.argv[2]
let appDirectory = `${process.cwd()}/${appName}`

const createGatsbyApp = () => {
    return new Promise(resolve=>{
        if(appName){
        shell.exec(`npm install -g gatsby-cli`, () => {
            console.log("Installed Gatsby CLI")
            resolve(true)
        })
        shell.exec(`gatsby new ${appName} https://github.com/gatsbyjs/gatsby-starter-hello-world`, () => {
            console.log("Created Gatsby Website")
            resolve(true)
        })
        }else{
        console.log("\nNo app name was provided.".red)
        console.log("\nProvide an app name in the following format: ")
        console.log("\ncreate-react-redux-router-app ", "app-name\n".cyan)
            resolve(false)
        }
    })
}

const cdIntoNewApp = () => {
    return new Promise(resolve=>{
        shell.exec(`cd ${appName}`, ()=>{resolve()})
    })
}

const installPackages = () => {
    return new Promise(resolve=>{
        console.log("\nInstalling styled-components\n".cyan)
        shell.exec(`npm install --save styled-components`, () => {
            console.log("\nFinished installing packages\n".green)
            resolve()
        })
    })
}

const updateTemplates = () => {

    // function deleteFiles(files, callback){
    //     var i = files.length;
    //     files.forEach(function(filepath){
    //     if (fs.existsSync(filepath)) {
    //         fs.unlink(filepath, function(err) {
    //             i--;
    //             if (err) {
    //                 callback(err);
    //                 return;
    //             } else if (i <= 0) {
    //                 callback(null);
    //             }
    //         });
    //     } else {
    //         console.log(`Files already removed: ${filepath}`.red)
    //     }
    //     });
    // }

    // deleteFiles([`${appDirectory}/src/App.test.js`, `${appDirectory}/src/logo.svg`, `${appDirectory}/src/index.css`, `${appDirectory}/src/App.css`], function(err) {
    //     if (err) {
    //         console.log(err.red);
    //     } else {
    //         console.log('Removed App.test.js, logo.svg, index.css, App.css'.green);
    //     }
    // });

    return new Promise(resolve=>{
        let promises = []
        Object.keys(templates).forEach((fileName, i)=>{
        promises[i] = new Promise(res=>{
            fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], function(err) {
                if(err) { return console.log(err) }
                res()
            })
        })
        })
        Promise.all(promises).then(()=>{resolve()})
    })
}


const run = async () => {
    let success = await createGatsbyApp()
    if(!success){
        console.log('Something went wrong while trying to create a new RGatsby Website'.red)
        return false;
    }
    await cdIntoNewApp()
    await installPackages()
    await updateTemplates()
    console.log("All done")
}
run()