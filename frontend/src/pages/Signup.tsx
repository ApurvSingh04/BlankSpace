import { Quote } from "../components/Quote"
import { Auth } from "../components/Auth"
export const Signup = ()=>{
    return <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex justify-center items-center h-screen">
            <div>
                <Auth type="signup" />
            </div>
        </div>
        <div className="hidden lg:block">
            <Quote />

        </div>
    </div>
}