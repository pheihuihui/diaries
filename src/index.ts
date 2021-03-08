fetch('./table.txt')
    .then(x => x.text())
    .then(x => {
        let titles = x.split(', ')
        titles.forEach(v => {
            createLink(v)
        })
    })

function createLink(str: string) {
    let ele = document.createElement('a')
    let txt = document.createTextNode(str)
    ele.appendChild(txt)
    ele.href = `/diaries/${str}/index.html`
    document.body.appendChild(ele)
    document.body.appendChild(document.createElement('br'))
}