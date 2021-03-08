const proc = require('child_process')
const fs = require('fs-extra')
const esb = require('esbuild')

const arg = process.argv[2]
const dist_dir = './dist'
const build_dir = './build'
const src_dir = './src'
const resource_dir = `${src_dir}/resources`
const content_table_name = 'table.txt'

fs.emptyDirSync(dist_dir)
let scripts = fs.readdirSync(build_dir)
let names = []
scripts.forEach(v => {
    let tmp = v.split('.')
    if (tmp.length == 2 && tmp[1] == 'ts') {
        names.push(tmp[0])
    }
})

// table of contents
let str = names.join(', ')
let data = new Uint8Array(Buffer.from(str))
fs.writeFile(`${dist_dir}/${content_table_name}`, data, err => {
    if (err) {
        console.log(err)
    }
})
esb.build({
    entryPoints: ['./src/index.ts'],
    treeShaking: 'ignore-annotations',
    outfile: './dist/bundle.js',
    tsconfig: 'tsconfig.json',
    bundle: true,
    define: { 'process.env.NODE_ENV': '"production"' }
})
fs.readdir(resource_dir)
    .then(x => {
        x.forEach(f => {
            fs.copyFile(`${resource_dir}/${f}`, `${dist_dir}/${f}`)
        })
    })

if (arg == 'all') {
    // contents
    names.forEach(n => {
        proc.exec(`ts-node --project ./tsconfig.build.json ${build_dir}/${n}.ts`, (err, stdout, stderr) => {
            console.log(stdout)
            console.log(stderr)
        })
    })

} else {
    proc.exec(`ts-node --project ./tsconfig.build.json ${build_dir}/${arg}.ts`, (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
    })
}
