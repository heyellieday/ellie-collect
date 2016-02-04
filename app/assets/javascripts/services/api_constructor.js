app.service("JsonApi",[ '$resource', '$http', '$q', '$timeout', function($resource, $http, $q, $timeout) {

	this.initialize = function(config){
			return ApiConstructor(config);
	};

	var ApiConstructor = function(config){

		var Route = {
			build: function(action, params){
				var route = "/";
				route += config.namespace;
				route += "/";
				route += config.slugs.plural;
				if (action != ""){
					route += "/"
					route += action;
				}
				if (params != null && params.length != 0){
					route += "?";
					for (var i = params.length - 1; i >= 0; i--) {
						route += params[i].key+ "=" + params[i].value;
						if ((params.length - 1) != i){
							route += "&";
						}
					};
					// if (params.belongs != null){
					// 	route += this.buildAssociation(params.belongs);
					// }
				}
				return route;
			},

			buildAssociation: function(belongs){

				return "?"+ belongs.key +"=" + belongs.id;

			}
		};

		var Request = {

			build: function(action, requestType, data, params){
				return {
					method: requestType,
					url: Route.build(action, params),
					headers: {
					  'Content-Type': "application/vnd.api+json"
					},
					data: {
						data: data
					}
				}
			},

			make: function(req, onSuccess, onError){

				var deferred = $q.defer();
				$http(req)
				.success(function(response) {
					deferred.resolve(response.data);
				}).error(function(){
					deferred.resolve(response.errors);
				})
				deferred
				.promise
				.then(onSuccess, onError);
			}
		};

		return {
			onResourceSuccess: config.onResourceSuccess,

			onResourceError: config.onResourceError,

			put: function(data, onResourceSuccess, onResourceError){
				req = Request.build(data.id.toString(), "PUT", data );
				Request.make(req, onResourceSuccess, onResourceError);
			},
			post: function(data, onResourceSuccess, onResourceError){
				req = Request.build("", "POST", data, [] );
				Request.make(req, onResourceSuccess, onResourceError);
			},
			get: function(action, params, onResourceSuccess, onResourceError){
				req = Request.build(action, "GET", {}, params);
				Request.make(req, onResourceSuccess, onResourceError);
			},
			"delete": function(data, onResourceSuccess, onResourceError){
				req = Request.build(data.id.toString(), "DELETE", data);
				Request.make(req, onResourceSuccess, onResourceError);
			}
		}
	};

}]);