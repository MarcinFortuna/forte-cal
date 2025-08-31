"use client";

import Link from "next/link";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {PRIVATE_NAV_LINKS} from "@/constants";
import {usePathname} from "next/navigation";
import {SignedIn, UserButton} from "@clerk/nextjs";

export default function PrivateNavBar() {
    const pathname = usePathname();

    return (
        <nav
            className="flex justify-between items-center fixed z-50 w-full h-28 bg-gray-700 px-10 gap-4 shadow-2xl mb-28">
            <Link href="/login" className="flex items-center gap-1 hover:scale-150 duration:500 cursor-pointer">
                <Image src="/assets/logo_transparent.png" width="100" height="100" alt="Forte Cal"/>
            </Link>
            <section className="sticky top-0 flex justify-between">
                <div className="flex flex-1 max-sm:gap-0 sm:gap-6">
                    {
                        PRIVATE_NAV_LINKS.map((item) => {
                            const isActive = item.route === pathname || pathname.startsWith(`${item.route}/`);
                            return <Link href={item.route} key={item.label} className={cn(
                                "flex gap-4 items-center p-4 rounded-lg justify-start hover:scale-150 duration:300",
                                isActive && "bg-blue-100 rounded-3xl"
                            )}>
                                <Image src={item.imgUrl} alt={item.label} width={30} height={30}/>
                            </Link>
                        })
                    }
                </div>
            </section>
            <div className="hover:scale-150 duration:500">
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </div>
        </nav>
    );
};