import { Request, Response } from "express";
import { getRedirectUrl } from "../../core/use-case/get-redirect-url.use-case";
import { isAuthenticatedRequest } from "../../core/use-case/is-authenticated-request.use-case";
import { getCaptivePortalContent } from "../../core/use-case/get-captive-portal-content.use-case";

export const OpenNDSController = async (request: Request, response: Response) => {
    console.log("OpenNDSController", request.query)
    if (isAuthenticatedRequest(request.query.redir as string, request.query.tok as string))
        return response.redirect(getRedirectUrl(request.query.redir as string, request.query.tok as string))
    return response.send(await getCaptivePortalContent({ fasQuery: request.query.fas as string, iv: request.query.iv as string }));
    
};