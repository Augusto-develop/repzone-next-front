// @route-public

import Logo from "@/components/logo";
import LoginForm from "@/components/partials/auth/login-form";
import Social from "@/components/partials/auth/social";
import { PwLogoAvatarIcon, PwLogoNameIcon } from "@/components/pwicons/pwicons";
import { cookies } from "next/headers";
import Link from 'next/link';

// const Login3 = () => {
export default async function Login3() {

  // const csrfToken = await getCsrfToken();
  const csrfToken = cookies().get("next-auth.csrf-token")?.value.split("|")[0]

  return (
    <>
      <div
        className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(/images/all-img/bg-logo-nuvem2.jpg)`,
        }}
      >
        <div className="overflow-y-auto flex flex-wrap w-full h-dvh">
          <div
            className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 
s lg:w-1/2"
          >
            <div className="flex justify-center items-center min-h-screen pr-4">
              <Link href="/" className="flex gap-2 items-center">
                <PwLogoAvatarIcon fontSize="79px" />
                <div className="mt-4">
                  <PwLogoNameIcon fontSize="90px" />
                </div>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
            <div className="bg-default-50  relative h-auto  lg:mr-[150px] mr-auto p-10 md:rounded-md max-w-[520px] w-full ml-auto text-2xl text-default-900  mb-3">
              <div className="flex justify-center items-center text-center mb-6 lg:hidden ">
                <Link href="/">
                  <Logo />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h4 className="font-medium">Login</h4>
                <div className="text-default-500  text-base">
                  Faça login na sua conta para começar a usar o RepZone
                </div>
              </div>
              <LoginForm csrfToken={csrfToken || ''} />
              <div className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                <div className=" absolute inline-block  bg-default-50 dark:bg-default-100 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-default-500 font-normal ">
                  Ou continue com
                </div>
              </div>
              <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social locale="en" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 lg:block hidden text-white py-5 px-5 text-xl w-full">
            <span className="text-white font-bold ms-1"></span>
          </div>
        </div>
      </div>
    </>
  );
};

// export default Login3;
