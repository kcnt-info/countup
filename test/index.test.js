import { resolve } from 'path'
import { Nuxt, Builder } from 'nuxt'
import { JSDOM } from 'jsdom'
import test from 'ava'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null

// Init Nuxt.js and create a server listening on localhost:4000
test.before(async () => {
  const config = {
    dev: false,
    rootDir: resolve(__dirname, '..')
  }
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.server.listen(4000, 'localhost')
}, 30000)

// Example of testing only generated html
test('Route / exits and render HTML', async t => {
  const context = {}
  const { html } = await nuxt.server.renderRoute('/', context)
  t.true(html.includes('kcnt countup anniversary'))
})

// Example of testing via dom checking
test('Route / exits and render HTML with CSS applied', async t => {
  const context = {}
  const { html } = await nuxt.server.renderRoute('/', context)
  const { window } = new JSDOM(html).window
  const element = window.document.querySelector('.subtitle')
  t.not(element, null)
  t.regex(element.textContent, /(.*)kcnt countup anniversary(.*)/)
  t.is(element.className, 'subtitle')
})

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', t => {
  nuxt.close()
})
