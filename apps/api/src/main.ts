import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { auth } from './config/auth'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })

  const fastify = app.getHttpAdapter().getInstance()

  fastify.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      const url = new URL(request.url, `http://${request.headers.host}`)
      const headers = new Headers()
      for (const [key, value] of Object.entries(request.headers)) {
        if (value) headers.append(key, value.toString())
      }
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      })
      const response = await auth.handler(req)
      const body = response.body ? await response.text() : null
      reply.status(response.status)
      response.headers.forEach((value, key) => {
        reply.header(key, value)
      })
      return reply.send(body)
    },
  })

  await app.listen(process.env.PORT ?? 3001)
}

void bootstrap()
