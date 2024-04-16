import { router } from "./routers.js";
import express from "express";
import fs from "fs";
import { socket } from "./app.js";
import { WebSocket } from "ws";

router.api.get("/auth",function(req,res,next){
	res.json({token_user:"token_user",token_refresh:"token_refresh",client_id:"client_id",bi_account_url:"bi_account_url",user_data_url:"user_data_url",saved_game_url:"saved_game_url/"});
	// res.json({login_request:"true",bi_account_url:"bi_account_url",user_data_url:"user_data_url",saved_game_url:"saved_game_url",client_id:"client_id",token_user:"user-",login_remember:1,logging_in:1,get_name:"get_name",name:"name"});
});

router.mp.get("/:char/default-char",function(req,res,next){
	const {char}=req.query;
	return res.json({get_char:"2,4,1"})
});

router.mp.get("/default-char",function(req,res,next){
	const result=JSON.parse(fs.readFileSync("./db/default-char.json"));
	res.json({get_char:result.data});
});

router.mp.get("/:user",function(req,res,next){
	const {access_token,key}=req.query;
	if(access_token && !key){
		return res.json({have_game:["SPROCKET2DAYZMINI001"]});
	}
	if(key){
		return res.json({token_user:"token_user",MyUsername:"w84soft",client_id:"client_id"})
	}
	next();
});

router.mp.use(express.static("game/multiplayer"));


const rooms=[
	{
		name:`Test|Survival|Chernarus|1.4.1| "PL"|0|1`,
		// name:`Dupa`,
		peercount:1,
		maxpeercount:12,
		state:"available", // | locked | full,
	}
];
socket.on("connection",function(client){
	console.log("client connected",client.protocol);

	client.sendData=function(type,object={}){
		const result={
			message:type,
		}
		for(const key in object){
			result[key]=object[key];
		}
		client.send(JSON.stringify(result));
	}
	client.sendData("welcome",{"protocolrev":1,"version":"1.6","name":"Construct Multiplayer Signalling Server","operator":"Scirra Ltd","motd":"Welcome to the unofficial Construct Multiplayer Signalling server!","clientid":"C7VX","ice_servers":["stun:locahost",{"urls":"turn:localhost","username":"VVilq","credential":"construct"}]});

	client.on("message",function(data,isBinary){
		try{
			data=JSON.parse(data);
		}catch(err){
			console.log(err);
			return;
		}
		console.log(data);
		client.emit(data.message,data);
	});

	client.on("list-rooms",function(){
		client.sendData("room-list",{
			list:rooms
		});
	});

	client.on("login",function(data){
		client.sendData("login-ok",{"alias":data.alias});
	});

	client.on("join",function(){
		setTimeout(function(){
			client.sendData("join-ok",{"game":"Bohemia Interactive - MINIDAYZ v3","instance":"minidayz","room":"Test|Survival|Chernarus|1.4.1| \"PL\"|0","host":true});
		},3000);
	});

	client.on("leave",function(){
		client.sendData("leave-ok");
	});

	client.on("close",function(code,reason){
		console.log(code,reason);
	})
})

//{"message":"icecandidate","toclientid":"NQ3W","icecandidate":{"candidate":"candidate:1 1 UDP 1686049279 31.60.34.249 22140 typ srflx raddr 0.0.0.0 rport 0","sdpMid":"0","sdpMLineIndex":0,"usernameFragment":"097955f5"}}