import { supabase } from "@/utils/supabase";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("query");

	try {
		const { data, error } = await supabase
			.from("icdCodes")
			.select()
			.or(`code.ilike.%${query}%,description.ilike.%${query}%`)
			.limit(50);

		if (error) throw error;

		return Response.json(data);
	} catch (error) {
		return Response.json({ error: "Database error" }, { status: 500 });
	}
}
