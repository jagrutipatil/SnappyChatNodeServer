var firebase = require('firebase');
var emailModule = require('./email');

var config = {
		  apiKey: "AIzaSyCtNKArzdakLuFNib9p9yprAKi1rLx8kZ4",
		  authDomain: "snappychat-25a5a.firebaseapp.com",
		  databaseURL: "https://snappychat-25a5a.firebaseio.com"
		};

firebase.initializeApp(config);
var firebaseRef = firebase.database().ref().child('timelinecontent');
var cleanPattern = "";
//var me = "jagpatil22gmailcom";

var getFriendList = function(me, callback) {
	firebase.database().ref('/friends').on("value", function(snapshot) {
		var user = snapshot.child(me).val();
		var email = user.email;
		var friendList = user.friends;		
		callback(null, friendList);		
	  }, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		  callback(errorObject, null);
	  });
}; 		

//var getAllUsers = function(callback) {
//	firebase.database().ref('/users').on("value", function(snapshot) {
//		var userDict = childsnapshot.val();
//		var userArray = [];
//		for (i = 0; i < Object.keys(userDict).length; i++) {
//			userArray.push({
//				key: Object.keys(userDict)[i],
//				email: userDict[Object.keys(userDict)[i]].email});
//		}
//				
//		callback(null, userArray);		
//	  }, function (errorObject) {
//		  console.log("The read failed: " + errorObject.code);
//		  callback(errorObject, null);
//	  });
//}

var notify = function(email, nickName, callback) {
	var cleanEmail = email;
	cleanEmail = cleanEmail.replace(/[^A-Za-z0-9]/g, "");
	getFriendList(cleanEmail, function(err, friendList) {
		for (i = 0; i < friendList.length; i++) {
				//TODO add nickname in body
				emailModule.sendEmail(friendList[i], "Your friend: "+ nickName + " changed profile", function(err, reply) {
					console.log("Notify");		
				});
		}
		callback(null, "Email sent to all friends of " + email);
	});	
};

var isEmailNotificationOn = function(email, callback) {
	var cleanedEmail = email;
	cleanedEmail = cleanedEmail.replace(/[^A-Za-z0-9]/g, "");
	firebase.database().ref('/advanced_settings').on("value", function(snapshot) {
		var user = snapshot.child(cleanedEmail).val();
		callback(null, user.email_notification);
	  }, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		  callback(errorObject, null);
	  });
};

var isFriend = function(email, callback) {  
	getFriendList( function(err, friendList) {
		if (friendList.indexOf(email) > -1)  {
			callback(true);
		}	else {
			callback(false);
		}
	});
};


exports.onChange = function() {
	firebaseRef.on('child_changed', function(childsnapshot, prevchildname) {  
		console.log("Element Changed");	
		var userDict = childsnapshot.val();
		
		if (Object.keys(userDict).length > 1) {
			var pEmail = userDict[Object.keys(userDict)[0]].emailAddress;
			var nickName = userDict[Object.keys(userDict)[0]].nickName;
			//TODO if visibility on
			isEmailNotificationOn(pEmail, function(err, reply) {
				if (reply == true) {
					console.log("Original pEmail: " + pEmail);			
					notify(pEmail, nickName, function(err, reply) {
						console.log(reply);
					});											
				}
			});			
		}
	}) ;
}; 