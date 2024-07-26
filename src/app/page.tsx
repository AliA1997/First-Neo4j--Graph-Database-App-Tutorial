import dynamic from "next/dynamic";
const UserForm = dynamic(() => import("./components/UserForm"), { ssr: false });
const Tabs = dynamic(() => import("./components/Tabs"), { ssr: false });


export default function Home() {
  return (
    <main className="flex flex-col min-h-screen flex-col items-center justify-center p-1">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <UserForm />
      </div>
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <Tabs />
      </div>
    </main>
  );
}
