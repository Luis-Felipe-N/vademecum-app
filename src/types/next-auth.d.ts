// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
	/**
	 * Extends the built-in session.user type to include your custom fields.
	 */
	interface User {
		id: string;
		profilePicture?: string | null;
	}

	interface Session {
		user: User;
	}
}
