export interface IContext {
    req: Request;
    res: Response;
    payload?: { userId: string };
}
