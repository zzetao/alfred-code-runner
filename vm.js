const { VM } = require('vm2')

function getModules(names = []) {
	let data = {}
	for (let index in names) {
		const name = names[index]
		data[name] = require(name)
	}
	return data
}

const modules = getModules([
	'child_process',
	'cluster',
	'crypto',
	'dgram',
	'dns',
	'events',
	'fs',
	'http',
	'https',
	'net',
	'os',
	'path',
	'querystring',
	'url',
	'util'
])

const sandbox = Object.assign({}, modules, {
	'btoa': (str) => Buffer.from('' + str, 'binary').toString('base64'), // encode
	'atob': (str) => Buffer.from(str, 'base64').toString('binary'), // decode
	'Buffer': Buffer
})

module.exports = new VM({
	timeout: 1000,
	sandbox,
	eval: false
})
