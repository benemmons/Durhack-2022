// Coding began at 18:30 19/02/2022

const functions = require("firebase-functions");
const cors = require("cors");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
var dbUsers = db.collection("users");
var dbAttr = db.collection("attributes");

exports.editProfile = functions.region("europe-west2").https.onRequest((req, res) => {
	cors((req, res) => {
		var uID = req.body.uID;
		var b = req.body;

		var data = {
			"name": b.name,
			"email": b.email, 
			"phone": b.phone, 
			"pronouns": b.pronouns, 
			"bio": b.bio
		};

		dbUsers.doc(uID).set(data, {merge: true})
	})
})

exports.