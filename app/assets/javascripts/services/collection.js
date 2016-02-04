app.factory("Collection",[ 'Model', function(Model) {
	  	config = {
	  		className: "Collection",
				slugs: {
					singular: "collection",
					plural: "collections"
				},
				namespace: "api",
				associations: [
					{
						type: "hasMany",
						models: ["Item"]
					}
				]			
			}
	  return Model.initialize(config);
}]);