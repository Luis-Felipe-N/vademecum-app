import { BoltIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarAuthor } from "./avatar-user";

export default function UserMenu() {
	const { data } = useSession();

	async function handleLogout() {
		await signOut({
			callbackUrl: "/",
		});
	}

	if (!data) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
					<AvatarAuthor author={data.user} size="sm" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64" align="end">
				<DropdownMenuLabel className="flex min-w-0 flex-col">
					<span className="text-foreground truncate text-sm font-medium">
						{data.user?.name}
					</span>
					<span className="text-muted-foreground truncate text-xs font-normal">
						{data.user?.email || "No email provided"}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
						<Link href={"/profile"} >
					<DropdownMenuItem className="cursor-pointer">
						<BoltIcon size={16} className="opacity-60" aria-hidden="true" />
						Perfil
					</DropdownMenuItem>
						</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={handleLogout}>
					<LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
					<span className="hover:text-red-200">Sair</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
