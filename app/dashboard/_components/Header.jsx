"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return (
        <div className="p-3 px-5 flex items-center justify-between shadow-md">
            <div className="flex gap-3 items-center">
                <Image src="/login.jpg" alt="logo" width={30} height={30} />
                <h2 className="font-bold text-xl">Ai Short</h2>
            </div>
            <div className="flex gap-3 items-center">
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Dashboard
                </button>
                <UserButton />
            </div>
        </div>
    );
};

export default Header;
