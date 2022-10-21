let  http= require('http'); //gives us http

let fs= require('fs'); //gives us fs
let path= require('path');// gives us "string".pathex()

const ip='127.0.0.1'; //domain IP
const port= 3000;

//Create server using http module, and wait response:
http.createServer(function(request,response) {
   
    //print request object
    console.log('request',request.url);

    //add . to URL to convert it to local file path
    let file = "."+ request.url;

    //redirect / to serve index.html
    if (file=='./') file='./index.html';
    
    //Extract request file's extension
    let extemsion= String(path.extname(file)).toLowerCase();

    //Define acceptable file extensions
    let mime={'.html':'text/html',
                '.js':'text/javascript',
                '.png':'image/png'};

    //If request file type is not in mime. default to octet-steream which means
    //"arbitrary binary data"
    let type= mime[extemsion] || 'application/octet-stream';

    //read file from hard drive
    fs.readFile(file,function(error,content){
        if (error){
            if (error.code=='ENOENT'){
                fs.readFile('./404.html',function(error,content){
                    response.writeHead(200,{'Content-Type':type});
                    response.end(content,'utf-8');
                });
            }else {
                response.writeHead(500);
                response.end('Error: '+ error.code+ '\n');
                response.end(content,'utf-8');
            }
        }else{
            response.writeHead(200,{'Content-Type':type});
            response.end(content, 'utf-8');
        }
    });


}).listen(port,ip);

console.log('running at'+ip+':'+port+'/');
