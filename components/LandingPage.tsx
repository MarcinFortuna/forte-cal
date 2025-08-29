"use client";

import React from "react";
import Image from "next/image";
import {SignIn} from "@clerk/nextjs";
import {dark} from "@clerk/themes";

interface LandingPageProps {

};

export default function LandingPage(props: LandingPageProps) {
    const {} = props;

    return (
        <main className="flex items-center justify-center p-10 gap-24 animate-fade-in max-md:flex-col">
            <section className="flex flex-col items-center gap-5">
                <Image src="/assets/logo_transparent.png" priority={false} width={300} height={300}
                       alt="ForteCal Logo"/>
                <h1 className="text-2xl lg:text-3xl">Your personal appointment manager</h1>
                <p className="font-extralight">
                    Join millions of professionals who easily book meetings with the #1 scheduling tool
                </p>
                <Image src="/assets/planning.jpeg" priority={false} width={300} height={300} alt="Planning"/>
            </section>
            <section>
                <SignIn routing="hash" appearance={{baseTheme: dark}}/>
            </section>
        </main>
    );
};