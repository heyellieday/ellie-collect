app.factory("Item",[ 'Model', function(Model) {
	  	config = {
	  		className: "Item",
				slugs: {
					singular: "item",
					plural: "items"
				},
				namespace: "api",
				associations: [
					{
						type: "belongsTo",
						models: ["Collection"]
					}
				]			
			}
	  return Model.initialize(config);
}]);