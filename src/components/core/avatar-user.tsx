import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarProps {
  author: {
    profilePicture?: string | null | undefined
    name?: string | null
  }
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16", 
}

export function AvatarAuthor({ author, size }: AvatarProps) {
  return (
    <Avatar className={sizeClasses[size || "md"]}>
      {author.profilePicture && (
        <AvatarImage
          className="object-cover object-top"
          src={author.profilePicture || ""}
          alt={`Avatar de ${author.name}`}
        />
      )}
      <AvatarFallback>
        {author.name?.charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  )
}