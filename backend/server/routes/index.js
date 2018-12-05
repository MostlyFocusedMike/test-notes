const fs = require('fs');
const Path = require('path');

module.exports.home = {
  method: 'GET',
  path: '/',
  options: {
    cors: true
  },
  handler: (request, h) => {
    console.log('i am indeed running')
      return h.file('./index.html');
  }
}

module.exports.createNote = {
  method: 'POST',
  path: '/notes',
  options: {
    cors: true
  },
  handler: (request, h) => {
    const files = require('../../../src/files.json')
    try {
      fs.writeFileSync(`./markdown/${request.payload.title}.md`, "")
      if (!files.includes(request.payload.title)) {
        const newFiles = [...files, request.payload.title].sort()
        fs.writeFileSync('./src/files.json', JSON.stringify(newFiles))
        return request.payload;
      } 
    } catch (err) {
      console.log(err);
      return {error: err};
    }
    return {msg: "You already created that file."}
  }  
}

module.exports.updateNote = {
  method: 'PATCH',
  path: '/notes/{noteName}',
  options: {
    cors: true
  },
  handler: (request, h) => {
    const {title, text, oldTitle } = request.payload;
    console.log('I was hit on patch');
    console.log("request payload", request.payload);
    const files = require('../../../src/files.json');
    try {
      console.log("title: ", title)
      console.log("text: ", text)
      fs.writeFileSync(`./markdown/${title}.md`, text);
      console.log("The file was saved!");
    } catch (err) {return console.log(err)};

    if (title !== oldTitle) { // if a user updates the file's name
      fs.unlinkSync(`./markdown/${oldTitle}.md`); 
      const oldTitleIdx = files.indexOf(oldTitle);
      files.splice(oldTitleIdx, 1);
      const newFiles = [...files, title].sort()
      try {
        fs.writeFileSync('./src/files.json', JSON.stringify(newFiles))
        console.log("The file was added to the directory!");
      } catch (err) {return console.log(err)};
    }

    // if (!files.includes(request.payload.title)) {
    //   const newFiles = [...files, request.payload.title].sort()
    //   try {
    //     fs.writeFileSync('./src/files.json', JSON.stringify(newFiles))
    //     console.log("The file was added to the directory!");
    //   } catch (err) {return console.log(err)};
    // }
    return request.payload;
  }
}

module.exports.reload = {
  method: 'PUT',
  path: '/reload',
  options: {
    cors: true
  },
  handler: (request, h) => {
    const testFolder = './markdown/';
    const newFiles = []
    const existingFiles = require('../../../src/files.json')
    fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        newFiles.push(file.replace(".md", ""))
      });
      if (JSON.stringify(newFiles) !== JSON.stringify(existingFiles)) {
        fs.writeFile('./src/files.json', JSON.stringify(newFiles), function(err) { 
          if (err) {return console.log(err)};
          console.log("Files.json was updated");
        });
      }
    })
    return h.response("Success").code(201)
  }
}