"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sendSignupRequest } from "@/lib/firebase/users";
import { Textarea } from "../ui/textarea";
import AlertDialogSeccess from "../seccessAlert";
import { cn } from "@/lib/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import {  firebaseAuth } from "@/lib/firebase/config";
import { createSession } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { signInWithGoogle } from "@/lib/firebase/auth";
export default function AuthForm() {
  const [join, setjoin] = useState(true);
 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const [message, setMessage] = useState("");
  const [major,setMajor]=useState("")
 const [year,setyear]=useState("")
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState<boolean>(false);
 const [error, setError] = useState<string | null>(null);
//  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
//  const signWithGoogle = async () => {
//     try {
//       await signInWithGoogle();
//       setInterval(() => {      
//       }, 1000);
//     } catch (error) {
//       setError("Error signing in with Google please try again later.");
//       console.error("Error signing in with Google:", error);
//     }
//   }

 const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!password || !email){
      setError("Please fill in all required fields");
      return;
    }
    try{      
       setError(null);
      setLoading(true);
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      // Ensure server session cookie is created before navigating
      try {
        const idToken = await credential.user.getIdToken();
        const refreshToken = credential.user.refreshToken;
        await createSession(idToken, refreshToken);
      } catch (err) {
        console.error("createSession from sign-in form failed:", err);
      }

      setLoading(false);
      // Navigate to home after successful sign in and session creation
      router.push("/");
    
     
    } catch (error) {
    setError("Error signing in please check your credentials.");
      console.error("Error signing in:", error);
      setLoading(false);
    }
    
  }
  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || !email || !major || !year){
      setError("Please fill in all required fields");
      return;
    }
    try{      
       setError(null);
      setLoading(true);
      sendSignupRequest(name, email, message, major, year);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setMajor("");
      setyear("");
      setLoading(false);
    } catch (error) {
    setError("Error submitting request please try again later.");
      setSuccess(false);
      console.error("Error submitting signup request:", error);
      setLoading(false);
    }
    
  };
  return (
    <div className="flex min-h-screen sm:w-full  m-auto w-full items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-6xl max-h-screen  overflow-hidden lg: rounded-3xl bg-white shadow-2xl dark:bg-slate-900 relative">
        {/* Fixed Home Arrow */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-50 group flex items-center gap-2 text-sm text-white hover:text-slate-900  transition-all duration-300 px-4 py-2 rounded-full shadow-md ">
          <ArrowLeft className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1" />
        </Link>

        <div className="grid lg:grid-cols-2 relative lg:min-h-[700px]">
          {/* Image Section - Only on large screens with slide animation */}
          <div
            className={`hidden lg:block absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-red-200 via-green-200 to-blue-200 transition-transform duration-700 ease-in-out
              ${!join ? "translate-x-full" : "translate-x-0"}`}
            style={{ zIndex: 20 }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-green-200 to-blue-200 opacity-80"></div>
            <Image
              src="/image.png"
              width={400}
              height={400}
              blurDataURL="/image.png"
              placeholder="blur"
              alt="Auth background"
            loading="lazy"
              className="h-full w-full object-cover transition-all duration-1000"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 ">
              <div className="space-y-4 text-center">
                <h2 className="text-5xl font-bold  text-white dark:text-black  text-shadow-lg text-shadow-blue ">
                  {join? "Join Our Community" : "Welcome Back!"}
                </h2>
                <p className="text-lg text-white dark:text-slate-600 font-serif text-shadow-lg/30  ">
                  {join
                    ? "Become a member today and unlock exclusive benefits!"
                    : "Sign in to continue your amazing experience with us."}
                </p>
              </div>
            </div>
          </div>

          {/* Form Section - Full width on mobile, positioned on large screens */}
          <div
            className="flex items-center absolute    justify-center p-8 m-auto lg:p-12 lg:h-full lg:absolute w-full lg:w-1/2 transition-all duration-1000 ease-in-out"
            style={{
              left: !join ? 0 : "auto",
              right: !join ? "auto" : 0,
            }}>
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {join ? "Send join request" : "Sign in to your club space "}
                </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                 All fields marked with <span className="text-red-500">*</span> are required.
                </p>
              </div>

              <div className="w-full max-w-md space-y-8">

              <div className={!join ? "space-y-1" : "space-y-4"}>
                {/* Name Field */}
                <div
                  className={cn("transition-all duration-500 ease-in-out opacity-100 translate-y-0 space-y-2",
                    join
                      ? "opacity-100 translate-y-0 max-h-24"
                      : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
                  )}
                  >
                  <Label htmlFor="name">Full Name<span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    type="text"
                    placeholder="Kage"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email<span className="text-red-500">*</span> </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kage@example.com"
                    className="h-11"
                    required
                  />
                </div>
                   <div
                  className={cn("transition-all duration-500 ease-in-out opacity-100 translate-y-0 space-y-2",
                    join
                      ? "opacity-100 translate-y-0 max-h-24"
                      : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
                  )}
                  >
                  <Label htmlFor="major">Major <span className="text-red-500">*</span>  </Label>
                  <Input
                    id="major"
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="Enter your major"
                    className="h-11"
                    required
                  />

                </div>
                <div
                  className={cn("transition-all duration-500 ease-in-out opacity-100 translate-y-0 space-y-2",
                    join
                      ? "opacity-100 translate-y-0 max-h-24"
                      : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
                  )}
                  >
                  <Label htmlFor="year" >Year&apos;s number <span className="text-red-500">*</span>  </Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setyear(e.target.value)}
                    placeholder="Enter your year Number"
                    className="h-11"
                    required
                  />
                  </div>
               
               <div
                  className={cn("transition-all duration-500 ease-in-out opacity-100 translate-y-0 space-y-2",
                    join
                      ? "opacity-100 translate-y-0 max-h-24"
                      : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
                  )}
                  >
                  <Label htmlFor="message-request">Why do you want to join?</Label>
                  <Textarea
                    id="message-request"
                    rows={4}
                    placeholder="I would like to join... (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                 <div
                  className={cn("transition-all duration-500 ease-in-out opacity-100 translate-y-0 space-y-2",
                    !join
                      ? "opacity-100 translate-y-0 max-h-24"
                      : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
                  )}
                  >
                  <Label htmlFor="password" >Password <span className="text-red-500">*</span>  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11"
                    required
                  />
                  </div>
               
        
                {error && <p className="text-red-600 flex justify-center text-sm">{error}</p>}

          <Button
  type="button"
  disabled={loading}
  onClick={(e) => {
    e.preventDefault();
    if (loading) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    join ? handleSubmitJoin(e) : handleSubmitMember(e);
  }}
  className={cn(
    "h-8 w-[70%] flex justify-self-center cursor-pointer bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
    loading && "opacity-50 cursor-not-allowed",
    !join ? "mt-4" : "mt-1"
  )}
>
  {
    loading
      ? (join ? "Submitting..." : "Signing in...")
      : (join ? "Submit Request" : "Sign In")
  }
</Button>

                {/* Forgot Password */}
               <AlertDialogSeccess open={success} onOpenChange={()=>setSuccess(false)} />
              </div>
                {/* Forgot Password */}
               {!join && <div
                  className={`transition-all duration-500 ease-in-out ${
                    !join
                      ? "opacity-100 translate-y-0 max-h-40"
                      : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
                  }`}>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 cursor-pointer hover:underline dark:text-slate-400">
                        Forgot password?
                      </span>
                    </div>
                  </div>
           
                </div>}
                
              </div>

              <div className="text-center text-sm">
                <button
                  onClick={() => setjoin(!join)}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-300">
                  {join ? (
                    <>
                      Already in the club?{" "}
                      <span className="font-semibold bg-gradient-to-r from-red-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                        Sign in
                      </span>
                    </>
                  ) : (
                    <>
                      Not a member yet?{" "}
                      <span className="font-semibold bg-gradient-to-r from-red-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                        Join us
                      </span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="underline hover:text-slate-700 dark:hover:text-slate-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline hover:text-slate-700 dark:hover:text-slate-300">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
