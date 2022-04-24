import { Request, Response } from "express";
import { getRedirectUrl } from "../../core/use-case/get-redirect-url.use-case";
import { isAuthenticatedRequest } from "../../core/use-case/is-authenticated-request.use-case";
import { getCaptivePortalContent } from "../../core/use-case/get-captive-portal-content.use-case";

export const OpenNDSController = (request: Request, response: Response) => {
    return response.redirect('https://google.fr');
    console.log("OpenNDSController", request.query)
    if (isAuthenticatedRequest(request.query.redir as string, request.query.tok as string))
        return response.redirect(getRedirectUrl(request.query.redir as string, request.query.tok as string))
    return response.send(getCaptivePortalContent({ fasQuery: request.query.fas as string, iv: request.query.iv as string }));
    
};