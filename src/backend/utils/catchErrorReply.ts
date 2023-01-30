import { FastifyReply } from 'fastify';

export const catchErrorReply = (
  error: string | { response: Object; status: number } | any,
  reply: FastifyReply,
) => {
  if (typeof error === 'string') {
    reply.status(500).send({ status: 0, data: null, message: error });
  } else if (error instanceof Error) {
    reply.status(500).send({ status: 0, data: null, message: error.message });
  } else {
    reply.status(error.status).send(error.response);
  }
};
