// Coding began at 18:30 19/02/2022

const functions = require("firebase-functions");
const cors = require("cors");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
var dbUsers = db.collection("users");
var dbAttr = db.collection("attributes");

exports.editProfile = functions.region("europe-west2").https.onRequest(() => {
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
		res.status(200).send()
	})
})

exports.addAttributes = functions.region("europe-west2").https.onRequest(() => {
	cors((req, res) => {
		var uID = req.body.uID;

		var data = req.body.attributes; 

		dbUsers.doc(uID).set({
			"attributes": data
		}, {merge: true})
		res.status(200).send()
	})
})

exports.getCandiadates = functions.region("europe-west2").https.onRequest(() => {
	cors((req, res) => {
		var unique;
		while (unique != true) {
			var data = {
				"user1": randomRecord(),
				"user2": randomRecord()
			}
			if (data.user1 != data.user2) {unique = true}
		}

		res.status(200).send(data)
	})
});

exports.sendVote = functions.region("europe-west2").https.onRequest(() => {
	cors(async (req, res) =>  {
		var uId = req.body.uId;
		const doc = await dbUsers.doc(uID).get()
		if (!doc.exists) {
			console.error("No such user!");
		} else {
			if (req.body.vote == "yes") {
				dbUsers.doc(uID).set({
					"yesVotes": doc.data().yesVotes + 1
				}, {merge: true})
			} else if (req.body.vote == "no") {
				dbUsers.doc(uID).set({
					"noVotes": doc.data().noVotes + 1
				}, {merge: true})
			} else {
				res.status(500)
				return;
			}
		}
		res.status(200)
	})
})

function randomRecord() {
	var key = dbUsers.doc().id;

	dbUsers.where(admin.firestore.FieldPath.documentId(), ">=", key).limit(1).get()
		.then(snapshot => {
			if(snapshot.size > 0) {
				snapshot.forEach(doc => {
					console.log(doc.id, "=>", doc.data());
					return doc;
				});
			}
			else {
				var user = dbUsers.where(admin.firestore.FieldPath.documentId(), "<", key).limit(1).get()
					.then(snapshot => {
						snapshot.forEach(doc => {
							console.log(doc.id, "=>", doc.data());
							return doc;
						});
					})
					.catch(err => {
						console.log("Error getting documents", err);
					});
			}
		})
		.catch(err => {
			console.log("Error getting documents", err);
		});
}