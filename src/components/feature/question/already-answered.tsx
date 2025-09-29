import { Check } from "lucide-react";

type AlreadyAnsweredProps = {
  author: {
		 profilePicture?: string | null | undefined
    name?: string | null
	}
}

export function AlreadyAnswered({author}: AlreadyAnsweredProps) {
	return (
		<div className="text-emerald-600 flex gap-1 items-center bg-emerald-950/50 border-emerald-800/50 px-3 py-2 rounded-2xl">
			<Check size={17} />
			<small className="">
				{" "}
				Respondida por <strong>{author.name}</strong>
			</small>
		</div>
	);
}
