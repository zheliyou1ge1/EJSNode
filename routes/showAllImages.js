var express = require('express');
var router = express.Router();


var fs = require("fs");
var image = require("imageinfo"); //引用imageinfo模块

function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {

            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }

    })
}
var getFiles = {
    //获取文件夹下的所有文件
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function (path) {
        var imageList = [];
        this.getFileList(path).forEach((item) => {
            var ms = image(fs.readFileSync(item.path + item.filename));
        //ms.mimeType && (imageList.push(item.filename))
        ms.mimeType && (imageList.push(item.filename))
    });
        return imageList;
    }
};

var path="/img/";
var imageList=getFiles.getImageFiles("./public/"+path);
var srcNewList=[];

// imageList.forEach(function (item, index){
//     console.log(item);
//     if(item.split(".")[1]=='jpg'){
//         srcNewList.push({'imsrc':item})
//     }else{
//         srcNewList.push({'videosrc':item})
//     }
// })
imageList.forEach(function (item, index){
    srcNewList.push({'imsrc':path+item});
});
console.log(imageList);
console.log(srcNewList);


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    res.render('showAllImages',{title: '图片展示',imglist:srcNewList})
});

module.exports = router;
