const require = async function() {
  if(arguments[1] == 'Error 404, file not found.')
    throw new Error(`cannot find module "${arguments[0]}"`)
  
  if(arguments[1] != null) {
    let exports = Object.create(null)
    await eval($$.format(arguments[1]))()
    return exports
  }
  
  if(!require.modules.has(arguments[0])) {
    const code = await (await fetch(arguments[0])).text()
    return await require(arguments[0], code)
  }
}

require.modules = new Map()

;(() => {
  const tag = /<(?<name>\w+)((?:\s+\w+=\{\w+\})*)>(.*)<\/\k<name>>/gs
  const tag2 = /(.*)<(?<name>\w+)((?:\s+\w+=\{\w+\})*)>(.*)<\/\k<name>>/gs
  
  const tags = `a b p hr br div span canvas`.split(' ')
  
  window.$$ = {
    format(code) {
      code = code
        .replaceAll("require", 'await require')
      
      code = $$.jsx(code)
      
      // console.log(code)
      
      return `async()=>{"use strict";${code}}`
    },
    
    jsx(code) {
      return code
        .replace(tag, ($, name, attrs, ins) => $$.ele(name, attrs, ins))
    },
    
    attrs(code) {
      code = code.trim()
      
      if(code == '') return `{}`
      
      const attrs = code.trim().split(/\s+/)
        .map(attr => {
          const [key, val] = attr.split('=')
          return `${key}:${val.slice(1, -1)}`
        }).join(',')
        
      return `{${attrs}}`
    },
    
    jsx2(code) {
      const content = []
      
      code = code.replace(tag2, ($, left, name, attrs, ins) => {
        content.push('`' + left.trim() + '`')
        content.push($$.ele(name, attrs, ins))
        return ''
      })
      
      content.push('`' + code.trim() + '`')
      return `[${content.filter(e => e != '``')}]`
    },
    
    ele(name, attrs, ins) {
      attrs = $$.attrs(attrs)
      content = $$.jsx2(ins)
      
      if (tags.includes(name)) return `createElement('${name}',${attrs},${content})`
      return `new ${name}(${attrs}).render(${content})`
    }
  }
})()

function createElement(name, attrs, content) {
  const ele = document.createElement(name)
  Object.entries(attrs).forEach(entry => ele.setAttribute(entry[0], entry[1]))
  // console.log(content)
  ele.append(...content)
  return ele
}

/** @param obj {CSSStyle} */
function css(obj) {
  return Object.entries(obj)
    .map(entry => `${entry[0]}:${entry[1]}`)
    .join(';') + ';'
}