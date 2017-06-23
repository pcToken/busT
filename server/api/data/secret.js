var fs = require('fs');
var word ="";
function read(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}
read("./server/api/data/word.txt",function(data){
    module.exports.word = data;
});
