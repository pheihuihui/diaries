import { build } from 'esbuild'
import { copyFile, readdir, stat, statSync, readdirSync, mkdirSync } from 'fs-extra'

const content_dir = './src/content'
const resource_dir = './src/resources'
const resource_static_types = ['txt', 'glsl', 'html', 'css', 'ico', 'png', 'gif']
const resource_dynamic_types = ['ts', 'js', 'tsx', 'jsx']
const dist_dir = './dist'

export function logdir() {
    readdir(content_dir).then(x => console.log(x))
}

export function buildProject(name: string) {
    let projdir = `${content_dir}/${name}`
    let projdistdir = `${dist_dir}/${name}`
    mkdirSync(projdistdir)
    let files = listAllFiles(projdir)
    files.forEach(f => {
        let arr = f.split('.')
        let len = arr.length
        if (len >= 2) {
            let ext = arr[len - 1]
            if (resource_static_types.includes(ext)) {
                let arr2 = f.split('/')
                let len2 = arr2.length
                let filename = arr2[len2 - 1]
                copyFile(f, `${projdistdir}/${filename}`)
            }
        }
    })
    copyFile(`${resource_dir}/index.html`, `${projdistdir}/index.html`)
    let index = `${projdir}/index.ts`
    build({
        entryPoints: [index],
        treeShaking: 'ignore-annotations',
        outfile: `${projdistdir}/bundle.js`,
        tsconfig: 'tsconfig.json',
        bundle: true,
        define: { 'process.env.NODE_ENV': '"production"' }
    })
}

function listAllFiles(dir: string) {
    let res: string[] = []
    let _dir = readdirSync(dir)
    _dir.forEach(v => {
        let stt = statSync(`${dir}/${v}`)
        if (stt.isFile()) {
            res.push(`${dir}/${v}`)
        }
        if (stt.isDirectory()) {
            let tmp = listAllFiles(`${dir}/${v}`)
            res = res.concat(tmp)
        }
    })
    return res
}