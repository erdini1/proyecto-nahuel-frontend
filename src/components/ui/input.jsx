import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const inputRef = ref || React.useRef();

  React.useEffect(() => {
    const handleWheel = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    };

    if (inputRef && inputRef.current) {
      const inputElement = inputRef.current;
      inputElement.addEventListener("wheel", handleWheel);
      inputElement.addEventListener("keydown", handleKeyDown);

      // Cleanup function
      return () => {
        inputElement.removeEventListener("wheel", handleWheel);
        inputElement.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [inputRef]);

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={inputRef}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };


// import * as React from "react"

// import { cn } from "@/lib/utils"

// const Input = React.forwardRef(({ className, type, ...props }, ref) => {
//   return (
//     (<input
//       type={type}
//       className={cn(
//         "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       ref={ref}
//       {...props} />)
//   );
// })
// Input.displayName = "Input"

// export { Input }
