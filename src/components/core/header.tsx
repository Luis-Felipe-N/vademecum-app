"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Login from "../feature/auth/login";
import Register from "../feature/auth/register";
import CreateQuestionModal from "../feature/question/create-question/create-question-modal";
import Logo from "./logo";
import UserMenu from "./user-menu";

const navigationLinks = [
	{ href: "/", label: "Home", active: true },
	{ href: "/raking", label: "Raking", }
];

export default function Header() {
	const { status } = useSession();

	return (
		<header className="px-4 md:px-6 mx-auto py-4">
			<div className="flex h-16 items-center justify-between gap-4">
				<div className="flex flex-1 items-center gap-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								className="group size-8 md:hidden"
								variant="ghost"
								size="icon"
							>
								{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									className="pointer-events-none"
									width={16}
									height={16}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M4 12L20 12"
										className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
									/>
									<path
										d="M4 12H20"
										className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
									/>
									<path
										d="M4 12H20"
										className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
									/>
								</svg>
							</Button>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-36 p-1 md:hidden">
							<NavigationMenu className="max-w-none *:w-full">
								<NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
									{navigationLinks.map((link) => (
										<NavigationMenuItem key={link.label} className="w-full">
											<NavigationMenuLink
												href={link.href}
												className="py-1.5"
												active={link.active}
											>
												{link.label}
											</NavigationMenuLink>
										</NavigationMenuItem>
									))}
								</NavigationMenuList>
							</NavigationMenu>
						</PopoverContent>
					</Popover>
					<div className="flex items-center gap-6">
						<Link href={"/"} className="text-primary hover:text-primary/90">
							<Logo />
						</Link>
						{/* Navigation menu */}
						<NavigationMenu className="max-md:hidden">
							<NavigationMenuList className="gap-2">
								{navigationLinks.map((link) => (
									<NavigationMenuItem key={link.href}>
										<NavigationMenuLink
											active={link.active}
											href={link.href}
											  className="text-muted-foreground hover:text-primary border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
										>
											{link.label}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-end gap-2">
					{status !== "authenticated" ? (
						<>
							<Register />
							<Login />
						</>
					) : (
						<div className="flex gap-4 items-center">
							<CreateQuestionModal />
							<UserMenu />
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
