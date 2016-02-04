app.service("Model",[ '$resource', '$http', '$q', '$timeout', 'JsonApi', 'DataStore', 'Schema', function($resource, $http, $q, $timeout, JsonApi, DataStore, Schema) {


	this.initialize = function(config){
		var config = config;
		config.slugs = config.slugs;
		config.namespace = config.namespace;
		model = ModelConstructor(config);
		model = DataStore.build(model);
		return model;
	};

	var ModelConstructor = function(config){


		var apiConfig = {
			slugs: config.slugs,
			namespace: config.namespace			
		};

		var API = JsonApi.initialize(apiConfig);

		var model = {

			config: config,

			className: config.className,

			instances: [],

			create: function(data){
				if (typeof data == "undefined"){
					data = {};
					if (typeof data.params == "undefined"){
						data.params = [];
					}
					if (typeof data.attributes == "undefined"){
						data.attributes = {};
					}
				}else{
					if (typeof data.params == "undefined"){
						data.params = [];
					}
					if (typeof data.attributes == "undefined"){
						data.attributes = {};
					}
				};
				var action = "";

				var that = this;

				if (typeof data.instance != "undefined" && typeof DataStore.locate(data.instance.localId) != "undefined"){
					instance = DataStore.locate(data.instance.localId);
					console.log("It got if");
				}else{
					console.log("It got elsewhere");
						instance = this.constructInstance();
				}

				var that = this;
				if(data.parentLocalId != null){
					console.log(data.parentLocalId);
					var parent = DataStore.locate(data.parentLocalId);
					console.log(parent);
					var that = this;



					if (parent.id != null){
						console.log(instance.localId+  " : " + parent.localId);
						instance.create(data.attributes, parent.localId, data.relationships);

					}else{
						data.instance = instance;
						data.parentLocalId = parent.localId;

						parentInstance = DataStore.locate(parent.localId);

						if (parentInstance.callbacks == null){
							parentInstance.callbacks = [];
						}
						parentInstance.callbacks.push({association_name: this.config.slugs.plural, callback_name: "create", data: data, localId: instance.model.localId });
						DataStore.update(parentInstance);
						// return instance;
					}
				}else{
						instance.create(data.attributes);
				}
				return instance;

			},

			runCallback: function(instance){
				console.log('got here');
				if (instance.callbacks != null){
						for (var i = instance.callbacks.length - 1; i >= 0; i--) {
							callback = instance.callbacks[i];
							//childAssociation = instance.associations[callback.association_name];
							childAssociation = DataStore.locate(instance.callbacks[i].localId);
							
							if (callback.callback_name == 'create' && callback.data != null){
								console.log(instance.localId);	
								callback.data.parentLocalId = instance.localId;
								console.log(callback.data);
								childAssociation[callback.callback_name](callback.data);
							}else if(callback.callback_name == 'all' && callback.parentLocalId != null){
								childAssociation[callback.callback_name]({parentLocalId: callback.parentLocalId});
							}else{

								childAssociation[callback.callback_name]();
							}
							console.log(callback.callback_name + ":" + instance.id + ":" + instance.callbacks[i].parentLocalId);
						};
						
						DataStore.update(instance);
				};
			},

			loadAssociations: function(instance){
				if (typeof instance.associations != "undefined"){
					for (var i in instance.associations) {
						association = DataStore.locate(instance.associations[i].localId);

						if(instance.associations[i].associationType == "hasOne"){
							instance[association.config.slugs.singular] = association.find({});
							DataStore.update(instance);
						}else if (instance.associations[i].associationType == "hasMany"){
							association.all({parentLocalId: instance.localId});
							instance[association.config.slugs.plural] = {};

							DataStore.update(instance);
						}else if(instance.associations[i].associationType == "belongsTo"){
							instance[association.config.slugs.singular] = association.find({});
							DataStore.update(instance);
							console.log(instance);
						}else{

						}
					};
				}
			},

			all: function(data){

				if (typeof params == "undefined"){
					params = [];
				}

				var that = this;
				var parent = {};
				if(data != null && data.parentLocalId != null){
					if (data != null && data.parentLocalId != null){
						parent = DataStore.locate(data.parentLocalId);
					}
					var that = this;

					if (parent.id != null){
						params = [{key: "filter[" + parent.config.slugs.singular + "_id]", value: parent.id}];
						API.get("", params, function(data){
							
							for (var i = 0; i < data.length; i++) {
								instance = DataStore.locateBy({key: "id", value: data[i].id});

								if (instance != null){
									var localId = instance.localId;
									instance = data[i];
									instance.localId = localId;
									DataStore.update(instance);
								}else{
									var parent_id = data[i].attributes[parent.config.slugs.singular+ "_id"];
									var updated_parent = DataStore.locateBy({key: "id", value: parent_id});
									var instance = that.constructInstance();
									if (parent != null){
										var localId = instance.localId;
										for(j in data[i]) {
											instance[j] = data[i][j];
										}
										instance.localId = localId;
										DataStore.update(instance);
									}
								}
								that.loadAssociations(instance);
								that.runCallback(instance);

								
							};
						},
						function(data){
							console.log("Error");
						});
						//return instances.objects;
					}else{
						console.log('got to here, yah');
						parent.callbacks = [];
						parent.callbacks.push({association_name: this.config.slugs.plural, callback_name: "all", parentLocalId: parent.localId, localId: this.localId });
						DataStore.update(parent);
						
					}
				}else{
					API.get("", [], function(data){
						for (var i = data.length - 1; i >= 0; i--) {
							instance = DataStore.locateBy({key: "id", value: data[i].id});
							if (instance != null){
								var localId = instance.localId;
								for(j in data[i]) {
									instance[j] = data[i][j];
								}
								instance.localId = localId;
								DataStore.update(instance);
							}else{
								var newInstance = that.constructInstance();
								DataStore.update(newInstance, data[i])
							}
						};
					},
					function(data){
						console.log("Error");
					});
					//return DataStore.objects;
				}
			},

			find: function(params) {
				var that = this;
				if (typeof params.localId != "undefined"){
					return DataStore.locate(params.localId);
				}else if(typeof params.id != "undefined"){
					var instance = DataStore.locateBy({key: "id", value: params.id});
					if (instance == null){
						if (this.parent != null){
							instance = this.constructInstance();
						}else{
							instance = this.constructInstance();
						}

						//instance.syncAssociations();
						
						API.get(params.id, [],
						 	function(data){
							 	// var localId = instance.localId;
							 	for(var i in data) {
							 		if (i == 'items'){
							 			instance.items = {};
							 			for (j in data[i]){
							 				Item = DataStore.locateBy({key: "className", value: "Item"});
							 				item = Item.constructInstance(DataStore.build(data.items[j]));
							 				instance.items[item.localId] = item;
							 			}
							 		}else{
							 			instance[i] = data[i];
							 		}
							 	}
							 	// instance.localId = localId;
							 	DataStore.update(instance);

								//that.runCallback(instance);
							},
							function(data){
								console.log("Error");
							});
						this.loadAssociations(instance);
						return instance;
					}else{
						if (params.refresh == true){
							API.get(params.id, [],
							 	function(data){
								 	// var localId = instance.localId;
								 	for(var i in data) {
								 		if (i == 'items'){
								 			instance.items = {};
								 			for (j in data[i]){
								 			Item = DataStore.locateBy({key: "className", value: "Item"});
							 				item = Item.constructInstance(DataStore.build(data.items[j]));
							 				instance.items[item.localId] = item;
								 			}
								 		}else{
								 			instance[i] = data[i];
								 		}
								 	}
								 	// instance.localId = localId;
								 	DataStore.update(instance);

									//that.runCallback(instance);
								},
								function(data){
									console.log("Error");
								});
							this.loadAssociations(instance);
						}else{
							return instance;
						}
					}
				}else{
					if (this.parent != null){
						instance = this.constructInstance();
						API.get("", [{key: "filter[" + this.parent.config.slugs.singular + "_id]", value: this.parent.id}],
						 	function(data){
						 		if (data[0] != null){
						 			instance = DataStore.locate(instance.localId);
						 			var localId = instance.localId;
									for(j in data[0]) {
										instance[j] = data[0][j];
									}
									instance.localId = localId;
						 			DataStore.update(instance);
						 			that.runCallback(instance);

						 		}else{
						 			DataStore.update(instance)
						 		}
							},
							function(data){
								console.log("Error");
							});
						this.loadAssociations(instance);

						return instance;
					}else{
						return null;
					}
				}
			},
					update: function(instance){

						var foundInstance = DataStore.locate(instance.localId);
						if (foundInstance == null){
							instance = DataStore.build(instance);
						}


						console.log(instance);
						
						var data = {
							attributes: instance.attributes,
							relationships: instance.relationships,
							type: config.slugs.plural,
							id: instance.id.toString()
						};
						delete data.attributes.id;
						delete data.attributes.created_at;
						delete data.attributes.updated_at;

						for (i in data.relationships){
							if (data.relationships[i].data == null){
							 	delete data.relationships[i];
							}else if (data.relationships[i].data.type == null){
								delete data.relationships[i];
							}else{
								delete data.relationships[i].links;
							}
						};


						API.put(data, function(data){
							var localId = instance.localId;
							for(j in data) {
								instance[j] = data[j];
							}
							instance.localId = localId;
							DataStore.update(instance);
						},
						function(data){
							console.log("Error");
						});
						return instance;
			 		},

			"delete": function(instance) {
				var foundInstance = DataStore.locate(instance.localId);
				if (foundInstance == null){
					instance = DataStore.build(instance);
				}

				var data = {
					id: instance.id.toString()
				}

				API["delete"](data,
				 	function(data){	
						DataStore.remove(instance);
					},
					function(data){
						console.log("Error");
					});
			},
 
			constructInstance: function(oldObject){

				var model = this;
				var config = this.config;

				var object = {

						associations: {},

						model: {
							localId: model.localId
						},

						config: config,

						className: config.className,

						syncAssociations: function(){
							if (typeof this.associations != "undefined"){
								for (var i in this.associations) {
									this.associations[i].parent = this;
								};
							}
						},
				 		create: function(attributes, parentLocalId, relationships){


				 			var makeNewResource = function(params){

				 				var deferred = $q.defer();
				 				API.get("new", params, function(data){
				 					deferred.resolve(data);
				 				},
				 				function(data){
				 					deferred.resolve(data);
				 				});
				 				return deferred.promise;
				 			};

				 			var relationships = relationships;

				 			var instance = DataStore.locate(this.localId);

				 			console.log(instance.localId);
				 			console.log("parentLocalId: "+ parentLocalId);

				 			var params = [];
				 			if (parentLocalId != null){
				 				var parent = DataStore.locate(parentLocalId);
				 				if (parent.config == null){
				 					console.log(parent);
				 					parentModel =	DataStore.locateBy({key: "className", value: "ResponseSection"})
				 					parent = parentModel.constructInstance(parent);
				 					console.log(parent);
								}
				 				params.push({key: parent.config.slugs.singular + "_id", value: parent.id});
				 			}

				 			makeNewResource(params)
				 			.then(function(response){
								for(j in response) {
									instance[j] = response[j];
								}
								console.log(instance);
								instance = DataStore.update(instance);
				 				var data = {
				 					attributes: instance.attributes,
				 					type: config.slugs.plural,
				 					relationships: instance.relationships
				 				};
				 				for (i in data.relationships){
				 					if (data.relationships[i].data == null){
				 					 	delete data.relationships[i];
				 					}else if (data.relationships[i].data.type == null){
				 						delete data.relationships[i];
				 					}else{
				 						delete data.relationships[i].links;
				 					}
				 				};


				 				for (i in attributes){
				 					data.attributes[i] = attributes[i];
				 				};
				 				API.post(data, function(data){

				 					ScreenerTemplate = DataStore.locateBy({key: "className", value: "ScreenerTemplate"});

				 					//screener = ScreenerTemplate.find({id: 7, refresh: true})
				 					//DataStore.update(screener);

				 					console.log(instance);
				 					for(j in data) {
				 						instance[j] = data[j];
				 					}
				 					var model = DataStore.locate(this.model.localId);
				 					association_keys = [];
				 				 for (m in instance.associations){
				 				  childModel =	DataStore.locateBy({key: "className", value: m})
				 				  if (instance.associations[m].associationType == "hasOne"){
				 				  	 slug = childModel.config.slugs.singular
				 				  	 console.log(slug);
				 				  		if (instance[slug] != null){
				 				  			instance[slug] = childModel.constructInstance(instance[slug]);
				 				  			DataStore.update(instance[slug]);
				 				  			if (relationships[slug] != null){
				 				  				for (i in relationships[slug].attributes){
				 				  					instance[slug].attributes[i] = relationships[slug].attributes[i];
								 				}
				 				  			}
				 				  			childModel.update(instance[slug])

				 				  		}
				 				  }
				 				 }
				 					instance = DataStore.update(instance);
				 					if (model.className != "Link"){
				 						model.runCallback(instance);
				 					}
				 				},
				 				function(data){
				 					console.log("Error");
				 				});
				 				
				 			},
				 			function(errors){
				 				console.log(errors);
				 			});
				 		},
				 		setAssociations: function(){
				 			var schema = Schema.load();
				 			
				 				for (key in schema[this.config.className].associations) {
				 					
				 					for (var m = schema[this.config.className].associations[key].length - 1; m >= 0; m--) {
				 						var className = schema[this.config.className].associations[key][m]
				 						var association = {};
				 						association.localId = DataStore.locateBy({key: "className", value: className}).localId;
				 						association.associationType = key;
				 					
				 						if (key == "hasMany" || key == "hasOne"){
				 							if (association.children == null){
				 								association.children = [];
				 							}
				 							//association.children.push({localId: this.localId, className: this.config.className});
				 						}else if(key == "belongsTo"){
				 							if (association.parents == null){
				 								association.parents = [];
				 							}
				 							//association.parents.push({localId: this.localId, className: this.config.className});
				 						}else{
				 						}
				 						if (key == "hasMany"){
				 							this.associations[className] = association;
				 						}else if(key == "belongsTo" || key == "hasOne"){
				 							this.associations[className] = association;
				 						}else{
				 						}
				 					}; 
				 				};
				 				model = DataStore.locate(this.model.localId);
				 				model.instances.push({localId: this.localId});
				 			return this;
				 		}

				};

				if (oldObject != null){
					for (i in oldObject){
						object[i] = oldObject[i];
					}
				}

				return object.setAssociations(DataStore.build(object));
			}
		};

		return model;
	};

}]);