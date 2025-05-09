import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { IconEye, IconEyeOff, IconX } from "@tabler/icons-react";

const SignUp = () => {
  const [user, setUser] = useState<User>({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle Submit
  const handleSubmit = () => {
    if (!user.fullName || !user.email || !user.password) {
      toast.error("Please Fill All Fields");
      return;
    }
    (document.getElementById("signup") as HTMLDialogElement).close();
    const response = axios.post("/api/auth/signup", user);
    toast.promise(response, {
      loading: "Signing Up...",
      success: "Signed Up Successfully",
      error: "Sign Up Failed",
    });
  };

  return (
    <>
      <dialog id="signup" className="modal w-screen">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 border-base-content cursor-pointer"
              onClick={() => {
                (
                  document.getElementById("signup") as HTMLDialogElement
                ).close();
              }}
            >
              <IconX className="text-base-content" />
            </button>
            <section className="relative z-10 overflow-hidden">
              <div className="container">
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-10">
                    <h3 className="py-4 text-base-content text-center text-2xl font-bold sm:text-3xl">
                      Create your account
                    </h3>
                    <p className="py-2 mb-3 text-center text-base-content">
                      Hey there! Let's get started with your account
                    </p>
                    {/* Full Name */}
                    <div className="mb-8">
                      <label
                        htmlFor="fullName"
                        className="mb-3 block text-sm text-base-content"
                      >
                        {" "}
                        Full Name{" "}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={(e) =>
                          setUser({ ...user, fullName: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className="w-full rounded-sm border border-stroke bg-base px-6 py-3 text-base-content outline-none transition-all duration-300 focus:border-primary bg-base-200"
                      />
                    </div>
                    {/* Email */}
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm text-base-content"
                      >
                        {" "}
                        Work Email{" "}
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="email"
                          name="email"
                          value={user.email}
                          onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                          }
                          placeholder="Enter your Email"
                          className="w-full rounded-sm border border-stroke bg-base-200 text-base-content px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary"
                        />
                        <br />
                      </div>
                    </div>
                    {/* Password */}
                    <div className="mb-4 relative">
                      <label className="mb-3 block text-sm text-base-content">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={user.password}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              password: e.target.value,
                            })
                          }
                          className="w-full rounded-sm border border-stroke px-6 py-3 outline-none transition-all duration-300 focus:border-primary bg-base-200 text-base-content"
                          placeholder="Enter Password"
                          required
                        />
                        <span
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-base-content"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <IconEyeOff size={20} />
                          ) : (
                            <IconEye size={20} />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mb-8 flex">
                      <span className="text-base-content">
                        By creating account means you agree to the
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Terms and Conditions{" "}
                        </a>
                        , and our
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Privacy Policy{" "}
                        </a>
                      </span>
                    </div>
                    {/* Sign UP Protocol */}
                    <div className="mb-6">
                      <button
                        className={`flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-primary-content font-medium shadow-submit duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50`}
                        onClick={handleSubmit}
                      >
                        Sign up
                      </button>
                    </div>
                    <p className="text-center text-base font-medium text-base-content">
                      Already using Prompt-2-Dataset ?{" "}
                      <button
                        onClick={() => {
                          (
                            document.getElementById(
                              "signup"
                            ) as HTMLDialogElement
                          ).close();
                          (
                            document.getElementById(
                              "login"
                            ) as HTMLDialogElement
                          ).showModal();
                        }}
                        className="text-primary hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-0 z-[-1]">
                <svg
                  width="1440"
                  height="969"
                  viewBox="0 0 1440 969"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_95:1005"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="1440"
                    height="969"
                  >
                    <rect width="1440" height="969" fill="#090E34" />
                  </mask>
                  <g mask="url(#mask0_95:1005)">
                    <path
                      opacity="0.1"
                      d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                      fill="url(#paint0_linear_95:1005)"
                    />
                    <path
                      opacity="0.1"
                      d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                      fill="url(#paint1_linear_95:1005)"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_95:1005"
                      x1="1178.4"
                      y1="151.853"
                      x2="780.959"
                      y2="453.581"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="currentColor" />
                      <stop
                        offset="1"
                        stopColor="currentColor"
                        stopOpacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_95:1005"
                      x1="160.5"
                      y1="220"
                      x2="1099.45"
                      y2="1192.04"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="currentColor" />
                      <stop
                        offset="1"
                        stopColor="currentColor"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </section>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default SignUp;
