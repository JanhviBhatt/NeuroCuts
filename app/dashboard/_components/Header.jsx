"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname()
    const isCreateNewPage = (pathname === '/dashboard/create-new') ||(pathname ==='/account')

    return (
        <div className="fixed top-0 w-full z-50 bg-white p-4 px-6 flex items-center justify-between shadow-md">
            <div className="flex gap-3 items-center">
                <Image src="/logo.png" alt="logo" width={30} height={30} />
                <h2 className="text-xl font-semibold font-[Quicksand] text-gray-800">NeuroCuts</h2>
            </div>
            <div className="flex gap-3 items-center">
                { isCreateNewPage && (
                      <Link href={'/dashboard/'}>
                      <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">
                      Dashboard
                      </button>
                      </Link>
                )
                }
                <UserButton />
            </div>
        </div>
    );
};

export default Header;
