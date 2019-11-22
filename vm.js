const { VM } = require('vm2')

function getSandbox(names = []) {
	let data = {}
	for (let index in names) {
		const name = names[index]
		data[name] = require(name)
	}
	return data
}

const sandbox = getSandbox([
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

module.exports = new VM({
	timeout: 1000,
	sandbox,
	eval: false
})
