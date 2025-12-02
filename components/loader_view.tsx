import { Logo } from "./logo";

export const LoaderView = () => {
  return (
    <div className="h-[100svh] w-full flex items-center justify-center ">
      <div className="relative">
        {/* Pulsing background circle */}

        {/* Rotating logo */}
        <div className="relative  ">
          <Logo />
        </div>

        {/* Outer rotating ring */}
        <div className="absolute -inset-4 border-3 border-primary border-t-transparent rounded-full animate-spin duration-2000"></div>
      </div>
    </div>
  );
};
