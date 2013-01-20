// var helpermonkey = require('../../helpermonkey.js');

var prefix = 'php_'
	, set = function(obj, key, v) { return obj[prefix+key] = v; }
	, get = function(obj, key) { return obj[prefix+key]; };

function phpDataType(specType)
{
	var primitives = M.primitives
		, arr = false;

	if (specType.substr(-1) == ']') 
	{
		arr = true;
		specType = specType.substr(0, specType.length-2);
	}

	var type = primitives[ specType ];
	if (!type) type = specType;
	if (arr) type = 'array /* ' + type + '[] */';

	return type;
}

function phpVariableData(specType, data)
{
	switch (specType)
	{
		case 'string':
			return data === null ? null : "'" + escape(data) + "'";
		break;

		default:
			if (specType.substr(-1) == ']') 
			{
				return 'array()';
			}
			else if ( typeof M.primitives[ specType ] == 'undefined' )
			{
				return 'new ' + specType + 'Object()';
			}
		break;
	}

	return data;
}

function uc(str)
{
	return str[0].toUpperCase() + str.substr(1);
}

function escape(str)
{
	return str.replace(/\'/g, '\\\'');
}

function localizeProperties(properties) {
	properties.forEach(function(property) {
		// set prefixed defaults
		set(property, 'type', phpDataType(property.type));
		set(property, 'default', phpVariableData(property.type, property.default));
	});
}

function localizeParameters(parameters) {
	parameters.forEach(function(parameter) {
		if (typeof parameter.default != 'string' && parameter.default !== null) throw new Error('Parameter defaults can only be null or a string');

		// set prefixed defaults
		set(parameter, 'type', phpDataType(parameter.type));
		set(parameter, 'default', phpVariableData(parameter.type, parameter.default));

		if (parameter.type.substr(-1) == ']') 
		{
			set(parameter, 'type', phpDataType(parameter.type));
		}

		var type = get(parameter, 'type');
		if (parameter.default && M.primitives[ type.split(' ')[0] ]) // php can't assign a default to primitive types with type hinting
		{
			set(parameter, 'type', '/* ' + type.replace(/\/\*/g, '').replace(/\*\//g, '') + ' */');
		}
	});
}

function localizeReturns(returns) {
	set(returns, 'type', phpDataType(returns.type));
}

function fileName(spec, type, name) {
	var filename = '';

	name = uc(name);

	switch (type)
	{
		case 'api':
			filename = name;
		break;

		case 'edit':
		case 'base':
			filename = spec.api_name + '_' + name + 'Object';
		break;

		case 'object':
			filename = spec.api_name + '_Internal' + name + 'Object';
		break;
	}

	return filename + '.php';
},


var M = {
	primitives: {
			char: 'string'
		, string: 'string'
		, short: 'int'
		, int: 'int'
		, long: 'int'
		, float: 'float'
		, double: 'float'
		, bool: 'bool'
	},

	preprocess: function(objects) {
		objects.forEach(function(object) {
			set(object, 'classname', uc(object.object));

			if (object.properties) localizeProperties(object.properties);

			object.methods.forEach(function(method) {
				if (method.parameters) localizeParameters(method.parameters);
				if (method.returns) localizeReturns(method.returns);

				set(method, 'rest', method.rest.toLowerCase());
			});
		});
	},

	postprocess: function(code) {
		return '<?php\n' + code;
	},

	build: function(spec, cb) {
		var objects = spec.objects

			, templateApi = '../../templates/' + target + 's/' + language + '/api.mustache'
			, templateObject = '../../templates/' + target + 's/' + language + '/object.mustache'
			, templateEdit = '../../templates/' + target + 's/' + language + '/edit.mustache'
			, templateBase = '../../templates/' + target + 's/' + language + '/base/' + base + '.mustache'

			, apiCode = M._process(templateApi, spec)
			, baseCode = M._process(templateBase, spec);

		cb(fileName(spec, 'api', spec.api_name), M.postprocess(apiCode), 'api', spec.api_name); 
		cb(fileName(spec, 'base', 'Base'), M.postprocess(baseCode), 'base', 'Base'); 

		objects.forEach(function(object) {

			// add references to api_* properties to each object
			for (var k in spec)
			{
				if (k.substr(0, 4) == 'api_')
				{
					object[k] = spec[k];
				}
			}

			var objectCode = M._process(templateObject, object);
			cb(processor.fileName(spec, 'object', object.object), processor.postprocess(objectCode), 'object', object.object); 

			var editCode = M._process(templateEdit, object);
			cb(processor.fileName(spec, 'edit', object.object), processor.postprocess(editCode), 'edit', object.object); 
		});
	}
};

module.exports = M;

