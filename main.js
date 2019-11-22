var AlfredNode = require('alfred-workflow-nodejs')
var actionHandler = AlfredNode.actionHandler
var workflow = AlfredNode.workflow

const vm = require('./vm')

actionHandler.onAction('js', function(query) {
	try {
		var result = vm.run(query)
		let subtitle = 'Copy to Clipboard'

		if (typeof result !== 'string') {
			result = result.toString()
		}

		if (result == null || result == '') {
			result = 'No results'
			subtitle = ''
		}

		workflow.addItem(
			new AlfredNode.Item({
				title: result,
				subtitle,
				valid: true, // 回车是否可用 : true | false (optional, default = true)
				arg: result, // 传递值到下一个模块
				icon:
					'/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns',
				text: {
					copy: result //按 command+c 复制出来的文本
				}
			})
		)

		workflow.feedback()
	} catch (e) {
		workflow.error(e.message, e.name)
	}
})
AlfredNode.run()
