#!/usr/local/bin/node

const
    os = require("os"),
    fs = require("fs"),
    path = require("path"),
    appName = "node-web-scaffolding",
    appDir = "../" + appName,
    filesToCopy = ["client", "server", "package.json", "LICENSE", "README.md"];

function _printRenameError(error) {
    if (error) {
        console.error("Error moving file to working directory", error);
        process.exit();
    }
}

function _printUnlinkError(error) {
    if (error) {
        console.error("Error removing file from working directory", error);
        process.exit();
    }
}

function popDir() {
    process.chdir("../");
    console.log("* Current Working Directory: ", process.cwd());
}

function removeFile(i_sFile) {
    return new Promise(i_oResolve => {
        console.log("Removing file", i_sFile, process.cwd());
        fs.unlink(i_sFile, (error) => {
            _printUnlinkError(error);
            i_oResolve();
        });
    });
}

function removeDir(i_sDirName) {
    return new Promise(i_oResolve => {
        console.log("Removing directory ", i_sDirName, process.cwd());
        fs.rmdir(i_sDirName, (error) => {
            _printUnlinkError(error);
            i_oResolve();
        });
    });
}

function moveFilesWindows() {
    fs.mkdir(appDir, error => {
        if (error) {
            console.error("Error creating application directory ", appDir);
            process.exit();
        }

        filesToCopy.forEach(i_sFile => {
            fs.rename(path.join(appName, i_sFile), path.join(appDir, i_sFile), _printRenameError);
        });

        removeFile(path.join(appName, ".npmignore"))
            .then(() => removeFile(path.join(appName, "scripts", "postinstall.js")))
            .then(() => removeDir(path.join(appName, "scripts")))
            .then(() => removeDir(path.join(appName)))
            .then(popDir)
            .then(() => removeDir("node_modules"));
    });
}

function moveFilesProper() {
    fs.rename(appName, appDir, (error) => {
        _printRenameError(error);

        popDir();
        fs.rmdir("node_modules", (error) => {
            _printUnlinkError(error);
        });
    });
}

popDir();

if(/^win/i.test(os.platform())) {
    // windows
    moveFilesWindows();
} else {
    // OSX / Linux
    moveFilesProper();
}
