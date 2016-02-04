app.service("Schema", [ 
	function(

	){


	this.load = function(){

		schema = {
			Collection: {
				associations: {
					hasMany: ["Item"]
				}
			},
      Item: {
      	associations: {
      		belongsTo: ["Collection"]
    		}
      }
  	}
		return schema;
	};

}]);