import { type ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { type SignupInput, type SigninInput } from "@apurva-dev/blog-common";
import axios from "axios";


export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl sm:shadow-sm sm:border sm:border-slate-100">
                    <AuthHeader type={type} />
                    <AuthForm type={type} />
                </div>
            </div>
        </div>
    );
}

function AuthHeader({ type }: { type: "signup" | "signin" }) {
    return (
        <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900">
                {type === "signup" ? "Create an account" : "Welcome back"}
            </div>
            <div className="text-slate-500 mt-2 text-sm">
                {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                <Link 
                    className="pl-1 underline underline-offset-4 text-slate-900 font-medium hover:text-slate-700 transition-colors" 
                    to={type === "signin" ? "/signup" : "/signin"}
                >
                    {type === "signin" ? "Sign up" : "Login"}
                </Link>
            </div>
        </div>
    );
}

function AuthForm({ type }: { type: "signup" | "signin" }) {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput | SigninInput>(
        type === "signup" 
            ? { name: "", email: "", password: "" } 
            : { email: "", password: "" }
    );

    async function sendRequest() {
        try{
            const response = await axios.post(`${BACKEND_URL}/user/signup`, postInputs);
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        }
        catch(e){
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message)
            } else {
                alert("Error while signing up. Please try again.")
            }
        }
    }

    return (
        <div className="pt-8">
            {type === "signup" ? (
                <LabelledInput 
                    label="Name" 
                    placeholder="John Doe" 
                    onChange={(e) => {
                        setPostInputs({
                            ...(postInputs as SignupInput),
                            name: e.target.value
                        })
                    }} 
                />
            ) : null}
            
            <LabelledInput 
                label="Email" 
                placeholder="john@example.com" 
                type="email"
                onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        email: e.target.value
                    })
                }} 
            />
            
            <LabelledInput 
                label="Password" 
                type="password"
                placeholder=""
                onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        password: e.target.value
                    })
                }}
            />
            
            <button 
                onClick={sendRequest} 
                type="button" 
                className="mt-8 w-full text-white bg-slate-900 hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 font-medium rounded-xl text-sm px-5 py-3.5 focus:outline-none transition-colors shadow-sm cursor-pointer"
            >
                {type === "signup" ? "Sign up" : "Sign in"}
            </button>
        </div>
    );
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div className="mt-4 text-left">
            <label className="block mb-2 text-sm font-medium text-slate-900">
                {label}
            </label>
            <input 
                onChange={onChange} 
                type={type || "text"} 
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent block w-full p-3 transition-all outline-none" 
                placeholder={placeholder} 
                required 
            />
        </div>
    );
}