import { z } from "zod";
import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";

export async function pollResults(app: FastifyInstance) {
  app.get('/polls/:pollId/results', { websocket: true }, async (connection, request) => {
      const getPollParams = z.object({
        pollId: z.string().uuid(),
      })

      const { pollId } = getPollParams.parse(request.params)

      // Pattern Pub/Sub - Publish/Subscribe
      voting.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message))
    })
  })
}
