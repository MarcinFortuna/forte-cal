import React from "react";
import Orb from "@/components/react-bits-components/Orb";
import {SignIn} from "@clerk/nextjs";
import {dark} from "@clerk/themes";
import Image from "next/image";

interface LoginPageProps {

};

export default function LoginPage(props: LoginPageProps) {
    const {} = props;

    return (
        <div className="w-full h-full">
            <div className="w-full h-[100vh] flex items-center relative -z-1">
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    hue={0}
                    forceHoverState={false}
                />
            </div>
            <main className="flex flex-col items-center p-5 gap-10 top-[20vh] right-[33%] absolute animate-fade-in-slow">
                <Image src="/assets/logo_transparent.png" priority={false} width={300} height={300}
                       alt="ForteCal Logo"/>
                <SignIn appearance={{baseTheme: dark}}/>
            </main>
        </div>
    );
};