import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
	try {
		const { default: app } = await import("../backend.ts");
		app(req, res);
	} catch (error) {
		console.error("Express API handler failed:", error);
		const details = error instanceof Error ? error.message : String(error);
		return res.status(500).json({ error: "The API request could not be handled.", details });
	}
}