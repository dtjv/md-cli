#!/usr/bin/env node

import process from 'node:process'
import { basename } from 'node:path'
import { readFile } from 'node:fs/promises'
import showdown from 'showdown'
import mdcss from './github-markdown.js'

const shell = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" width="device-width, initial-scale=1.0" />
      <title>{title}</title>
      <style>{mdcss}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/{theme}.min.css">
      <style>
        body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 45px;
        }
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #0d1117;
          }
        }
      </style>
      <style>
        .markdown-body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 45px;
        }
        @media (max-width: 767px) {
          .markdown-body {
            padding: 15px;
          }
        }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js" integrity="sha512-Pbb8o120v5/hN/a6LjF4N4Lxou+xYZ0QcVF8J6TWhBbHmctQWd8O6xTDmHpE/91OjPzCk4JRoiJsexHYg4SotQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    </head>
    <body class="markdown-body">
    {content}
      <script>hljs.highlightAll();</script>
    </body>
  </html>
`

const usage = `Usage: md file [theme] > example.html`

async function main() {
  const file = process.argv[2]
  const theme = process.argv[3] ?? 'hybrid'

  if (!file) {
    throw new Error(usage)
  }

  try {
    const data = await readFile(file, { encoding: 'utf8' })
    const converter = new showdown.Converter()

    converter.setFlavor('github')

    let html = converter.makeHtml(data)
    html = shell
      .replace(`{title}`, basename(file))
      .replace(`{mdcss}`, mdcss)
      .replace(`{theme}`, theme)
      .replace(`{content}`, html)

    console.log(html)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  process.exit(0)
}

main()
