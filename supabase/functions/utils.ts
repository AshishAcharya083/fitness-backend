export default function getTokenFromRequest(req: Request): string {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");

    return token;
}
