import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
	process.env.VERCEL = "1";
	const { default: app } = await import("../server");
	return app(req, res);
}