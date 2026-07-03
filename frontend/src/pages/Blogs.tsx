import { BlogCard } from "../components/BlogCard";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";


export const Blogs = ()=>{
    const {loading, blogs} = useBlogs();
    
    if(loading){
        return <div>Loading...</div>
    }
    return <div className="flex flex-col justify-center">
    <Appbar />
    <div className="flex flex-col items-center">
        <div className="max-w-xl">
        <BlogCard authorName="Apurv" title="How an ugly single page website ears $5000 a month with affiliate marketing" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." publishDate="1st Feb 2026"/>
        <BlogCard authorName="Apurv" title="How an ugly single page website ears $5000 a month with affiliate marketing" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." publishDate="1st Feb 2026"/>
        <BlogCard authorName="Apurv" title="How an ugly single page website ears $5000 a month with affiliate marketing" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod." publishDate="1st Feb 2026"/>
        </div>
    </div>
    </div>
}  