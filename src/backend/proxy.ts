import type { ClientRequest, IncomingMessage } from 'node:http';
import * as querystring from 'node:querystring';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuid } from 'uuid';
import logger from './logger.js';

const restream = (proxyReq: ClientRequest, req: IncomingMessage) => {
    const requestBody = (req as Request).body;
    if (requestBody) {
        const contentType = proxyReq.getHeader('Content-Type');

        let bodyData: string | undefined;

        if (contentType === 'application/json') {
            bodyData = JSON.stringify(requestBody);
        }

        if (contentType === 'application/x-www-form-urlencoded') {
            bodyData = querystring.stringify(requestBody);
        }

        if (bodyData) {
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
};

export const doProxy = (targetUrl: string, pathPrefix?: string): RequestHandler => {
    // biome-ignore lint/suspicious/noExplicitAny: Preserve the existing proxy configuration typing.
    const config: any = {
        changeOrigin: true,
        logger,
        on: {
            proxyReq: restream,
        },
        secure: true,
        target: `${targetUrl}`,
    };

    if (pathPrefix) {
        config.pathRewrite = (path: string) => {
            return `${pathPrefix}${path}`;
        };
    }

    return createProxyMiddleware(config);
};

export const addCallId = (): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.headers['nav-call-id'] = req.headers['x-correlation-id'] ?? uuid();
        next();
    };
};
