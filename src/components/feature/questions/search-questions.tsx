'use client'

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function SearchQuestions() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  /// eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeOutSearch: any

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    clearTimeout(timeOutSearch)
    timeOutSearch = setTimeout(async () => {
      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }

      replace(`${pathname}?${params.toString()}`);
    }, 700)
  }

  return (
    <div className="grow">
      <div className="relative mx-auto w-full max-w-xl">
        <Input
          className="peer h-12 ps-10 pe-14 focus-visible:border-cyan-300/80 focus-visible:ring-cyan-300/50"
          placeholder="O que é um sistema monolítico?"
          type="search"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-4">
          <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}