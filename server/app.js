import express, { Router } from "express";
import { router } from "./routers.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();

app.use(express.json({limit:"100mb"}));
app.use(express.urlencoded({extended:true}));
app.get("/",function(req,res,next){
	const {access_token}=req.query;
	if(access_token){
		return res.json({have_game:["SPROCKET2DAYZMINI001","SPROCKET2DAYZMINI001"]});
	}
	res.sendFile(path.resolve(`${__dirname}/../game/index.html`));
});


app.use("/sp",router.sp);
app.use("/mp",router.mp);
app.use("/api",router.api);


const server=http.createServer(app);
server.listen(80,function(){
	console.log(`App listening on port 80!`);
});

export const socket=new WebSocketServer({server:server});