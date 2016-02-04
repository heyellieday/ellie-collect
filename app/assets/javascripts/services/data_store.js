app.factory("DataStore", [
	function(
	
	){
 		return {
 			objects: {},

 			makeLocalId: function(){
 			  var text = "";
 			  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
 			  for( var i=0; i < 20; i++ ){
 			  	text += possible.charAt(Math.floor(Math.random() * possible.length))
 			  }
 			  return text;
 			},

 			build: function(object){
 				object.localId = this.makeLocalId();
 				this.objects[object.localId] = object;
 				return object;
 			},
 			locate: function (localId) {
 				return this.objects[localId];
 			},
 			locateBy: function (attribute) {
 				for (i in this.objects){
 					if (this.objects[i][attribute.key] != null && this.objects[i][attribute.key] == attribute.value ){
 						return this.objects[i];
					}
 				}
 				//var result = $.grep(this.objects, function(e){ return e[attribute.key]] == attribute.value; });
 				return null;
 			},
 			locateByMany: function(attributes){
 				for (i in this.objects){
 					var matches = 0;
 					for (var j = attributes.length - 1; j >= 0; j--) {
 						if (this.objects[i][attributes[j].key] != null && this.objects[i][attributes[j].key] == attributes[j].value ){
 							matches = matches + 1;
 						};
	 					if (matches == (attributes.length)){
	 						return this.objects[i];
	 					};
 					};
 				 };
 				 //var result = $.grep(this.objects, function(e){ return e[attribute.key]] == attribute.value; });
 				 return null;
 			},
 			where: function(attributes){
 				matches_array = [];
 				for (i in this.objects){
 					var matches = 0;
 					for (var j = attributes.length - 1; j >= 0; j--) {
 						if (this.objects[i][attributes[j].key] != null && this.objects[i][attributes[j].key] == attributes[j].value ){
 							matches = matches + 1;
 						};
	 					if (matches == (attributes.length)){
	 						matches_array.push(this.objects[i]);
	 					};
 					};
 				};
 				//var result = $.grep(this.objects, function(e){ return e[attribute.key]] == attribute.value; });
 				return matches_array;
 			},
 			update: function(object){
 				console.log(object.localId);
 				for (i in object){
 					this.objects[object.localId][i] = object[i]
 				}
 				return this.objects[object.localId];
 			},
 			remove: function(instance){
 				delete this.objects[instance.localId];
 			}
 		};

}]);