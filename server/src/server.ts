import { app, pluginsReady } from './app'
import { env } from './config/env'

const start = async () => {
    try {
        // Wait for plugins to be registered before listening
        await pluginsReady

        await app.listen({
            port: env.PORT,
            host: '0.0.0.0',
        })

        console.log(`Server running on port ${env.PORT}`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()