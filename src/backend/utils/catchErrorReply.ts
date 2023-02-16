import { FastifyReply, FastifyRequest } from 'fastify';

const getErrorMessage = (req: FastifyRequest, message: string) => {
  const url = req.url;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  const errorMessage = `url: ${url}; message: ${message}; ip: ${ip}; user-agent: ${userAgent};`;
  return errorMessage;
};

export const catchErrorReply = (
  error: string | { response: Object; code: number } | any,
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  if (typeof error === 'string') {
    console.error(getErrorMessage(req, error));
    reply.status(500).send({ status: 0, data: null, message: error });
  } else if (error instanceof Error) {
    console.error(getErrorMessage(req, error.message));
    reply.status(500).send({ status: 0, data: null, message: error.message });
  } else if (
    error &&
    typeof error === 'object' &&
    error.code &&
    error.response
  ) {
    if (error.code === 500) {
      console.error(getErrorMessage(req, error.response.message));
    }
    reply.code(error.code).send(error.response);
  } else {
    reply.code(500).send(`catchErrorReply unknown error: ${error}`);
  }
};
